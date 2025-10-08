/**
 * Admin Panel Demo
 * Demonstrates usage of the Leaderboard and Admin Panel features
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateUserProgress } from '../src/verifiers/questVerifier.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import {
  getAllRewards,
  getRewardsByUser,
  getFallbackRewards,
  getBadgeCount,
  clearRewards,
} from '../tracker/RewardTracker.js'
import { exportRewardLog, getExportPreview } from '../tracker/RewardExporter.js'
import { triggerManualBadge } from '../admin/AdminActions.js'
import { setPrimaryMintingStatus } from '../src/minting/badgeMinter.js'

async function runAdminDemo() {
  console.log('🛡️  MeeChain Admin Panel Demo')
  console.log('='.repeat(60))
  console.log('')

  // Clear previous data
  clearRewards()

  // Simulate multiple users completing quests
  console.log('📋 Step 1: Simulating quest completions...')
  console.log('')

  // User 1 completes multiple quests
  console.log('  → user-alice completes quest-001')
  updateUserProgress('user-alice', 'quest-001', 'login', 1)
  updateUserProgress('user-alice', 'quest-001', 'profile-setup', 1)
  await handleQuestCompletion('user-alice', 'quest-001')

  console.log('  → user-alice completes quest-002')
  updateUserProgress('user-alice', 'quest-002', 'nft-minted', 3)
  updateUserProgress('user-alice', 'quest-002', 'nft-traded', 1)
  await handleQuestCompletion('user-alice', 'quest-002')

  console.log('  → user-alice completes TTS quest')
  updateTTSProgress('user-alice', 'tts-enabled', 1)
  await handleQuestCompletion('user-alice', 'quest-tts-001')

  // User 2 completes quests
  console.log('  → user-bob completes quest-001')
  updateUserProgress('user-bob', 'quest-001', 'login', 1)
  updateUserProgress('user-bob', 'quest-001', 'profile-setup', 1)
  await handleQuestCompletion('user-bob', 'quest-001')

  console.log('  → user-bob completes quest-002 (via fallback)')
  setPrimaryMintingStatus(false) // Simulate primary chain failure
  updateUserProgress('user-bob', 'quest-002', 'nft-minted', 3)
  updateUserProgress('user-bob', 'quest-002', 'nft-traded', 1)
  await handleQuestCompletion('user-bob', 'quest-002')
  setPrimaryMintingStatus(true) // Reset

  // User 3 completes one quest
  console.log('  → user-charlie completes quest-001')
  updateUserProgress('user-charlie', 'quest-001', 'login', 1)
  updateUserProgress('user-charlie', 'quest-001', 'profile-setup', 1)
  await handleQuestCompletion('user-charlie', 'quest-001')

  console.log('')
  console.log('✅ Quest completions finished!')
  console.log('')

  // Display Leaderboard
  console.log('🏆 Step 2: Displaying Leaderboard')
  console.log('-'.repeat(60))
  const allRewards = getAllRewards()
  const leaderboard = allRewards.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sorted = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .map(([userId, count], index) => ({
      rank: index + 1,
      userId,
      badgeCount: count,
    }))

  sorted.forEach((entry) => {
    const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '  '
    console.log(`  ${medal} #${entry.rank} ${entry.userId.padEnd(20)} - ${entry.badgeCount} badges`)
  })
  console.log('')

  // Display statistics
  console.log('📊 Step 3: System Statistics')
  console.log('-'.repeat(60))
  const fallbackRewards = getFallbackRewards()
  const uniqueUsers = new Set(allRewards.map((r) => r.userId)).size
  const fallbackRate = allRewards.length > 0 ? (fallbackRewards.length / allRewards.length) * 100 : 0

  console.log(`  Total Badges Minted:    ${allRewards.length}`)
  console.log(`  Total Active Users:     ${uniqueUsers}`)
  console.log(`  Fallback Usage:         ${fallbackRewards.length} (${fallbackRate.toFixed(1)}%)`)
  console.log(`  Primary Chain Success:  ${allRewards.length - fallbackRewards.length}`)
  console.log('')

  // Show user-specific stats
  console.log('👤 Step 4: User-specific Statistics')
  console.log('-'.repeat(60))
  console.log(`  user-alice badges:      ${getBadgeCount('user-alice')}`)
  console.log(`  user-bob badges:        ${getBadgeCount('user-bob')}`)
  console.log(`  user-charlie badges:    ${getBadgeCount('user-charlie')}`)
  console.log('')

  // Admin action: Grant manual badge
  console.log('⚙️  Step 5: Admin Actions')
  console.log('-'.repeat(60))
  console.log('  🎖️  Granting special event badge to user-charlie...')
  triggerManualBadge('user-charlie', 'special-event-quest', 'admin-demo')
  console.log(`  ✅ Badge granted! New count: ${getBadgeCount('user-charlie')}`)
  console.log('')

  // Export reward log
  console.log('📤 Step 6: Exporting Reward Log')
  console.log('-'.repeat(60))
  const exportPreview = getExportPreview()
  console.log(`  Export Date:            ${exportPreview.exportedAt}`)
  console.log(`  Total Records:          ${exportPreview.totalRewards}`)
  console.log('')
  console.log('  Preview of first 3 records:')
  exportPreview.rewards.slice(0, 3).forEach((reward, index) => {
    console.log(`    ${index + 1}. ${reward.userId} - ${reward.questId} (fallback: ${reward.fallbackUsed})`)
  })
  console.log('')

  // Simulate export
  console.log('  📁 Exporting to ./logs/reward-log.json...')
  const result = exportRewardLog('./logs/reward-log.json')
  console.log(`  ${result}`)
  console.log('')

  // Final summary
  console.log('✨ Demo Complete!')
  console.log('='.repeat(60))
  console.log('')
  console.log('📚 Summary of Admin Panel Features:')
  console.log('  • 🏆 Leaderboard: Rankings by badge count')
  console.log('  • 📊 Statistics: Total badges, users, fallback rate')
  console.log('  • 👤 User Stats: Individual badge counts')
  console.log('  • 🎖️  Manual Badges: Admin can grant special badges')
  console.log('  • 📤 Export Logs: Export reward data for audit/analysis')
  console.log('')
  console.log('🤖 MeeBot Status: Admin mode with sprite and TTS feedback')
  console.log('')
}

// Run the demo
runAdminDemo()
  .then(() => {
    console.log('Demo completed successfully! 🎉')
  })
  .catch((error) => {
    console.error('Error running demo:', error)
    process.exit(1)
  })
