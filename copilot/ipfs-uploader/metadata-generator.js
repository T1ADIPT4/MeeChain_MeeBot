/**
 * NFT Metadata Generator
 * Creates metadata for NFT minting following ERC721 standard
 */

import { getConfig } from './config.js'

/**
 * Generate NFT metadata for a badge
 * @param {Object} options - Metadata options
 * @returns {Promise<Object>} Generated metadata
 */
export async function generateMetadata(options) {
  const config = getConfig()
  const timestamp = new Date().toISOString()
  
  const {
    ipfsHash,
    fallbackHash,
    fileName,
    fileSize,
    mimeType,
    questId,
    badgeName,
    badgeDescription,
    attributes = [],
    isFallback = false
  } = options
  
  // Base metadata following ERC721 standard
  const metadata = {
    // Metadata standard
    version: config.metadataVersion,
    standard: config.metadataStandard,
    
    // NFT information
    name: badgeName || `MeeChain Badge - ${questId || 'Unknown'}`,
    description: badgeDescription || 'MeeChain quest completion badge',
    
    // Image URI
    image: isFallback 
      ? `${config.fallbackGateway}/${fallbackHash}`
      : `${config.ipfsGateway}/ipfs/${ipfsHash}`,
    
    // External URL
    external_url: `${config.externalBaseUrl}/badge/${questId || 'unknown'}`,
    
    // File information
    file: {
      name: fileName,
      size: fileSize,
      mimeType: mimeType,
      hash: ipfsHash || fallbackHash,
      uploadedAt: timestamp
    },
    
    // Attributes for OpenSea and other marketplaces
    attributes: [
      {
        trait_type: 'Quest ID',
        value: questId || 'N/A'
      },
      {
        trait_type: 'Storage Type',
        value: isFallback ? 'Fallback' : 'IPFS'
      },
      {
        trait_type: 'Upload Date',
        display_type: 'date',
        value: Math.floor(Date.parse(timestamp) / 1000)
      },
      ...attributes
    ],
    
    // MeeChain-specific properties
    properties: {
      questId: questId || null,
      isFallback: isFallback,
      network: process.env.NETWORK || 'polygon',
      metadataVersion: config.metadataVersion,
      generatedAt: timestamp
    }
  }
  
  console.log(`📝 Generated metadata for: ${metadata.name}`)
  
  return metadata
}

/**
 * Generate metadata for a batch of badges
 * @param {Array<Object>} badges - Array of badge data
 * @returns {Promise<Array<Object>>} Array of metadata objects
 */
export async function generateBatchMetadata(badges) {
  console.log(`📝 Generating metadata for ${badges.length} badges`)
  
  const metadataList = []
  
  for (const badge of badges) {
    const metadata = await generateMetadata(badge)
    metadataList.push(metadata)
  }
  
  console.log(`✅ Generated ${metadataList.length} metadata objects`)
  
  return metadataList
}

/**
 * Validate metadata against ERC721 standard
 * @param {Object} metadata - Metadata to validate
 * @returns {Object} Validation result
 */
export function validateMetadata(metadata) {
  const errors = []
  const warnings = []
  
  // Required fields
  if (!metadata.name) {
    errors.push('Missing required field: name')
  }
  
  if (!metadata.description) {
    warnings.push('Missing recommended field: description')
  }
  
  if (!metadata.image) {
    errors.push('Missing required field: image')
  }
  
  // Check attributes
  if (!metadata.attributes || !Array.isArray(metadata.attributes)) {
    warnings.push('Missing or invalid attributes array')
  }
  
  // Check image URL
  if (metadata.image) {
    if (!metadata.image.startsWith('http://') && !metadata.image.startsWith('https://')) {
      errors.push('Image URL must start with http:// or https://')
    }
  }
  
  // Check external_url if present
  if (metadata.external_url) {
    if (!metadata.external_url.startsWith('http://') && !metadata.external_url.startsWith('https://')) {
      warnings.push('External URL should start with http:// or https://')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Export metadata to JSON file format
 * @param {Object} metadata - Metadata object
 * @returns {string} JSON string
 */
export function exportMetadataJSON(metadata) {
  return JSON.stringify(metadata, null, 2)
}

/**
 * Create metadata URI for on-chain reference
 * @param {Object} metadata - Metadata object
 * @param {string} ipfsHash - IPFS hash of metadata JSON
 * @returns {string} Metadata URI
 */
export function createMetadataURI(metadata, ipfsHash) {
  const config = getConfig()
  
  if (metadata.properties?.isFallback) {
    // Use fallback URI
    return `${config.fallbackGateway}/metadata/${ipfsHash}`
  }
  
  // Use IPFS URI
  return `ipfs://${ipfsHash}`
}

/**
 * Add custom attribute to metadata
 * @param {Object} metadata - Metadata object
 * @param {string} traitType - Trait type name
 * @param {any} value - Trait value
 * @param {string} displayType - Optional display type (e.g., 'date', 'number')
 * @returns {Object} Updated metadata
 */
export function addAttribute(metadata, traitType, value, displayType = null) {
  if (!metadata.attributes) {
    metadata.attributes = []
  }
  
  const attribute = {
    trait_type: traitType,
    value: value
  }
  
  if (displayType) {
    attribute.display_type = displayType
  }
  
  metadata.attributes.push(attribute)
  
  return metadata
}
