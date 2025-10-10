/**
 * IPFS Uploader Configuration
 * Fallback-aware configuration for metadata generation and upload
 */

const path = require('path');

const config = {
  // Directory paths (relative to project root, not this file)
  BADGE_DIR: path.resolve(process.cwd(), 'copilot/assets/badges'),
  FALLBACK_DIR: path.resolve(process.cwd(), 'copilot/assets/fallback'),
  METADATA_DIR: path.resolve(process.cwd(), 'copilot/ipfs-uploader/metadata'),
  
  // IPFS settings (simulated)
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
  IPFS_API_URL: 'http://localhost:5001', // Local IPFS node (if available)
  
  // Upload settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
  UPLOAD_TIMEOUT: 30000, // ms
  
  // Fallback behavior
  USE_FALLBACK_ON_ERROR: true,
  FALLBACK_PREFIX: 'fallback://',
  
  // Milestone logging
  MILESTONE_LOG: path.resolve(process.cwd(), 'copilot/milestone.log'),
  
  // Metadata template
  DEFAULT_ATTRIBUTES: [
    { trait_type: 'Uploader', value: 'MeeChain' },
    { trait_type: 'Network', value: 'IPFS' }
  ]
};

module.exports = config;
