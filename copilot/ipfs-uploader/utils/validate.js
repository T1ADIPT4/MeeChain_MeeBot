/**
 * File Validation Utility
 * Validates files before IPFS upload
 */

import * as fs from 'fs'
import * as path from 'path'

/**
 * Validate a file before upload
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} Validation result
 */
export async function validateFile(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        valid: false,
        error: 'File does not exist'
      }
    }
    
    // Get file stats
    const stats = fs.statSync(filePath)
    
    // Check if it's a file (not directory)
    if (!stats.isFile()) {
      return {
        valid: false,
        error: 'Path is not a file'
      }
    }
    
    // Get file information
    const fileName = path.basename(filePath)
    const fileSize = stats.size
    const fileExtension = path.extname(filePath).toLowerCase()
    
    // Determine MIME type
    const mimeType = getMimeType(fileExtension)
    
    // Validate file size (from config, default 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (fileSize > maxSize) {
      return {
        valid: false,
        error: `File size (${formatFileSize(fileSize)}) exceeds maximum (${formatFileSize(maxSize)})`
      }
    }
    
    // Validate MIME type
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'image/webp'
    ]
    
    if (!allowedMimeTypes.includes(mimeType)) {
      return {
        valid: false,
        error: `File type ${mimeType} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`
      }
    }
    
    // Validate file is not empty
    if (fileSize === 0) {
      return {
        valid: false,
        error: 'File is empty'
      }
    }
    
    // All validations passed
    return {
      valid: true,
      fileName,
      fileSize,
      fileSizeFormatted: formatFileSize(fileSize),
      fileExtension,
      mimeType,
      filePath
    }
    
  } catch (error) {
    return {
      valid: false,
      error: `Validation error: ${error.message}`
    }
  }
}

/**
 * Get MIME type from file extension
 * @param {string} extension - File extension (with or without dot)
 * @returns {string} MIME type
 */
function getMimeType(extension) {
  const ext = extension.toLowerCase().replace('.', '')
  
  const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon'
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate multiple files
 * @param {Array<string>} filePaths - Array of file paths
 * @returns {Promise<Object>} Validation results
 */
export async function validateBatch(filePaths) {
  const results = []
  
  for (const filePath of filePaths) {
    const validation = await validateFile(filePath)
    results.push({
      filePath,
      ...validation
    })
  }
  
  const validFiles = results.filter(r => r.valid)
  const invalidFiles = results.filter(r => !r.valid)
  
  return {
    total: results.length,
    valid: validFiles.length,
    invalid: invalidFiles.length,
    results,
    validFiles,
    invalidFiles
  }
}

/**
 * Check if file hash matches expected hash
 * @param {string} filePath - Path to file
 * @param {string} expectedHash - Expected hash
 * @returns {Promise<Object>} Hash validation result
 */
export async function validateHash(filePath, expectedHash) {
  // In production, calculate actual file hash
  // const crypto = require('crypto')
  // const fileBuffer = fs.readFileSync(filePath)
  // const hashSum = crypto.createHash('sha256')
  // hashSum.update(fileBuffer)
  // const actualHash = hashSum.digest('hex')
  
  // For now, simulate hash validation
  const actualHash = 'simulated_hash_' + Math.random().toString(36).substring(7)
  
  return {
    valid: actualHash === expectedHash,
    actualHash,
    expectedHash,
    filePath
  }
}

/**
 * Sanitize filename for safe storage
 * @param {string} fileName - Original filename
 * @returns {string} Sanitized filename
 */
export function sanitizeFileName(fileName) {
  // Remove path components
  let sanitized = path.basename(fileName)
  
  // Replace spaces and special characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  // Remove consecutive underscores
  sanitized = sanitized.replace(/_+/g, '_')
  
  // Ensure it's not too long
  const maxLength = 255
  if (sanitized.length > maxLength) {
    const ext = path.extname(sanitized)
    const name = path.basename(sanitized, ext)
    sanitized = name.substring(0, maxLength - ext.length) + ext
  }
  
  return sanitized
}
