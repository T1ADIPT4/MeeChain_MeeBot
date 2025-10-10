/**
 * IPFS Uploader - Main Logic
 * Handles file uploads to IPFS with fallback support and retry logic
 */

const fs = require('fs')
const path = require('path')
const config = require('./config')
const { validateFile, validateMetadata } = require('./utils/validate')
const { generateFileHash, validateCID, buildGatewayURL, generateUploadId } = require('./utils/hash')
const { generateBadgeMetadata, generateFallbackMetadata } = require('./metadata-generator')
const { getFallbackAssetPath, hasFallbackAsset } = require('./fallback-viewer')

/**
 * Mock IPFS upload function (replace with actual IPFS client in production)
 * @param {Buffer} fileData - File data to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with CID
 */
async function mockIPFSUpload(fileData, options = {}) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
  
  // Simulate upload with mock CID
  const mockCID = `Qm${generateFileHash(fileData).substring(0, 44)}`
  
  if (config.enableLogging) {
    console.log(`📤 [IPFS Upload] Size: ${fileData.length} bytes, CID: ${mockCID}`)
  }
  
  return {
    success: true,
    cid: mockCID,
    size: fileData.length,
    timestamp: new Date().toISOString()
  }
}

/**
 * Upload file to IPFS with retry logic
 * @param {string} filePath - Path to file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
async function uploadFile(filePath, options = {}) {
  const uploadId = generateUploadId(path.basename(filePath), options.questId || 'unknown')
  
  if (config.enableLogging) {
    console.log(`🚀 [Upload Start] Upload ID: ${uploadId}, File: ${filePath}`)
  }
  
  // Validate file before upload
  const validation = validateFile(filePath)
  if (!validation.valid) {
    return {
      success: false,
      uploadId,
      error: validation.error,
      usedFallback: false
    }
  }
  
  let lastError = null
  let attempts = 0
  const maxAttempts = config.retryOnFail ? config.maxRetries : 1
  
  // Try primary endpoint with retries
  while (attempts < maxAttempts) {
    attempts++
    
    try {
      if (config.enableLogging && attempts > 1) {
        console.log(`🔄 [Retry] Attempt ${attempts}/${maxAttempts}`)
      }
      
      const fileData = fs.readFileSync(filePath)
      const result = await mockIPFSUpload(fileData, options)
      
      if (result.success) {
        const gatewayUrl = buildGatewayURL(result.cid, config.ipfsGateway)
        
        if (config.enableLogging) {
          console.log(`✅ [Upload Success] CID: ${result.cid}`)
          console.log(`🔗 [Gateway URL] ${gatewayUrl}`)
        }
        
        return {
          success: true,
          uploadId,
          cid: result.cid,
          gatewayUrl,
          ipfsUrl: `ipfs://${result.cid}`,
          size: result.size,
          attempts,
          usedFallback: false,
          timestamp: result.timestamp
        }
      }
    } catch (error) {
      lastError = error
      
      if (config.enableLogging) {
        console.error(`❌ [Upload Error] Attempt ${attempts}: ${error.message}`)
      }
      
      // Wait before retry
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay))
      }
    }
  }
  
  // If all retries failed, try fallback endpoints
  if (config.fallbackEndpoints && config.fallbackEndpoints.length > 0) {
    for (const endpoint of config.fallbackEndpoints) {
      try {
        if (config.enableLogging) {
          console.log(`🔄 [Fallback Endpoint] Trying: ${endpoint}`)
        }
        
        const fileData = fs.readFileSync(filePath)
        const result = await mockIPFSUpload(fileData, { ...options, endpoint })
        
        if (result.success) {
          const gatewayUrl = buildGatewayURL(result.cid, config.ipfsGateway)
          
          if (config.enableLogging) {
            console.log(`✅ [Fallback Success] CID: ${result.cid}`)
          }
          
          return {
            success: true,
            uploadId,
            cid: result.cid,
            gatewayUrl,
            ipfsUrl: `ipfs://${result.cid}`,
            size: result.size,
            usedFallback: true,
            fallbackEndpoint: endpoint,
            timestamp: result.timestamp
          }
        }
      } catch (error) {
        lastError = error
      }
    }
  }
  
  // All attempts failed - use local fallback
  if (config.enableLogging) {
    console.error(`❌ [Upload Failed] All endpoints failed. Using local fallback.`)
  }
  
  return {
    success: false,
    uploadId,
    error: lastError?.message || 'Upload failed',
    attempts,
    usedFallback: true,
    fallbackPath: config.fallbackAssetPath,
    timestamp: new Date().toISOString()
  }
}

/**
 * Upload metadata to IPFS
 * @param {Object} metadata - Metadata object
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
async function uploadMetadata(metadata, options = {}) {
  // Validate metadata
  const validation = validateMetadata(metadata)
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    }
  }
  
  const metadataJSON = JSON.stringify(metadata, null, 2)
  const metadataBuffer = Buffer.from(metadataJSON, 'utf-8')
  
  try {
    const result = await mockIPFSUpload(metadataBuffer, options)
    
    if (result.success) {
      const gatewayUrl = buildGatewayURL(result.cid, config.ipfsGateway)
      
      if (config.enableLogging) {
        console.log(`✅ [Metadata Uploaded] CID: ${result.cid}`)
      }
      
      return {
        success: true,
        cid: result.cid,
        gatewayUrl,
        ipfsUrl: `ipfs://${result.cid}`,
        metadata,
        timestamp: result.timestamp
      }
    }
  } catch (error) {
    if (config.enableLogging) {
      console.error(`❌ [Metadata Upload Error] ${error.message}`)
    }
    
    return {
      success: false,
      error: error.message,
      metadata
    }
  }
}

/**
 * Upload badge with metadata
 * @param {Object} badgeOptions - Badge upload options
 * @returns {Promise<Object>} Complete upload result
 * 
 * Note: For milestone logging integration, see copilot/implement-ipfs-uploader/index.js
 * which demonstrates how to log milestones after badge upload for MeeBot feedback.
 */
async function uploadBadge(badgeOptions) {
  const {
    filePath,
    questId,
    badgeId,
    name,
    description,
    attributes = {}
  } = badgeOptions
  
  if (config.enableLogging) {
    console.log(`\n🎯 [Badge Upload] Quest: ${questId}, Badge: ${badgeId || 'auto'}`)
  }
  
  // Upload image first
  const imageUpload = await uploadFile(filePath, { questId })
  
  if (!imageUpload.success) {
    // Use fallback asset if available
    if (hasFallbackAsset(questId, badgeId)) {
      const fallbackPath = getFallbackAssetPath(questId, badgeId)
      const fallbackMetadata = generateFallbackMetadata({ questId, badgeId, chain: attributes.chain })
      
      if (config.enableLogging) {
        console.log(`🟠 [Using Fallback] Path: ${fallbackPath}`)
      }
      
      return {
        success: true,
        isFallback: true,
        imageUrl: `/assets/fallback/${path.basename(fallbackPath)}`,
        metadata: fallbackMetadata,
        error: imageUpload.error
      }
    }
    
    return {
      success: false,
      error: imageUpload.error
    }
  }
  
  // Generate metadata with uploaded image
  const metadata = generateBadgeMetadata({
    name: name || `MeeChain Badge - ${questId}`,
    description: description || `Achievement badge for completing quest ${questId}`,
    imageUrl: imageUpload.ipfsUrl,
    questId,
    badgeId,
    attributes
  })
  
  // Upload metadata
  const metadataUpload = await uploadMetadata(metadata, { questId })
  
  return {
    success: true,
    isFallback: false,
    imageCID: imageUpload.cid,
    imageUrl: imageUpload.gatewayUrl,
    metadataCID: metadataUpload.success ? metadataUpload.cid : null,
    metadataUrl: metadataUpload.success ? metadataUpload.gatewayUrl : null,
    metadata,
    uploadDetails: {
      imageUpload,
      metadataUpload
    }
  }
}

/**
 * Batch upload multiple badges
 * @param {Array} badges - Array of badge options
 * @returns {Promise<Array>} Array of upload results
 */
async function uploadBadges(badges) {
  const results = []
  
  for (let i = 0; i < badges.length; i++) {
    const badge = badges[i]
    
    if (config.enableLogging) {
      console.log(`\n📦 [Batch Upload] Processing ${i + 1}/${badges.length}`)
    }
    
    const result = await uploadBadge(badge)
    results.push({
      index: i,
      badge,
      ...result
    })
  }
  
  return results
}

module.exports = {
  uploadFile,
  uploadMetadata,
  uploadBadge,
  uploadBadges,
  config
}
