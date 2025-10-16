/**
 * Demo: IPFS Uploader with MeeBot Sprite Feedback Integration
 * Shows how metadata generator connects with uploader and triggers MeeBot feedback
 */

const { uploadFile, logMilestone } = require('./index.cjs');
const path = require('path');
const fs = require('fs');

// Simulated MeeBot integration (in production, would import from components/MeeBot.tsx)
const MeeBotSimulator = {
  setSprite(emotion) {
    console.log(`🤖 MeeBot sprite: ${emotion}`);
  },
  speak(message) {
    console.log(`🗣️  MeeBot says: "${message}"`);
  },
  questFeedback(questId, success, fallback) {
    if (!success) {
      this.setSprite('sad');
      this.speak('การอัปโหลดไม่สำเร็จนะครับ ลองใหม่อีกครั้ง');
      return;
    }

    if (fallback) {
      this.setSprite('confused');
      this.speak('ระบบ fallback ทำงานแล้วนะครับ แต่ metadata ก็ถูกสร้างเรียบร้อยแล้ว!');
    } else {
      this.setSprite('happy');
      this.speak('ยินดีด้วย! อัปโหลดสำเร็จ NFT metadata พร้อมแล้ว!');
    }
  }
};

/**
 * Upload badge with MeeBot feedback
 */
async function uploadWithFeedback(badgeFile, questId) {
  console.log('\n' + '='.repeat(70));
  console.log(`📦 Uploading: ${path.basename(badgeFile)}`);
  console.log('='.repeat(70) + '\n');
  
  // Set MeeBot to loading state
  MeeBotSimulator.setSprite('loading');
  MeeBotSimulator.speak('กำลังอัปโหลด badge ไป IPFS...');
  
  try {
    const result = await uploadFile(badgeFile, {
      questId: questId,
      rarity: 'Common'
    });
    
    // Provide feedback based on result
    MeeBotSimulator.questFeedback(questId, result.success, result.fallback);
    
    // Show result details
    console.log('\n📊 Upload Result:');
    console.log(`   File: ${result.file}`);
    console.log(`   Success: ${result.success}`);
    console.log(`   Fallback: ${result.fallback}`);
    
    if (result.hash) {
      console.log(`   IPFS Hash: ${result.hash}`);
      console.log(`   Gateway URL: https://ipfs.io/ipfs/${result.hash}`);
    }
    
    console.log('\n📄 Metadata:');
    console.log(`   Name: ${result.metadata.name}`);
    console.log(`   Description: ${result.metadata.description}`);
    console.log(`   Image: ${result.metadata.image}`);
    console.log(`   Attributes: ${result.metadata.attributes.length}`);
    
    return result;
  } catch (err) {
    MeeBotSimulator.questFeedback(questId, false);
    console.error(`\n❌ Error: ${err.message}`);
    throw err;
  }
}

/**
 * Demo workflow
 */
async function runDemo() {
  console.log('🎬 IPFS Uploader + MeeBot Integration Demo');
  console.log('='.repeat(70));
  console.log('This demo shows how metadata-generator.cjs integrates with');
  console.log('the uploader (index.cjs) and provides MeeBot sprite feedback.\n');
  
  const badgeDir = path.resolve(process.cwd(), 'copilot/assets/badges');
  const badges = fs.readdirSync(badgeDir).filter(f => f.endsWith('.svg'));
  
  if (badges.length === 0) {
    console.log('⚠️  No badges found for demo');
    return;
  }
  
  // Demo 1: Successful upload with MeeBot feedback
  console.log('\n📌 Demo 1: Successful Upload');
  const badge1 = path.join(badgeDir, badges[0]);
  await uploadWithFeedback(badge1, 'quest-demo-001');
  
  // Demo 2: Upload with potential fallback
  if (badges.length > 1) {
    console.log('\n\n📌 Demo 2: Another Upload');
    const badge2 = path.join(badgeDir, badges[1]);
    await uploadWithFeedback(badge2, 'quest-demo-002');
  }
  
  // Show milestone log
  console.log('\n\n📝 Milestone Log Updates:');
  console.log('='.repeat(70));
  const milestoneLog = path.resolve(process.cwd(), 'copilot/milestone.log');
  if (fs.existsSync(milestoneLog)) {
    const logs = fs.readFileSync(milestoneLog, 'utf-8');
    console.log(logs);
  }
  
  // Summary
  console.log('\n✅ Demo Complete!');
  console.log('='.repeat(70));
  console.log('Key Integration Points Demonstrated:');
  console.log('  1. ✅ metadata-generator.cjs creates NFT metadata');
  console.log('  2. ✅ index.cjs uploads to IPFS with hash validation');
  console.log('  3. ✅ Fallback-aware error handling');
  console.log('  4. ✅ MeeBot sprite feedback (happy/confused/sad)');
  console.log('  5. ✅ Milestone logging for tracking');
  console.log('  6. ✅ Metadata saved to /metadata/*.json');
  console.log('='.repeat(70) + '\n');
}

// Run demo
runDemo()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Demo failed:', err);
    process.exit(1);
  });
