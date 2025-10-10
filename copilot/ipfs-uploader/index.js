/**
 * IPFS Uploader - Main uploader logic
 * Handles file uploads to IPFS with fallback support
 */

import { getConfig } from './config.js'
import { generateMetadata } from './metadata-generator.js'
import { validateFile } from './utils/validate.js'

// Note: In production, import MeeBot from the components directory
// import { MeeBot } from '../../components/MeeBot.tsx'
// For now, we'll use a mock MeeBot for demonstration
const MeeBot = {
  setSprite: (emotion) => console.log(`🤖 MeeBot: Setting sprite to "${emotion}"`),
  speak: (message) => console.log(`🔊 MeeBot speaks: "${message}"`)
}

/**
 * Upload a file to IPFS
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with IPFS hash and metadata
 */
export async function uploadToIPFS(filePath, options = {}) {
  const config = getConfig()
  
  console.log(`📤 Starting IPFS upload for: ${filePath}`)
  MeeBot.setSprite('loading')
  MeeBot.speak('กำลังอัปโหลดไฟล์ไปยัง IPFS นะครับ')
  
  try {
    // Validate file before upload
    const validation = await validateFile(filePath)
    if (!validation.valid) {
      throw new Error(`File validation failed: ${validation.error}`)
    }
    
    console.log(`✅ File validated: ${validation.fileSize} bytes`)
    
    // Simulate IPFS upload (replace with actual IPFS client in production)
    const ipfsHash = await simulateIPFSUpload(filePath, config)
    
    // Generate NFT metadata
    const metadata = await generateMetadata({
      ipfsHash,
      fileName: validation.fileName,
      fileSize: validation.fileSize,
      mimeType: validation.mimeType,
      ...options
    })
    
    console.log(`✅ Upload successful! IPFS Hash: ${ipfsHash}`)
    MeeBot.setSprite('happy')
    MeeBot.speak('อัปโหลดสำเร็จแล้วครับ! ได้รับ IPFS hash แล้ว')
    
    return {
      success: true,
      ipfsHash,
      metadata,
      url: `${config.ipfsGateway}/ipfs/${ipfsHash}`
    }
    
  } catch (error) {
    console.error(`❌ IPFS upload failed: ${error.message}`)
    
    // Use fallback if IPFS fails
    if (config.useFallback) {
      console.log(`🔄 Attempting fallback upload...`)
      MeeBot.setSprite('confused')
      MeeBot.speak('IPFS มีปัญหา กำลังใช้ระบบสำรองนะครับ')
      
      return await uploadToFallback(filePath, options)
    }
    
    MeeBot.setSprite('sad')
    MeeBot.speak('ขออภัย การอัปโหลดล้มเหลวนะครับ')
    
    throw error
  }
}

/**
 * Upload to fallback storage when IPFS fails
 * @param {string} filePath - Path to the file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Fallback upload result
 */
async function uploadToFallback(filePath, options) {
  const config = getConfig()
  
  console.log(`📦 Using fallback storage: ${config.fallbackStorage}`)
  
  // Validate file
  const validation = await validateFile(filePath)
  
  // Simulate fallback upload
  const fallbackHash = await simulateFallbackUpload(filePath, config)
  
  // Generate metadata with fallback flag
  const metadata = await generateMetadata({
    fallbackHash,
    fileName: validation.fileName,
    fileSize: validation.fileSize,
    mimeType: validation.mimeType,
    isFallback: true,
    ...options
  })
  
  console.log(`✅ Fallback upload successful! Hash: ${fallbackHash}`)
  MeeBot.setSprite('neutral')
  MeeBot.speak('ใช้ระบบสำรองสำเร็จแล้วครับ ไฟล์ของคุณปลอดภัย!')
  
  return {
    success: true,
    fallbackHash,
    metadata,
    url: `${config.fallbackGateway}/${fallbackHash}`,
    isFallback: true
  }
}

/**
 * Simulate IPFS upload (replace with actual IPFS client)
 * @param {string} filePath - Path to file
 * @param {Object} config - Configuration
 * @returns {Promise<string>} IPFS hash
 */
async function simulateIPFSUpload(filePath, config) {
  // In production, use actual IPFS client like ipfs-http-client
  // const ipfs = create({ url: config.ipfsEndpoint })
  // const { cid } = await ipfs.add(fs.readFileSync(filePath))
  // return cid.toString()
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (config.simulateIPFSFailure) {
        reject(new Error('Simulated IPFS failure'))
      } else {
        // Generate mock IPFS hash
        const hash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        resolve(hash)
      }
    }, 1000)
  })
}

/**
 * Simulate fallback upload
 * @param {string} filePath - Path to file
 * @param {Object} config - Configuration
 * @returns {Promise<string>} Fallback hash
 */
async function simulateFallbackUpload(filePath, config) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock fallback hash
      const hash = 'fallback_' + Math.random().toString(36).substring(2, 15)
      resolve(hash)
    }, 500)
  })
}

/**
 * Upload multiple files to IPFS
 * @param {Array<string>} filePaths - Array of file paths
 * @param {Object} options - Upload options
 * @returns {Promise<Array<Object>>} Array of upload results
 */
export async function uploadBatch(filePaths, options = {}) {
  console.log(`📤 Starting batch upload of ${filePaths.length} files`)
  MeeBot.setSprite('loading')
  MeeBot.speak(`กำลังอัปโหลด ${filePaths.length} ไฟล์นะครับ`)
  
  const results = []
  
  for (const filePath of filePaths) {
    try {
      const result = await uploadToIPFS(filePath, options)
      results.push(result)
    } catch (error) {
      results.push({
        success: false,
        filePath,
        error: error.message
      })
    }
  }
  
  const successCount = results.filter(r => r.success).length
  console.log(`✅ Batch upload complete: ${successCount}/${filePaths.length} successful`)
  
  MeeBot.setSprite(successCount === filePaths.length ? 'happy' : 'neutral')
  MeeBot.speak(`อัปโหลดเสร็จแล้ว ${successCount} ไฟล์จาก ${filePaths.length} ไฟล์`)
  
  return results
}
