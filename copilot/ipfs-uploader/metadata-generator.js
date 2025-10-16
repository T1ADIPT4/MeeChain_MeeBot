/**
 * NFT Metadata Generator
 * Generates ERC-721 compliant metadata for badge NFTs
 */

const config = require('./config')
const { generateMetadataHash } = require('./utils/hash')

/**
 * Generate NFT metadata for a badge
 * @param {Object} options - Metadata options
 * @param {string} options.name - Badge name
 * @param {string} options.description - Badge description
 * @param {string} options.imageUrl - IPFS URL or gateway URL of the badge image
 * @param {string} options.questId - Quest ID associated with the badge
 * @param {string} options.badgeId - Badge ID
 * @param {Object} [options.attributes] - Additional attributes for the badge
 * @returns {Object} ERC-721 compliant metadata
 */
function generateBadgeMetadata(options) {
  const {
    name,
    description,
    imageUrl,
    questId,
    badgeId,
    attributes = {}
  } = options

  // Validate required fields
  if (!name || !description || !imageUrl) {
    throw new Error('Missing required metadata fields: name, description, imageUrl')
  }

  // Base metadata following ERC-721 standard
  const metadata = {
    name,
    description,
    image: imageUrl,
    external_url: `https://meechain.io/badges/${badgeId || questId}`,
    
    // MeeChain specific attributes
    attributes: [
      {
        trait_type: 'Quest ID',
        value: questId
      },
      {
        trait_type: 'Badge Type',
        value: attributes.badgeType || 'Achievement'
      },
      {
        trait_type: 'Rarity',
        value: attributes.rarity || 'Common'
      },
      {
        trait_type: 'Chain',
        value: attributes.chain || 'polygon'
      },
      {
        display_type: 'date',
        trait_type: 'Minted',
        value: attributes.mintedAt || Math.floor(Date.now() / 1000)
      }
    ],
    
    // Additional properties
    properties: {
      questId,
      badgeId: badgeId || `badge-${questId}`,
      version: config.metadataVersion,
      schema: config.metadataSchema,
      ...attributes.properties
    }
  }

  // Add any custom attributes
  if (attributes.customAttributes && Array.isArray(attributes.customAttributes)) {
    metadata.attributes.push(...attributes.customAttributes)
  }

  // Add metadata hash for integrity verification
  metadata.metadataHash = generateMetadataHash(metadata)

  return metadata
}

/**
 * Generate metadata for multiple badges
 * @param {Array} badges - Array of badge options
 * @returns {Array} Array of metadata objects
 */
function generateBatchMetadata(badges) {
  if (!Array.isArray(badges)) {
    throw new Error('Badges must be an array')
  }

  return badges.map((badge, index) => {
    try {
      return {
        success: true,
        metadata: generateBadgeMetadata(badge),
        index
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        index
      }
    }
  })
}

/**
 * Generate fallback metadata (used when IPFS is unavailable)
 * @param {Object} options - Metadata options
 * @returns {Object} Fallback metadata
 */
function generateFallbackMetadata(options) {
  const { questId, badgeId, chain } = options

  return {
    name: `MeeChain Badge - ${questId}`,
    description: 'This badge is temporarily using fallback metadata. Full metadata will be available once IPFS is restored.',
    image: `/assets/fallback/badge-placeholder.png`,
    external_url: `https://meechain.io/badges/${badgeId || questId}`,
    attributes: [
      {
        trait_type: 'Status',
        value: 'Fallback'
      },
      {
        trait_type: 'Quest ID',
        value: questId
      },
      {
        trait_type: 'Chain',
        value: chain || 'unknown'
      }
    ],
    properties: {
      questId,
      badgeId: badgeId || `badge-${questId}`,
      isFallback: true,
      version: config.metadataVersion
    }
  }
}

/**
 * Validate metadata compliance with ERC-721 standard
 * @param {Object} metadata - Metadata to validate
 * @returns {Object} Validation result
 */
function validateMetadataCompliance(metadata) {
  const errors = []

  // Check required ERC-721 fields
  if (!metadata.name) errors.push('Missing required field: name')
  if (!metadata.description) errors.push('Missing required field: description')
  if (!metadata.image) errors.push('Missing required field: image')

  // Check field types
  if (metadata.name && typeof metadata.name !== 'string') {
    errors.push('Field "name" must be a string')
  }
  if (metadata.description && typeof metadata.description !== 'string') {
    errors.push('Field "description" must be a string')
  }
  if (metadata.image && typeof metadata.image !== 'string') {
    errors.push('Field "image" must be a string')
  }

  // Check attributes structure
  if (metadata.attributes && !Array.isArray(metadata.attributes)) {
    errors.push('Field "attributes" must be an array')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

module.exports = {
  generateBadgeMetadata,
  generateBatchMetadata,
  generateFallbackMetadata,
  validateMetadataCompliance
}
