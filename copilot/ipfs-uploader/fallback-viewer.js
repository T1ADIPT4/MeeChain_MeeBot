/**
 * Fallback Viewer
 * Provides viewer functionality for fallback assets
 */

import { getConfig } from './config.js'

/**
 * Get viewer URL for an asset
 * @param {string} hash - IPFS or fallback hash
 * @param {boolean} isFallback - Whether this is a fallback asset
 * @returns {string} Viewer URL
 */
export function getViewerURL(hash, isFallback = false) {
  const config = getConfig()
  
  if (isFallback) {
    return `${config.fallbackGateway}/${hash}`
  }
  
  return `${config.ipfsGateway}/ipfs/${hash}`
}

/**
 * Get multiple gateway URLs for redundancy
 * @param {string} ipfsHash - IPFS hash
 * @returns {Array<string>} Array of gateway URLs
 */
export function getRedundantGateways(ipfsHash) {
  const gateways = [
    `https://ipfs.io/ipfs/${ipfsHash}`,
    `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    `https://dweb.link/ipfs/${ipfsHash}`,
  ]
  
  return gateways
}

/**
 * Check if an asset is available
 * @param {string} hash - Asset hash
 * @param {boolean} isFallback - Whether this is a fallback asset
 * @returns {Promise<Object>} Availability status
 */
export async function checkAvailability(hash, isFallback = false) {
  const url = getViewerURL(hash, isFallback)
  
  try {
    // In production, make actual HTTP request
    // const response = await fetch(url, { method: 'HEAD' })
    // return { available: response.ok, url }
    
    // Simulated check
    console.log(`🔍 Checking availability: ${url}`)
    
    return {
      available: true,
      url,
      hash,
      isFallback,
      checkedAt: new Date().toISOString()
    }
  } catch (error) {
    return {
      available: false,
      url,
      hash,
      isFallback,
      error: error.message,
      checkedAt: new Date().toISOString()
    }
  }
}

/**
 * Get fallback asset if primary is unavailable
 * @param {string} primaryHash - Primary IPFS hash
 * @param {string} fallbackHash - Fallback hash
 * @returns {Promise<Object>} Asset URL to use
 */
export async function getAssetWithFallback(primaryHash, fallbackHash) {
  console.log('🔍 Checking primary asset availability...')
  
  const primaryCheck = await checkAvailability(primaryHash, false)
  
  if (primaryCheck.available) {
    console.log('✅ Primary asset available')
    return {
      url: primaryCheck.url,
      hash: primaryHash,
      usedFallback: false
    }
  }
  
  console.log('⚠️  Primary asset unavailable, using fallback...')
  
  const fallbackCheck = await checkAvailability(fallbackHash, true)
  
  if (fallbackCheck.available) {
    console.log('✅ Fallback asset available')
    return {
      url: fallbackCheck.url,
      hash: fallbackHash,
      usedFallback: true
    }
  }
  
  throw new Error('Both primary and fallback assets are unavailable')
}

/**
 * Generate HTML viewer for an asset
 * @param {string} hash - Asset hash
 * @param {boolean} isFallback - Whether this is a fallback asset
 * @param {Object} metadata - Optional metadata
 * @returns {string} HTML content
 */
export function generateHTMLViewer(hash, isFallback = false, metadata = {}) {
  const url = getViewerURL(hash, isFallback)
  const redundantGateways = isFallback ? [] : getRedundantGateways(hash)
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.name || 'MeeChain Badge'}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 30px;
      backdrop-filter: blur(10px);
    }
    .badge-image {
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .info {
      margin-top: 20px;
    }
    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.2);
      margin: 5px;
    }
    .fallback-warning {
      background: rgba(255, 152, 0, 0.3);
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .gateway-list {
      margin-top: 20px;
    }
    .gateway-link {
      display: block;
      color: #ffd700;
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${metadata.name || 'MeeChain Badge'}</h1>
    <img src="${url}" alt="Badge" class="badge-image" onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"400\\" height=\\"400\\"><rect fill=\\"%23333\\" width=\\"400\\" height=\\"400\\"/><text fill=\\"white\\" x=\\"50%\\" y=\\"50%\\" text-anchor=\\"middle\\">Image not available</text></svg>'">
    
    <div class="info">
      <h2>Badge Information</h2>
      <p>${metadata.description || 'MeeChain quest completion badge'}</p>
      <div>
        <span class="badge">Storage: ${isFallback ? 'Fallback' : 'IPFS'}</span>
        <span class="badge">Hash: ${hash.substring(0, 12)}...</span>
      </div>
    </div>
    
    ${isFallback ? `
      <div class="fallback-warning">
        ⚠️ This badge is using fallback storage. The primary IPFS version may be temporarily unavailable.
      </div>
    ` : ''}
    
    ${redundantGateways.length > 0 ? `
      <div class="gateway-list">
        <h3>Alternative Gateways</h3>
        ${redundantGateways.map(gw => `<a href="${gw}" class="gateway-link" target="_blank">${gw}</a>`).join('')}
      </div>
    ` : ''}
  </div>
</body>
</html>
  `.trim()
  
  return html
}

/**
 * Export viewer configuration
 * @returns {Object} Viewer configuration
 */
export function getViewerConfig() {
  const config = getConfig()
  
  return {
    ipfsGateway: config.ipfsGateway,
    fallbackGateway: config.fallbackGateway,
    redundantGateways: [
      'https://ipfs.io',
      'https://cloudflare-ipfs.com',
      'https://gateway.pinata.cloud',
      'https://dweb.link'
    ]
  }
}
