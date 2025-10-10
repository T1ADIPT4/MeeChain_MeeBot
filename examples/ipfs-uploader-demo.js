/**
 * IPFS Uploader Example
 * Demonstrates usage of the MeeChain IPFS uploader system
 */

import { uploadToIPFS, uploadBatch } from '../copilot/ipfs-uploader/index.js'
import { getConfig, updateConfig, validateConfig } from '../copilot/ipfs-uploader/config.js'
import { generateMetadata, validateMetadata } from '../copilot/ipfs-uploader/metadata-generator.js'
import { getViewerURL, getAssetWithFallback } from '../copilot/ipfs-uploader/fallback-viewer.js'
import { validateFile } from '../copilot/ipfs-uploader/utils/validate.js'

console.log('🚀 MeeChain IPFS Uploader Demo\n')

/**
 * Example 1: Configuration Management
 */
function example1_Configuration() {
  console.log('=== Example 1: Configuration Management ===\n')
  
  // Get current configuration
  const config = getConfig()
  console.log('Current Configuration:')
  console.log(`  IPFS Endpoint: ${config.ipfsEndpoint}`)
  console.log(`  IPFS Gateway: ${config.ipfsGateway}`)
  console.log(`  Use Fallback: ${config.useFallback}`)
  console.log(`  Max File Size: ${config.maxFileSize} bytes`)
  console.log('')
  
  // Validate configuration
  const validation = validateConfig()
  console.log(`Configuration Valid: ${validation.valid}`)
  if (validation.errors.length > 0) {
    console.log('Errors:', validation.errors)
  }
  console.log('')
}

/**
 * Example 2: File Validation
 */
async function example2_FileValidation() {
  console.log('=== Example 2: File Validation ===\n')
  
  // Note: In real usage, you would validate actual files
  console.log('File validation checks:')
  console.log('  ✓ File exists')
  console.log('  ✓ File size within limits')
  console.log('  ✓ MIME type allowed')
  console.log('  ✓ File not empty')
  console.log('')
  
  console.log('Allowed MIME types:')
  const config = getConfig()
  config.allowedMimeTypes.forEach(type => {
    console.log(`  - ${type}`)
  })
  console.log('')
}

/**
 * Example 3: Metadata Generation
 */
async function example3_MetadataGeneration() {
  console.log('=== Example 3: Metadata Generation ===\n')
  
  const metadata = await generateMetadata({
    ipfsHash: 'QmExampleHash123',
    fileName: 'quest-001-badge.png',
    fileSize: 245678,
    mimeType: 'image/png',
    questId: 'quest-001',
    badgeName: 'First Quest Complete',
    badgeDescription: 'Awarded for completing your first quest in MeeChain',
    attributes: [
      { trait_type: 'Rarity', value: 'Common' },
      { trait_type: 'Quest Type', value: 'Tutorial' },
      { trait_type: 'Level', value: 1 }
    ]
  })
  
  console.log('Generated Metadata:')
  console.log(`  Name: ${metadata.name}`)
  console.log(`  Description: ${metadata.description}`)
  console.log(`  Image: ${metadata.image}`)
  console.log(`  Attributes: ${metadata.attributes.length} total`)
  console.log('')
  
  // Validate metadata
  const validation = validateMetadata(metadata)
  console.log(`Metadata Valid: ${validation.valid}`)
  if (validation.warnings.length > 0) {
    console.log('Warnings:', validation.warnings)
  }
  console.log('')
}

/**
 * Example 4: Simulated Upload (No Actual Files)
 */
async function example4_SimulatedUpload() {
  console.log('=== Example 4: Simulated Upload Process ===\n')
  
  console.log('Upload Flow:')
  console.log('  1. 🔍 Validate file')
  console.log('  2. 📤 Upload to IPFS')
  console.log('  3. 📝 Generate metadata')
  console.log('  4. ✅ Return IPFS hash and metadata')
  console.log('')
  
  console.log('Fallback Flow (if IPFS fails):')
  console.log('  1. ⚠️  IPFS upload fails')
  console.log('  2. 🔄 Detect failure')
  console.log('  3. 📦 Upload to fallback storage')
  console.log('  4. 📝 Generate metadata with fallback flag')
  console.log('  5. ✅ Return fallback hash and metadata')
  console.log('')
}

/**
 * Example 5: Fallback Viewer
 */
function example5_FallbackViewer() {
  console.log('=== Example 5: Fallback Viewer ===\n')
  
  const ipfsHash = 'QmExampleHash123'
  const fallbackHash = 'fallback_abc123'
  
  // Get viewer URLs
  const ipfsURL = getViewerURL(ipfsHash, false)
  const fallbackURL = getViewerURL(fallbackHash, true)
  
  console.log('Viewer URLs:')
  console.log(`  IPFS URL: ${ipfsURL}`)
  console.log(`  Fallback URL: ${fallbackURL}`)
  console.log('')
  
  console.log('Redundant IPFS Gateways:')
  console.log('  - https://ipfs.io/ipfs/{hash}')
  console.log('  - https://cloudflare-ipfs.com/ipfs/{hash}')
  console.log('  - https://gateway.pinata.cloud/ipfs/{hash}')
  console.log('  - https://dweb.link/ipfs/{hash}')
  console.log('')
}

/**
 * Example 6: MeeBot Integration
 */
function example6_MeeBotIntegration() {
  console.log('=== Example 6: MeeBot Sprite Feedback ===\n')
  
  console.log('MeeBot provides real-time feedback during upload:')
  console.log('')
  console.log('Upload Start:')
  console.log('  🤖 Sprite: loading')
  console.log('  🔊 TTS: "กำลังอัปโหลดไฟล์ไปยัง IPFS นะครับ"')
  console.log('')
  console.log('Upload Success:')
  console.log('  🤖 Sprite: happy')
  console.log('  🔊 TTS: "อัปโหลดสำเร็จแล้วครับ! ได้รับ IPFS hash แล้ว"')
  console.log('')
  console.log('Fallback Activated:')
  console.log('  🤖 Sprite: confused')
  console.log('  🔊 TTS: "IPFS มีปัญหา กำลังใช้ระบบสำรองนะครับ"')
  console.log('')
  console.log('Upload Failed:')
  console.log('  🤖 Sprite: sad')
  console.log('  🔊 TTS: "ขออภัย การอัปโหลดล้มเหลวนะครับ"')
  console.log('')
}

/**
 * Example 7: Batch Upload Pattern
 */
function example7_BatchUpload() {
  console.log('=== Example 7: Batch Upload Pattern ===\n')
  
  console.log('Batch upload allows uploading multiple badges:')
  console.log('')
  console.log('Example Code:')
  console.log('  const files = [')
  console.log('    "./badges/quest-001.png",')
  console.log('    "./badges/quest-002.png",')
  console.log('    "./badges/quest-003.png"')
  console.log('  ]')
  console.log('')
  console.log('  const results = await uploadBatch(files)')
  console.log('')
  console.log('Each file is uploaded sequentially with:')
  console.log('  - Individual validation')
  console.log('  - Separate IPFS hash')
  console.log('  - Independent metadata')
  console.log('  - Automatic fallback per file')
  console.log('')
}

/**
 * Example 8: Milestone Tracking
 */
function example8_MilestoneTracking() {
  console.log('=== Example 8: Milestone Tracking ===\n')
  
  console.log('Project Milestones:')
  console.log('')
  console.log('  M1: Init IPFS Uploader        ✅ 🟢 "Uploader scaffolded!"')
  console.log('  M2: Metadata Generator        🟣 "Metadata ready!"')
  console.log('  M3: Fallback Validation       🔵 "Fallback validated!"')
  console.log('  M4: Integration Test          🟠 "Uploader tested!"')
  console.log('  M5: Merge to Main             🟡 "Uploader live!"')
  console.log('')
  console.log('See copilot/MILESTONES.md for detailed tracking')
  console.log('')
}

// Run all examples
async function runAllExamples() {
  try {
    example1_Configuration()
    await example2_FileValidation()
    await example3_MetadataGeneration()
    await example4_SimulatedUpload()
    example5_FallbackViewer()
    example6_MeeBotIntegration()
    example7_BatchUpload()
    example8_MilestoneTracking()
    
    console.log('✅ All examples completed successfully!')
    console.log('')
    console.log('📚 For more details, see:')
    console.log('  - copilot/ipfs-uploader/README.md')
    console.log('  - copilot/MILESTONES.md')
    console.log('  - copilot/assets/badges/README.md')
  } catch (error) {
    console.error('❌ Error running examples:', error.message)
  }
}

runAllExamples().catch(console.error)
