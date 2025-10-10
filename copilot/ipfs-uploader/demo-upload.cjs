/**
 * Demo script to showcase MeeBot badge upload functionality
 * Demonstrates: metadata generation, fallback-aware upload, and milestone logging
 */

const { uploadBadge, logMilestone, config } = require('./index')
const { generateBadgeMetadata } = require('./metadata-generator')
const fs = require('fs')
const path = require('path')

// Enable logging for demo
config.enableLogging = true

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║        MeeBot Badge Upload Demo                          ║
║        Showcase: Upload, Metadata, Milestone Logging     ║
╚═══════════════════════════════════════════════════════════╝
`)

  // Example 1: Upload a milestone badge
  const badgePath = path.join(__dirname, '../assets/badges/milestone-5.svg')
  
  if (fs.existsSync(badgePath)) {
    console.log('\n📦 Example 1: Uploading Milestone 5 Badge')
    console.log('─'.repeat(60))
    
    const result = await uploadBadge({
      filePath: badgePath,
      questId: 'M5',
      badgeId: 'milestone-5',
      name: 'MeeBot Milestone 5',
      description: 'MeeBot sprite feedback achievement badge',
      attributes: {
        badgeType: 'Milestone',
        rarity: 'Legendary',
        chain: 'polygon'
      }
    })
    
    if (result.success) {
      console.log('\n✅ Upload successful!')
      console.log(`   Image CID: ${result.imageCID}`)
      console.log(`   Metadata CID: ${result.metadataCID}`)
      console.log(`   Gateway URL: ${result.imageUrl}`)
    } else {
      console.log('\n❌ Upload failed:', result.error)
    }
  }

  // Example 2: Generate metadata manually
  console.log('\n\n📝 Example 2: Generate Metadata Manually')
  console.log('─'.repeat(60))
  
  const metadata = generateBadgeMetadata({
    name: 'MeeChain Quest Completion',
    description: 'Badge for completing the first MeeChain quest',
    imageUrl: 'ipfs://QmExample123456789',
    questId: 'quest-001',
    badgeId: 'badge-quest-001',
    attributes: {
      badgeType: 'Quest Completion',
      rarity: 'Common'
    }
  })
  
  console.log('\nGenerated Metadata:')
  console.log(JSON.stringify(metadata, null, 2))
  
  // Save metadata to file
  const outputDir = path.join(__dirname, '../../output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  const metadataPath = path.join(outputDir, 'demo-metadata.json')
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
  console.log(`\n💾 Metadata saved to: ${metadataPath}`)

  // Example 3: Log a milestone
  console.log('\n\n📊 Example 3: Log Milestone Completion')
  console.log('─'.repeat(60))
  
  logMilestone('M5', 'Demo: Badge upload and metadata generation complete 🟢')
  console.log('✅ Milestone logged successfully!')

  console.log('\n\n🎉 MeeBot Demo Complete!')
  console.log('─'.repeat(60))
  console.log('✅ Demonstrated:')
  console.log('   - Badge upload with IPFS simulation')
  console.log('   - ERC-721 compliant metadata generation')
  console.log('   - Milestone logging to milestone.log')
  console.log('   - Fallback-aware error handling')
  console.log('   - MeeBot feedback messages')
}

// Run the demo
main().catch(error => {
  console.error('❌ Demo error:', error)
  process.exit(1)
})
