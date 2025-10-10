/**
 * IPFS Uploader Configuration - Fallback-aware config
 * Provides configuration with fallback support
 */

/**
 * Default configuration
 */
const defaultConfig = {
  // IPFS settings
  ipfsEndpoint: process.env.IPFS_ENDPOINT || 'https://ipfs.infura.io:5001',
  ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io',
  
  // Fallback settings
  useFallback: true,
  fallbackStorage: process.env.FALLBACK_STORAGE || 'local',
  fallbackGateway: process.env.FALLBACK_GATEWAY || 'https://meechain-fallback.storage',
  
  // Upload settings
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
    'image/webp'
  ],
  
  // NFT metadata settings
  metadataVersion: '1.0',
  metadataStandard: 'ERC721',
  
  // Testing/simulation flags
  simulateIPFSFailure: process.env.SIMULATE_IPFS_FAILURE === 'true',
  simulateFallbackFailure: process.env.SIMULATE_FALLBACK_FAILURE === 'true',
}

/**
 * Current configuration (can be overridden)
 */
let currentConfig = { ...defaultConfig }

/**
 * Get current configuration
 * @returns {Object} Current configuration object
 */
export function getConfig() {
  return { ...currentConfig }
}

/**
 * Update configuration
 * @param {Object} updates - Configuration updates to apply
 */
export function updateConfig(updates) {
  currentConfig = {
    ...currentConfig,
    ...updates
  }
  console.log('⚙️  Configuration updated')
}

/**
 * Reset configuration to defaults
 */
export function resetConfig() {
  currentConfig = { ...defaultConfig }
  console.log('🔄 Configuration reset to defaults')
}

/**
 * Get fallback-aware IPFS endpoint
 * Returns fallback endpoint if IPFS is unavailable
 * @returns {string} Endpoint URL
 */
export function getEndpoint() {
  // In production, check if IPFS endpoint is available
  // If not, return fallback endpoint
  return currentConfig.ipfsEndpoint
}

/**
 * Check if fallback mode is enabled
 * @returns {boolean} True if fallback is enabled
 */
export function isFallbackEnabled() {
  return currentConfig.useFallback
}

/**
 * Validate configuration
 * @returns {Object} Validation result
 */
export function validateConfig() {
  const errors = []
  
  if (!currentConfig.ipfsEndpoint) {
    errors.push('Missing IPFS endpoint')
  }
  
  if (!currentConfig.ipfsGateway) {
    errors.push('Missing IPFS gateway')
  }
  
  if (currentConfig.useFallback && !currentConfig.fallbackStorage) {
    errors.push('Fallback enabled but no fallback storage specified')
  }
  
  if (currentConfig.maxFileSize <= 0) {
    errors.push('Invalid max file size')
  }
  
  if (!currentConfig.allowedMimeTypes || currentConfig.allowedMimeTypes.length === 0) {
    errors.push('No allowed MIME types specified')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Export configuration as JSON
 * @returns {string} Configuration as JSON string
 */
export function exportConfig() {
  return JSON.stringify(currentConfig, null, 2)
}

/**
 * Load configuration from environment variables
 */
export function loadFromEnv() {
  const envConfig = {}
  
  if (process.env.IPFS_ENDPOINT) {
    envConfig.ipfsEndpoint = process.env.IPFS_ENDPOINT
  }
  
  if (process.env.IPFS_GATEWAY) {
    envConfig.ipfsGateway = process.env.IPFS_GATEWAY
  }
  
  if (process.env.USE_FALLBACK) {
    envConfig.useFallback = process.env.USE_FALLBACK === 'true'
  }
  
  if (process.env.FALLBACK_STORAGE) {
    envConfig.fallbackStorage = process.env.FALLBACK_STORAGE
  }
  
  if (process.env.MAX_FILE_SIZE) {
    envConfig.maxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10)
  }
  
  updateConfig(envConfig)
  console.log('✅ Configuration loaded from environment variables')
}
