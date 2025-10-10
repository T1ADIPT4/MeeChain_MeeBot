/**
 * IPFS Uploader
 * Main uploader that integrates metadata generator with IPFS upload
 * Includes fallback-aware upload and milestone sprite feedback
 */

const fs = require('fs');
const path = require('path');
const { generateMetadata, updateMetadataWithHash, generateFallbackMetadata } = require('./metadata-generator.cjs');
const { uploadToIPFS, validateHash } = require('./utils/hash.cjs');
const config = require('./config.cjs');

/**
 * Upload a single badge file with metadata generation
 * @param {string} filePath - Path to badge file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with metadata
 */
async function uploadBadge(filePath, options = {}) {
  const fileName = path.basename(filePath);
  let metadata = generateMetadata(fileName, options);
  
  console.log(`\n🎯 Processing badge: ${fileName}`);
  
  try {
    // Upload to IPFS
    const hash = await uploadToIPFS(filePath);
    
    // Validate hash
    if (!validateHash(hash)) {
      throw new Error('Invalid IPFS hash generated');
    }
    
    // Update metadata with hash
    metadata = updateMetadataWithHash(metadata, hash);
    
    console.log(`✅ Uploaded successfully: ${fileName}`);
    console.log(`   IPFS: ipfs://${hash}`);
    
    return {
      success: true,
      file: fileName,
      hash,
      metadata,
      fallback: false
    };
    
  } catch (err) {
    console.warn(`⚠️ Upload failed for ${fileName}: ${err.message}`);
    
    if (config.USE_FALLBACK_ON_ERROR) {
      console.log(`   Using fallback asset...`);
      
      // Generate fallback metadata
      metadata = generateFallbackMetadata(fileName, err.message);
      
      return {
        success: true,
        file: fileName,
        hash: null,
        metadata,
        fallback: true,
        error: err.message
      };
    } else {
      throw err;
    }
  }
}

/**
 * Save metadata to JSON file
 * @param {Object} metadata - Metadata to save
 * @param {string} fileName - Original file name
 */
function saveMetadata(metadata, fileName) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const metadataPath = path.join(config.METADATA_DIR, `${baseName}.json`);
  
  // Ensure metadata directory exists
  if (!fs.existsSync(config.METADATA_DIR)) {
    fs.mkdirSync(config.METADATA_DIR, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`💾 Metadata saved: ${path.basename(metadataPath)}`);
  
  return metadataPath;
}

/**
 * Log milestone completion
 * @param {string} message - Milestone message
 */
function logMilestone(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(config.MILESTONE_LOG, logEntry);
  console.log(`📝 Milestone logged: ${message}`);
}

/**
 * Upload all badges in the badge directory
 * @returns {Promise<Object>} - Upload results summary
 */
async function uploadAllBadges() {
  console.log('🚀 Starting batch upload...\n');
  console.log(`📁 Badge directory: ${config.BADGE_DIR}`);
  
  // Ensure badge directory exists
  if (!fs.existsSync(config.BADGE_DIR)) {
    throw new Error(`Badge directory not found: ${config.BADGE_DIR}`);
  }
  
  const files = fs.readdirSync(config.BADGE_DIR).filter(f => 
    !f.startsWith('.') && /\.(png|jpg|jpeg|gif|svg)$/i.test(f)
  );
  
  if (files.length === 0) {
    console.log('⚠️ No badge files found');
    return {
      total: 0,
      successful: 0,
      fallback: 0,
      failed: 0,
      results: []
    };
  }
  
  console.log(`📊 Found ${files.length} badge file(s)\n`);
  
  const results = [];
  let successful = 0;
  let fallback = 0;
  let failed = 0;
  
  for (const file of files) {
    const filePath = path.join(config.BADGE_DIR, file);
    
    try {
      const result = await uploadBadge(filePath);
      
      // Save metadata
      saveMetadata(result.metadata, file);
      
      results.push(result);
      
      if (result.fallback) {
        fallback++;
      } else {
        successful++;
      }
      
    } catch (err) {
      console.error(`❌ Failed to process ${file}: ${err.message}`);
      failed++;
      results.push({
        success: false,
        file,
        error: err.message
      });
    }
  }
  
  // Log milestone
  const milestoneMsg = `M4 complete: Uploader tested - ${successful} uploaded, ${fallback} fallback, ${failed} failed 🟠`;
  logMilestone(milestoneMsg);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary:');
  console.log(`   Total files: ${files.length}`);
  console.log(`   ✅ Successful uploads: ${successful}`);
  console.log(`   🔄 Fallback used: ${fallback}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');
  
  return {
    total: files.length,
    successful,
    fallback,
    failed,
    results
  };
}

/**
 * Upload a single file (for programmatic use)
 * @param {string} filePath - Path to file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
async function uploadFile(filePath, options = {}) {
  const result = await uploadBadge(filePath, options);
  saveMetadata(result.metadata, path.basename(filePath));
  return result;
}

module.exports = {
  uploadBadge,
  uploadAllBadges,
  uploadFile,
  saveMetadata,
  logMilestone
};

// Run if executed directly
if (require.main === module) {
  uploadAllBadges()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error('❌ Upload failed:', err.message);
      process.exit(1);
    });
}
