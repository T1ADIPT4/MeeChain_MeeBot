/**
 * File Validation Utility
 * Validates files before uploading to IPFS
 */

const fs = require('fs')
const path = require('path')
const config = require('../config')

/**
 * Validate file before upload
 * @param {string} filePath - Path to the file to validate
 * @returns {Object} Validation result with { valid: boolean, error?: string }
 */
function validateFile(filePath) {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      error: `File not found: ${filePath}`
    }
  }

  // Check if it's a file (not a directory)
  const stats = fs.statSync(filePath)
  if (!stats.isFile()) {
    return {
      valid: false,
      error: `Path is not a file: ${filePath}`
    }
  }

  // Check file size
  if (stats.size > config.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size (${config.maxFileSize} bytes): ${stats.size} bytes`
    }
  }

  // Check file size is not zero
  if (stats.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    }
  }

  // Check file extension/type (basic check)
  const ext = path.extname(filePath).toLowerCase()
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
  
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`
    }
  }

  return {
    valid: true,
    fileSize: stats.size,
    fileType: ext,
    fileName: path.basename(filePath)
  }
}

/**
 * Validate multiple files
 * @param {string[]} filePaths - Array of file paths to validate
 * @returns {Object} Validation result
 */
function validateFiles(filePaths) {
  const results = []
  const errors = []

  for (const filePath of filePaths) {
    const result = validateFile(filePath)
    results.push({
      filePath,
      ...result
    })

    if (!result.valid) {
      errors.push({
        filePath,
        error: result.error
      })
    }
  }

  return {
    valid: errors.length === 0,
    results,
    errors,
    totalFiles: filePaths.length,
    validFiles: results.filter(r => r.valid).length
  }
}

/**
 * Validate badge metadata
 * @param {Object} metadata - Badge metadata object
 * @returns {Object} Validation result
 */
function validateMetadata(metadata) {
  const requiredFields = ['name', 'description', 'image']
  const missingFields = []

  for (const field of requiredFields) {
    if (!metadata[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing required metadata fields: ${missingFields.join(', ')}`
    }
  }

  // Validate name length
  if (metadata.name.length > 100) {
    return {
      valid: false,
      error: 'Metadata name is too long (max 100 characters)'
    }
  }

  // Validate description length
  if (metadata.description.length > 1000) {
    return {
      valid: false,
      error: 'Metadata description is too long (max 1000 characters)'
    }
  }

  return {
    valid: true
  }
}

module.exports = {
  validateFile,
  validateFiles,
  validateMetadata
}
