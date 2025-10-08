/**
 * Simple Usage Example for Reward Tracking System
 * Shows the most common use cases in a practical way
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import { getUserRewards, getAllRewards, trackReward } from '../tracker/RewardTracker.js'
import { exportRewardLog } from '../tracker/RewardExporter.js'

console.log('📖 Simple Reward Tracking Usage Examples\n')

/**
 * Use Case 1: Automatic tracking when user completes a quest
 */
async function useCase1_AutomaticTracking() {
  console.log('=== Use Case 1: Automatic Tracking (Most Common) ===\n')
  
  const userId = 'john-doe'
  const questId = 'quest-tts-001'
  
  // Step 1: User enables TTS (meets quest condition)
  console.log('1. User enables TTS...')
  updateTTSProgress(userId, 'tts-enabled', 1)
  
  // Step 2: User completes the quest (tracking happens automatically!)
  console.log('2. User completes quest...')
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success) {
    console.log('   ✅ Quest completed!')
    console.log(`   📛 Badge awarded: ${result.tx?.badgeId}`)
    console.log(`   🔗 Transaction: ${result.tx?.txHash}`)
  }
  
  // Step 3: Check user's rewards (already tracked automatically)
  console.log('3. Checking user rewards...')
  const userRewards = getUserRewards(userId)
  console.log(`   📊 User has ${userRewards.length} total badges`)
  
  console.log()
}

/**
 * Use Case 2: Display user's badge collection
 */
async function useCase2_DisplayBadges() {
  console.log('=== Use Case 2: Display User Badge Collection ===\n')
  
  const userId = 'john-doe'
  const rewards = getUserRewards(userId)
  
  console.log(`🎖️ Badges for ${userId}:\n`)
  
  if (rewards.length === 0) {
    console.log('   No badges yet. Complete quests to earn badges!')
  } else {
    rewards.forEach((reward, index) => {
      const date = new Date(reward.timestamp).toLocaleString()
      const method = reward.fallbackUsed ? 'Fallback ✅' : 'Normal 🚀'
      
      console.log(`${index + 1}. ${reward.badgeId}`)
      console.log(`   Quest: ${reward.questId}`)
      console.log(`   Earned: ${date}`)
      console.log(`   Method: ${method}`)
      console.log()
    })
  }
}

/**
 * Use Case 3: Admin exports rewards for backup
 */
async function useCase3_AdminExport() {
  console.log('=== Use Case 3: Admin Export for Backup/Audit ===\n')
  
  // Admin exports all rewards
  const exportPath = './backup-rewards.json'
  console.log(`📦 Exporting all rewards to ${exportPath}...`)
  exportRewardLog(exportPath)
  
  const allRewards = getAllRewards()
  console.log(`✅ Exported ${allRewards.length} reward entries`)
  console.log(`📄 File ready for backup/audit`)
  
  console.log()
}

/**
 * Use Case 4: Manual tracking (advanced use case)
 */
async function useCase4_ManualTracking() {
  console.log('=== Use Case 4: Manual Tracking (Advanced) ===\n')
  
  console.log('ℹ️  Normally tracking is automatic, but you can track manually too:\n')
  
  // Example: Track a special event or admin-awarded badge
  trackReward({
    userId: 'special-user',
    questId: 'admin-award',
    badgeId: 'badge-special-contribution',
    timestamp: Date.now(),
    fallbackUsed: false
  })
  
  console.log('✅ Manually tracked special badge award')
  console.log('   Use case: Admin manually awards special badges')
  console.log()
}

/**
 * Use Case 5: Simple analytics
 */
async function useCase5_SimpleAnalytics() {
  console.log('=== Use Case 5: Simple Analytics ===\n')
  
  const allRewards = getAllRewards()
  
  // Calculate statistics
  const totalBadges = allRewards.length
  const normalMinting = allRewards.filter(r => !r.fallbackUsed).length
  const fallbackMinting = allRewards.filter(r => r.fallbackUsed).length
  const uniqueUsers = new Set(allRewards.map(r => r.userId)).size
  
  console.log('📊 System Statistics:')
  console.log(`   Total Badges: ${totalBadges}`)
  console.log(`   Normal Minting: ${normalMinting}`)
  console.log(`   Fallback Minting: ${fallbackMinting}`)
  console.log(`   Active Users: ${uniqueUsers}`)
  
  if (totalBadges > 0) {
    const fallbackRate = (fallbackMinting / totalBadges * 100).toFixed(1)
    console.log(`   Fallback Rate: ${fallbackRate}%`)
    
    if (parseFloat(fallbackRate) > 20) {
      console.log('   ⚠️  High fallback rate - check primary chain status')
    }
  }
  
  console.log()
}

// Run all use cases
async function main() {
  try {
    await useCase1_AutomaticTracking()
    await useCase2_DisplayBadges()
    await useCase3_AdminExport()
    await useCase4_ManualTracking()
    await useCase5_SimpleAnalytics()
    
    console.log('✅ All use cases demonstrated!\n')
    console.log('💡 Key Takeaways:')
    console.log('   • Tracking is automatic when quests complete')
    console.log('   • Use getUserRewards() to show user badges')
    console.log('   • Use exportRewardLog() for backups')
    console.log('   • Use getAllRewards() for analytics')
    console.log('\n📚 See REWARD_TRACKING.md for full documentation')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
