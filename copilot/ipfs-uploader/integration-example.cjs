/**
 * Integration Example: Connecting IPFS Uploader with MeeBot Component
 * 
 * This example shows how to integrate the IPFS uploader with the existing
 * MeeBot component (components/MeeBot.tsx) for sprite feedback.
 */

// Example integration in a TypeScript/React component
// Import both the uploader and MeeBot

/*
import { MeeBot } from '../components/MeeBot'
import { uploadFile } from '../copilot/ipfs-uploader/index.cjs'

async function handleBadgeUpload(questId: string, badgeFile: string) {
  // Step 1: Set MeeBot to loading state
  MeeBot.setSprite('loading')
  MeeBot.speak('กำลังอัปโหลด badge ไป IPFS...')
  
  try {
    // Step 2: Upload badge with metadata generation
    const result = await uploadFile(badgeFile, {
      questId: questId,
      rarity: 'Common'
    })
    
    // Step 3: Provide MeeBot feedback based on result
    if (result.success && !result.fallback) {
      // Successful upload
      MeeBot.setSprite('happy')
      MeeBot.speak('ยินดีด้วย! อัปโหลดสำเร็จ NFT metadata พร้อมแล้ว!')
    } else if (result.fallback) {
      // Fallback used
      MeeBot.setSprite('confused')
      MeeBot.speak('ระบบ fallback ทำงานแล้วนะครับ แต่ metadata ก็ถูกสร้างเรียบร้อยแล้ว!')
    }
    
    // Step 4: Return metadata for minting
    return {
      metadataURI: result.metadata.image,
      metadata: result.metadata,
      fallbackUsed: result.fallback
    }
    
  } catch (error) {
    // Step 5: Handle error
    MeeBot.setSprite('sad')
    MeeBot.speak('การอัปโหลดไม่สำเร็จนะครับ ลองใหม่อีกครั้ง')
    throw error
  }
}

// Example usage in quest completion handler
async function onQuestComplete(userId: string, questId: string) {
  const badgeFile = `copilot/assets/badges/${questId}.svg`
  
  try {
    // Upload badge and get metadata
    const uploadResult = await handleBadgeUpload(questId, badgeFile)
    
    // Mint NFT with metadata (existing function from QuestManager)
    const mintResult = await handleQuestCompletion(userId, questId)
    
    // Provide final feedback
    MeeBot.questFeedback(questId, mintResult.success, uploadResult.fallbackUsed)
    
  } catch (error) {
    console.error('Quest completion failed:', error)
  }
}
*/

// ============================================================================
// For Node.js/CommonJS environments (like the current setup)
// ============================================================================

const { uploadFile, uploadAllBadges } = require('./index.cjs');
const fs = require('fs');

/**
 * Simulated MeeBot integration for Node.js environment
 * In production React app, use: import { MeeBot } from '../components/MeeBot'
 */
class MeeBotIntegration {
  /**
   * Upload badge with MeeBot sprite feedback
   * @param {string} questId - Quest ID
   * @param {string} badgeFile - Path to badge file
   * @returns {Promise<Object>} Upload result with metadata
   */
  static async uploadBadgeWithFeedback(questId, badgeFile) {
    console.log(`\n🎮 Quest: ${questId}`);
    console.log('🤖 MeeBot sprite: loading');
    console.log('🗣️  MeeBot: "กำลังอัปโหลด badge ไป IPFS..."\n');
    
    try {
      const result = await uploadFile(badgeFile, { questId });
      
      if (result.success && !result.fallback) {
        console.log('🤖 MeeBot sprite: happy');
        console.log('🗣️  MeeBot: "ยินดีด้วย! อัปโหลดสำเร็จ NFT metadata พร้อมแล้ว!"\n');
      } else if (result.fallback) {
        console.log('🤖 MeeBot sprite: confused');
        console.log('🗣️  MeeBot: "ระบบ fallback ทำงานแล้วนะครับ แต่ metadata ก็ถูกสร้างเรียบร้อยแล้ว!"\n');
      }
      
      return result;
    } catch (error) {
      console.log('🤖 MeeBot sprite: sad');
      console.log('🗣️  MeeBot: "การอัปโหลดไม่สำเร็จนะครับ ลองใหม่อีกครั้ง"\n');
      throw error;
    }
  }
  
  /**
   * Complete quest workflow: Upload → Mint → Feedback
   * @param {string} userId - User ID
   * @param {string} questId - Quest ID
   * @param {string} badgeFile - Path to badge file
   */
  static async completeQuest(userId, questId, badgeFile) {
    console.log('═'.repeat(70));
    console.log('🎯 Quest Completion Workflow');
    console.log('═'.repeat(70));
    console.log(`User: ${userId}`);
    console.log(`Quest: ${questId}\n`);
    
    // Step 1: Upload badge with metadata generation
    console.log('📤 Step 1: Upload Badge to IPFS');
    const uploadResult = await this.uploadBadgeWithFeedback(questId, badgeFile);
    
    // Step 2: Simulate NFT minting (in production, call actual mint function)
    console.log('⛓️  Step 2: Mint NFT (simulated)');
    console.log(`   Contract: 0xBadge123...`);
    console.log(`   Metadata URI: ${uploadResult.metadata.image}`);
    console.log(`   Fallback: ${uploadResult.fallback ? 'Yes' : 'No'}\n`);
    
    // Step 3: Log milestone
    console.log('📝 Step 3: Milestone Logged');
    const milestoneLog = fs.readFileSync('copilot/milestone.log', 'utf-8');
    console.log(`   ${milestoneLog.trim().split('\n').pop()}\n`);
    
    // Step 4: Final feedback
    console.log('✅ Quest Completed!');
    console.log('═'.repeat(70) + '\n');
    
    return {
      userId,
      questId,
      metadataURI: uploadResult.metadata.image,
      fallbackUsed: uploadResult.fallback,
      success: true
    };
  }
}

// ============================================================================
// Example Usage
// ============================================================================

if (require.main === module) {
  (async () => {
    // Example 1: Single quest completion
    await MeeBotIntegration.completeQuest(
      'user-123',
      'quest-tts-001',
      'copilot/assets/badges/quest-tts-001.svg'
    );
    
    // Example 2: Multiple milestone uploads
    console.log('\n📊 Batch Upload Multiple Badges\n');
    const summary = await uploadAllBadges();
    
    console.log('🎉 All uploads complete!');
    console.log(`   Successful: ${summary.successful}`);
    console.log(`   Fallback: ${summary.fallback}`);
    console.log(`   Failed: ${summary.failed}\n`);
  })();
}

module.exports = { MeeBotIntegration };
