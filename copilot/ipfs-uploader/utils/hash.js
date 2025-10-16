/**
 * IPFS Hash Utility
 * Generates and validates IPFS hashes (CID - Content Identifier)
 */

const crypto = require('crypto')
const fs = require('fs')

/**
 * Generate SHA-256 hash of a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} SHA-256 hash of the file
 */
async function generateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)

    stream.on('data', (data) => {
      hash.update(data)
    })

    stream.on('end', () => {
      resolve(hash.digest('hex'))
    })

    stream.on('error', (error) => {
      reject(error)
    })
  })
}

/**
 * Validate IPFS CID format
 * @param {string} cid - IPFS Content Identifier
 * @returns {boolean} True if valid CID format
 */
function validateCID(cid) {
  if (!cid || typeof cid !== 'string') {
    return false
  }

  // Basic CID validation
  // CIDv0: Qm... (46 characters, base58)
  // CIDv1: bafy... (various lengths, base32)
  
  const cidV0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
  const cidV1Pattern = /^bafy[a-z2-7]+$/i

  return cidV0Pattern.test(cid) || cidV1Pattern.test(cid)
}

/**
 * Generate metadata hash
 * @param {Object} metadata - Metadata object
 * @returns {string} SHA-256 hash of the metadata
 */
function generateMetadataHash(metadata) {
  const metadataString = JSON.stringify(metadata, Object.keys(metadata).sort())
  return crypto.createHash('sha256').update(metadataString).digest('hex')
}

/**
 * Verify file integrity by comparing hashes
 * @param {string} filePath - Path to the file
 * @param {string} expectedHash - Expected SHA-256 hash
 * @returns {Promise<boolean>} True if hashes match
 */
async function verifyFileIntegrity(filePath, expectedHash) {
  const actualHash = await generateFileHash(filePath)
  return actualHash === expectedHash
}

/**
 * Generate a unique identifier for tracking uploads
 * @param {string} fileName - Original file name
 * @param {string} questId - Quest ID
 * @returns {string} Unique upload identifier
 */
function generateUploadId(fileName, questId) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const data = `${fileName}-${questId}-${timestamp}-${random}`
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16)
}

/**
 * Extract CID from IPFS URL
 * @param {string} url - IPFS URL (e.g., ipfs://Qm... or https://ipfs.io/ipfs/Qm...)
 * @returns {string|null} Extracted CID or null if invalid
 */
function extractCIDFromURL(url) {
  if (!url) return null

  // Handle ipfs:// protocol
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', '')
  }

  // Handle HTTP gateway URLs
  const match = url.match(/\/ipfs\/([^\/\?]+)/)
  if (match && match[1]) {
    return match[1]
  }

  return null
}

/**
 * Build IPFS gateway URL from CID
 * @param {string} cid - IPFS Content Identifier
 * @param {string} gateway - IPFS gateway URL
 * @returns {string} Full gateway URL
 */
function buildGatewayURL(cid, gateway = 'https://ipfs.io/ipfs/') {
  if (!validateCID(cid)) {
    throw new Error(`Invalid CID: ${cid}`)
  }
  
  // Ensure gateway ends with /
  const normalizedGateway = gateway.endsWith('/') ? gateway : `${gateway}/`
  return `${normalizedGateway}${cid}`
}

module.exports = {
  generateFileHash,
  validateCID,
  generateMetadataHash,
  verifyFileIntegrity,
  generateUploadId,
  extractCIDFromURL,
  buildGatewayURL
}
