/**
 * Fallback-aware IPFS Configuration
 * Provides configuration with fallback endpoints and retry logic
 */

module.exports = {
  // Primary IPFS endpoint with fallback
  ipfsEndpoint: process.env.IPFS_ENDPOINT || 'https://ipfs.infura.io:5001',
  
  // Fallback IPFS endpoints (used if primary fails)
  fallbackEndpoints: [
    'https://api.pinata.cloud/pinning',
    'https://ipfs.io',
    'https://dweb.link'
  ],
  
  // Request timeout in milliseconds
  timeout: parseInt(process.env.IPFS_TIMEOUT) || 5000,
  
  // Retry configuration
  retryOnFail: process.env.IPFS_RETRY !== 'false',
  maxRetries: parseInt(process.env.IPFS_MAX_RETRIES) || 3,
  retryDelay: parseInt(process.env.IPFS_RETRY_DELAY) || 1000,
  
  // Fallback asset path (local fallback if IPFS is unavailable)
  fallbackAssetPath: process.env.FALLBACK_ASSET_PATH || './assets/fallback/',
  
  // Badge asset path
  badgeAssetPath: process.env.BADGE_ASSET_PATH || './assets/badges/',
  
  // IPFS gateway for retrieval
  ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
  
  // API keys (if required by the IPFS provider)
  apiKey: process.env.IPFS_API_KEY || '',
  apiSecret: process.env.IPFS_API_SECRET || '',
  
  // Pinata specific config (if using Pinata)
  pinataJWT: process.env.PINATA_JWT || '',
  
  // File validation settings
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'],
  
  // Metadata settings
  metadataVersion: '1.0.0',
  metadataSchema: 'ERC721',
  
  // Logging
  enableLogging: process.env.ENABLE_LOGGING !== 'false',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Simulation mode (skip actual IPFS upload for testing)
  simulationMode: process.env.SIMULATION_MODE === 'true'
}
