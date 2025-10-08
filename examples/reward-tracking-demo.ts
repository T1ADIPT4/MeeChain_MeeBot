/**
 * Reward Tracking System Demo
 * Demonstrates the reward tracking, dashboard, and export functionality
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateUserProgress } from '../src/verifiers/questVerifier.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import { getUserRewards, getAllRewards } from '../tracker/RewardTracker.js'
import { exportRewardLog } from '../tracker/RewardExporter.js'
import { setPrimaryMintingStatus } from '../src/minting/badgeMinter.js'
import { clearLogs } from '../src/utils/logger.js'

console.log('🎖️ MeeChain Reward Tracking System Demo\n')

/**
 * Example 1: Complete quest and track reward (normal minting)
 */
async function example1_NormalRewardTracking() {
  console.log('=== Example 1: Normal Quest Completion & Reward Tracking ===\n')
  clearLogs()

  const userId = 'demo-user-1'
  const questId = 'quest-tts-001'

  // Enable TTS to meet quest conditions
  console.log(`✅ User ${userId} enables TTS...`)
  updateTTSProgress(userId, 'tts-enabled', 1)

  // Complete the quest
  console.log(`🎯 Attempting to complete quest ${questId}...`)
  const result = await handleQuestCompletion(userId, questId)

  if (result.success) {
    console.log(`✅ Quest completed successfully!`)
    console.log(`   Badge ID: ${result.tx?.badgeId}`)
    console.log(`   Transaction: ${result.tx?.txHash}`)
    console.log(`   Fallback used: ${result.fallback ? 'Yes' : 'No'}`)
  }

  // Check tracked rewards
  const rewards = getUserRewards(userId)
  console.log(`\n📊 Rewards for ${userId}:`)
  console.log(`   Total badges: ${rewards.length}`)
  if (rewards.length > 0) {
    const latest = rewards[rewards.length - 1]
    console.log(`   Latest: ${latest.badgeId} (${latest.fallbackUsed ? 'Fallback' : 'Normal'})`)
  }
  console.log()
}

/**
 * Example 2: Complete quest with fallback minting
 */
async function example2_FallbackRewardTracking() {
  console.log('=== Example 2: Quest Completion with Fallback & Reward Tracking ===\n')
  clearLogs()

  const userId = 'demo-user-2'
  const questId = 'quest-tts-001'

  // Enable TTS to meet quest conditions
  console.log(`✅ User ${userId} enables TTS...`)
  updateTTSProgress(userId, 'tts-enabled', 1)

  // Simulate primary chain failure
  console.log(`⚠️  Simulating primary chain failure...`)
  setPrimaryMintingStatus(false)

  // Complete the quest (should use fallback)
  console.log(`🎯 Attempting to complete quest ${questId}...`)
  const result = await handleQuestCompletion(userId, questId)

  if (result.success) {
    console.log(`✅ Quest completed via fallback!`)
    console.log(`   Badge ID: ${result.tx?.badgeId}`)
    console.log(`   Transaction: ${result.tx?.txHash}`)
    console.log(`   Fallback used: ${result.fallback ? 'Yes ✅' : 'No'}`)
  }

  // Check tracked rewards
  const rewards = getUserRewards(userId)
  console.log(`\n📊 Rewards for ${userId}:`)
  console.log(`   Total badges: ${rewards.length}`)
  if (rewards.length > 0) {
    const latest = rewards[rewards.length - 1]
    console.log(`   Latest: ${latest.badgeId} (${latest.fallbackUsed ? 'Fallback ✅' : 'Normal'})`)
  }

  // Reset for next examples
  setPrimaryMintingStatus(true)
  console.log()
}

/**
 * Example 3: Multiple users and rewards
 */
async function example3_MultipleUsers() {
  console.log('=== Example 3: Multiple Users Earning Badges ===\n')
  clearLogs()

  const users = ['alice', 'bob', 'charlie']
  
  for (const userId of users) {
    console.log(`👤 User: ${userId}`)
    
    // TTS Quest
    updateTTSProgress(userId, 'tts-enabled', 1)
    const ttsResult = await handleQuestCompletion(userId, 'quest-tts-001')
    console.log(`   ✅ TTS Quest: ${ttsResult.success ? 'Completed' : 'Failed'}`)
    
    // Regular quest
    updateUserProgress(userId, 'quest-001', 'login', 1)
    updateUserProgress(userId, 'quest-001', 'profile-setup', 1)
    const regularResult = await handleQuestCompletion(userId, 'quest-001')
    console.log(`   ✅ Regular Quest: ${regularResult.success ? 'Completed' : 'Failed'}`)
    
    const userRewards = getUserRewards(userId)
    console.log(`   📊 Total badges: ${userRewards.length}`)
    console.log()
  }

  // Show all rewards
  const allRewards = getAllRewards()
  console.log(`📈 System-wide Statistics:`)
  console.log(`   Total rewards tracked: ${allRewards.length}`)
  console.log(`   Normal minting: ${allRewards.filter(r => !r.fallbackUsed).length}`)
  console.log(`   Fallback minting: ${allRewards.filter(r => r.fallbackUsed).length}`)
  console.log()
}

/**
 * Example 4: Export reward log
 */
async function example4_ExportRewardLog() {
  console.log('=== Example 4: Export Reward Log ===\n')

  const exportPath = './demo-reward-log.json'
  
  console.log(`📦 Exporting all rewards to ${exportPath}...`)
  exportRewardLog(exportPath)
  
  const allRewards = getAllRewards()
  console.log(`✅ Exported ${allRewards.length} reward entries`)
  console.log(`📄 File location: ${exportPath}`)
  console.log()
  
  // Show sample of exported data
  if (allRewards.length > 0) {
    console.log('📋 Sample reward entry:')
    const sample = allRewards[allRewards.length - 1]
    console.log(JSON.stringify(sample, null, 2))
  }
  console.log()
}

/**
 * Example 5: Dashboard-style report
 */
async function example5_DashboardReport() {
  console.log('=== Example 5: Reward Dashboard Report ===\n')

  const allRewards = getAllRewards()
  
  console.log('🎖️ REWARD DASHBOARD')
  console.log('═══════════════════════════════════════════════════════\n')
  
  // Group by user
  const userMap = new Map<string, any[]>()
  allRewards.forEach(reward => {
    if (!userMap.has(reward.userId)) {
      userMap.set(reward.userId, [])
    }
    userMap.get(reward.userId)!.push(reward)
  })

  console.log(`👥 Total Users: ${userMap.size}`)
  console.log(`🎖️  Total Badges: ${allRewards.length}`)
  console.log(`🚀 Normal Minting: ${allRewards.filter(r => !r.fallbackUsed).length}`)
  console.log(`✅ Fallback Minting: ${allRewards.filter(r => r.fallbackUsed).length}`)
  console.log()

  // Top users
  const userStats = Array.from(userMap.entries())
    .map(([userId, rewards]) => ({
      userId,
      count: rewards.length,
      fallbackCount: rewards.filter(r => r.fallbackUsed).length
    }))
    .sort((a, b) => b.count - a.count)

  console.log('🏆 Top Badge Earners:')
  userStats.slice(0, 5).forEach((stat, index) => {
    console.log(`   ${index + 1}. ${stat.userId}: ${stat.count} badges (${stat.fallbackCount} via fallback)`)
  })
  console.log()
}

// Run all examples
async function runDemo() {
  try {
    await example1_NormalRewardTracking()
    await example2_FallbackRewardTracking()
    await example3_MultipleUsers()
    await example4_ExportRewardLog()
    await example5_DashboardReport()

    console.log('✅ All examples completed successfully!\n')
    console.log('💡 Next steps:')
    console.log('   - Integrate RewardDashboard.tsx into your app')
    console.log('   - Use exportRewardLog() for backup/audit')
    console.log('   - Track rewards automatically when quests complete')
    console.log('   - Build a leaderboard from reward data')
  } catch (error) {
    console.error('❌ Error running demo:', error)
    throw error
  }
}

runDemo()
