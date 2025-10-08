/**
 * Admin System Demo
 * Demonstrates the usage of leaderboard, admin panel, and reward tracking
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import { updateUserProgress } from '../src/verifiers/questVerifier.js'
import {
  getAllRewards,
  getUserRewards,
  getRewardCountByUser,
  clearRewards
} from '../tracker/RewardTracker.js'
import { exportRewardLog, exportRewardStats } from '../tracker/RewardExporter.js'
import { triggerManualBadge } from '../admin/AdminActions.js'

console.log('🎮 MeeChain Admin System Demo\n')
console.log('═══════════════════════════════════════\n')

// Clear previous rewards for clean demo
clearRewards()

async function runDemo() {
  // Scenario 1: Users completing quests
  console.log('📝 Scenario 1: Users completing quests\n')
  
  // User 1 completes TTS quest
  console.log('👤 User alice enabling TTS...')
  updateTTSProgress('alice', 'tts-enabled', 1)
  await handleQuestCompletion('alice', 'quest-tts-001')
  
  // User 2 completes TTS quest
  console.log('👤 User bob enabling TTS...')
  updateTTSProgress('bob', 'tts-enabled', 1)
  await handleQuestCompletion('bob', 'quest-tts-001')
  
  // User 1 completes another quest
  console.log('👤 User alice completing First Steps quest...')
  updateUserProgress('alice', 'quest-001', 'login', 1)
  updateUserProgress('alice', 'quest-001', 'profile-setup', 1)
  await handleQuestCompletion('alice', 'quest-001')
  
  // User 3 completes TTS quest
  console.log('👤 User charlie enabling TTS...')
  updateTTSProgress('charlie', 'tts-enabled', 1)
  await handleQuestCompletion('charlie', 'quest-tts-001')
  
  // User 1 completes NFT quest
  console.log('👤 User alice completing NFT Collector quest...')
  updateUserProgress('alice', 'quest-002', 'nft-minted', 3)
  updateUserProgress('alice', 'quest-002', 'nft-traded', 1)
  await handleQuestCompletion('alice', 'quest-002')
  
  console.log('\n═══════════════════════════════════════\n')
  
  // Scenario 2: Admin grants manual badge
  console.log('📝 Scenario 2: Admin grants special badge\n')
  console.log('🎖️  Admin granting special event badge to charlie...')
  triggerManualBadge('charlie', 'special-event-2024')
  
  console.log('\n═══════════════════════════════════════\n')
  
  // Scenario 3: View leaderboard
  console.log('📝 Scenario 3: Leaderboard Rankings\n')
  const leaderboard = getRewardCountByUser()
  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1])
  
  console.log('🏆 LEADERBOARD')
  console.log('─────────────────────────────────────')
  sorted.forEach(([userId, count], index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  '
    console.log(`${medal} ${index + 1}. ${userId.padEnd(10)} – ${count} badge${count > 1 ? 's' : ''}`)
  })
  
  console.log('\n═══════════════════════════════════════\n')
  
  // Scenario 4: View individual user rewards
  console.log('📝 Scenario 4: User Reward Details\n')
  const aliceRewards = getUserRewards('alice')
  console.log(`👤 Alice's badges (${aliceRewards.length} total):`)
  aliceRewards.forEach(reward => {
    const chain = reward.fallbackUsed ? '⚠️  fallback' : '✅ primary'
    console.log(`   - ${reward.questId} [${chain}]`)
  })
  
  console.log('\n═══════════════════════════════════════\n')
  
  // Scenario 5: Export statistics
  console.log('📝 Scenario 5: System Statistics\n')
  const stats = exportRewardStats()
  console.log('📊 STATISTICS')
  console.log('─────────────────────────────────────')
  console.log(`Total Rewards:     ${stats.totalRewards}`)
  console.log(`Total Users:       ${stats.totalUsers}`)
  console.log(`Fallback Rate:     ${(stats.fallbackRate * 100).toFixed(1)}%`)
  console.log('\nRewards by Quest:')
  Object.entries(stats.rewardsByQuest).forEach(([questId, count]) => {
    console.log(`  - ${questId}: ${count}`)
  })
  
  console.log('\n═══════════════════════════════════════\n')
  
  // Scenario 6: Export reward log
  console.log('📝 Scenario 6: Export Reward Log\n')
  const exportResult = exportRewardLog('./logs/demo-rewards.json')
  console.log(`📤 Exported ${exportResult.count} reward records`)
  console.log(`   Filepath: ${exportResult.filepath}`)
  
  console.log('\n═══════════════════════════════════════\n')
  
  // Summary
  console.log('✅ Demo completed successfully!\n')
  console.log('Summary:')
  console.log(`  - ${stats.totalUsers} users participated`)
  console.log(`  - ${stats.totalRewards} badges awarded`)
  console.log(`  - alice is the top player with ${leaderboard['alice']} badges 🥇`)
  console.log('\n🎉 Admin system is ready for production!')
}

// Run the demo
runDemo().catch((error) => {
  console.error('❌ Demo failed:', error)
  process.exit(1)
})
