/**
 * Metadata Generator
 * Generates NFT metadata with fallback support for MeeChain badges
 */

const path = require('path');
const config = require('./config.cjs');

/**
 * Generate metadata for a badge file
 * @param {string} fileName - Name of the badge file
 * @param {Object} options - Additional options for metadata generation
 * @returns {Object} - NFT metadata object
 */
function generateMetadata(fileName, options = {}) {
  const name = path.basename(fileName, path.extname(fileName));
  const fallbackPath = path.join(config.FALLBACK_DIR, fileName);
  
  // Base metadata structure
  const metadata = {
    name: `Badge: ${name}`,
    description: options.description || `NFT badge for ${name}`,
    image: '', // Will be filled after upload
    fallback_image: `${config.FALLBACK_PREFIX}${fallbackPath}`,
    attributes: [
      { trait_type: 'Milestone', value: name },
      ...config.DEFAULT_ATTRIBUTES
    ]
  };
  
  // Add custom attributes if provided
  if (options.attributes && Array.isArray(options.attributes)) {
    metadata.attributes.push(...options.attributes);
  }
  
  // Add quest ID if provided
  if (options.questId) {
    metadata.attributes.push({
      trait_type: 'Quest',
      value: options.questId
    });
  }
  
  // Add rarity if provided
  if (options.rarity) {
    metadata.attributes.push({
      trait_type: 'Rarity',
      value: options.rarity
    });
  }
  
  return metadata;
}

/**
 * Update metadata with IPFS hash
 * @param {Object} metadata - Metadata object to update
 * @param {string} ipfsHash - IPFS hash of uploaded file
 * @returns {Object} - Updated metadata
 */
function updateMetadataWithHash(metadata, ipfsHash) {
  return {
    ...metadata,
    image: `ipfs://${ipfsHash}`
  };
}

/**
 * Generate metadata for fallback scenario
 * @param {string} fileName - Name of the badge file
 * @param {string} error - Error message that caused fallback
 * @returns {Object} - Metadata with fallback image
 */
function generateFallbackMetadata(fileName, error) {
  const metadata = generateMetadata(fileName);
  
  // Use fallback image instead of IPFS
  metadata.image = metadata.fallback_image;
  
  // Add fallback indicator
  metadata.attributes.push({
    trait_type: 'Upload Status',
    value: 'Fallback'
  });
  
  metadata.attributes.push({
    trait_type: 'Fallback Reason',
    value: error || 'Upload failed'
  });
  
  return metadata;
}

module.exports = {
  generateMetadata,
  updateMetadataWithHash,
  generateFallbackMetadata
};
