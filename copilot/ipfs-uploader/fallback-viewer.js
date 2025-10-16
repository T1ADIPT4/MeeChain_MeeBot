/**
 * Fallback Asset Viewer
 * Provides viewing capabilities for fallback assets when IPFS is unavailable
 */

const fs = require('fs')
const path = require('path')
const config = require('./config')

/**
 * Get fallback asset path for a badge
 * @param {string} questId - Quest ID
 * @param {string} [badgeId] - Badge ID (optional)
 * @returns {string} Path to fallback asset
 */
function getFallbackAssetPath(questId, badgeId) {
  const fallbackDir = path.resolve(config.fallbackAssetPath)
  const assetName = badgeId || questId
  
  // Try different file extensions
  const extensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp']
  
  for (const ext of extensions) {
    const assetPath = path.join(fallbackDir, `${assetName}${ext}`)
    if (fs.existsSync(assetPath)) {
      return assetPath
    }
  }
  
  // Return default placeholder if specific asset not found
  const placeholderPath = path.join(fallbackDir, 'badge-placeholder.png')
  return placeholderPath
}

/**
 * Check if fallback asset exists
 * @param {string} questId - Quest ID
 * @param {string} [badgeId] - Badge ID (optional)
 * @returns {boolean} True if fallback asset exists
 */
function hasFallbackAsset(questId, badgeId) {
  const assetPath = getFallbackAssetPath(questId, badgeId)
  return fs.existsSync(assetPath)
}

/**
 * List all fallback assets
 * @returns {Array} Array of fallback asset information
 */
function listFallbackAssets() {
  const fallbackDir = path.resolve(config.fallbackAssetPath)
  
  if (!fs.existsSync(fallbackDir)) {
    return []
  }
  
  const files = fs.readdirSync(fallbackDir)
  const assets = []
  
  for (const file of files) {
    const filePath = path.join(fallbackDir, file)
    const stats = fs.statSync(filePath)
    
    if (stats.isFile()) {
      assets.push({
        fileName: file,
        filePath,
        fileSize: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      })
    }
  }
  
  return assets
}

/**
 * Get fallback asset data as base64
 * @param {string} questId - Quest ID
 * @param {string} [badgeId] - Badge ID (optional)
 * @returns {Object} Asset data with base64 encoding
 */
function getFallbackAssetData(questId, badgeId) {
  const assetPath = getFallbackAssetPath(questId, badgeId)
  
  if (!fs.existsSync(assetPath)) {
    return {
      success: false,
      error: 'Fallback asset not found'
    }
  }
  
  try {
    const data = fs.readFileSync(assetPath)
    const base64 = data.toString('base64')
    const ext = path.extname(assetPath).toLowerCase()
    
    // Determine MIME type
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    }
    
    const mimeType = mimeTypes[ext] || 'application/octet-stream'
    
    return {
      success: true,
      fileName: path.basename(assetPath),
      mimeType,
      base64,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: data.length
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Create a fallback asset viewer HTML
 * @param {string} questId - Quest ID
 * @param {string} [badgeId] - Badge ID (optional)
 * @returns {string} HTML string for viewing the asset
 */
function generateFallbackViewerHTML(questId, badgeId) {
  const assetData = getFallbackAssetData(questId, badgeId)
  
  if (!assetData.success) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fallback Asset Viewer</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .error { background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>🔴 Fallback Asset Not Found</h1>
        <div class="error">
          <p><strong>Quest ID:</strong> ${questId}</p>
          ${badgeId ? `<p><strong>Badge ID:</strong> ${badgeId}</p>` : ''}
          <p><strong>Error:</strong> ${assetData.error}</p>
        </div>
      </body>
      </html>
    `
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fallback Asset Viewer - ${questId}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #f5f5f5;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 600px;
        }
        .badge-image {
          max-width: 100%;
          border-radius: 8px;
          margin: 20px 0;
        }
        .info {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ MeeChain Badge - Fallback Viewer</h1>
        <img src="${assetData.dataUrl}" alt="Badge ${questId}" class="badge-image">
        <div class="info">
          <div class="info-row">
            <span class="label">Quest ID:</span>
            <span class="value">${questId}</span>
          </div>
          ${badgeId ? `
          <div class="info-row">
            <span class="label">Badge ID:</span>
            <span class="value">${badgeId}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="label">File Name:</span>
            <span class="value">${assetData.fileName}</span>
          </div>
          <div class="info-row">
            <span class="label">File Size:</span>
            <span class="value">${(assetData.size / 1024).toFixed(2)} KB</span>
          </div>
          <div class="info-row">
            <span class="label">MIME Type:</span>
            <span class="value">${assetData.mimeType}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value">🟠 Using Fallback Asset</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

module.exports = {
  getFallbackAssetPath,
  hasFallbackAsset,
  listFallbackAssets,
  getFallbackAssetData,
  generateFallbackViewerHTML
}
