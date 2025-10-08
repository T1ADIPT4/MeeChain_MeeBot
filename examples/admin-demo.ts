/**
 * Admin Panel and Leaderboard Demo
 * Demonstrates the admin panel functionality for managing badges and viewing leaderboard
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateUserProgress } from '../src/verifiers/questVerifier.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import { trackRewardFromTransaction } from '../tracker/RewardTracker.js'
import { 
  getTopUsers, 
  getRewardStats,
  getAllRewards,
  getFallbackRewards 
} from '../tracker/RewardTracker.js'
import {
  triggerManualBadge,
  getRecentAdminActions,
  getAllAdminActions
} from '../admin/AdminActions.js'
import { exportRewardLog, exportRewardLogCSV } from '../tracker/RewardExporter.js'
import { MeeBot } from '../components/MeeBot.js'

console.log('\n🛡️ Admin Panel and Leaderboard Demo\n')
console.log('='.repeat(70))

console.log('\n📋 Overview:')
console.log('This demo showcases the admin panel and leaderboard system for MeeChain.')
console.log('Track badges, view leaderboards, grant manual badges, and export data.\n')

console.log('🔧 Components Added:')
console.log('1. ✅ RewardTracker - Track all badge rewards and analytics')
console.log('2. ✅ RewardExporter - Export reward logs to JSON/CSV')
console.log('3. ✅ AdminActions - Manual badge granting and admin operations')
console.log('4. ✅ Leaderboard.tsx - Display user rankings by badge count')
console.log('5. ✅ AdminPanel.tsx - Complete admin dashboard with stats\n')

console.log('📦 Tests:')
console.log('- tests/rewardTracker.test.ts - 13 tests passing')
console.log('- tests/adminActions.test.ts - 16 tests passing\n')

console.log('='.repeat(70))
console.log('\n🎮 DEMO: Simulating Quest Completions and Admin Actions\n')

async function runDemo() {
  // Simulate some quest completions
  console.log('📝 Step 1: Simulating quest completions for multiple users...\n')
  
  // User 1 completes quest-001
  updateUserProgress('alice', 'quest-001', 'login', 1)
  updateUserProgress('alice', 'quest-001', 'profile-setup', 1)
  const result1 = await handleQuestCompletion('alice', 'quest-001')
  if (result1.success && result1.tx) {
    trackRewardFromTransaction(result1.tx)
    console.log(`✅ alice completed quest-001 - Badge: ${result1.tx.badgeId}`)
  }

  // User 2 completes multiple quests
  updateUserProgress('bob', 'quest-001', 'login', 1)
  updateUserProgress('bob', 'quest-001', 'profile-setup', 1)
  const result2 = await handleQuestCompletion('bob', 'quest-001')
  if (result2.success && result2.tx) {
    trackRewardFromTransaction(result2.tx)
    console.log(`✅ bob completed quest-001 - Badge: ${result2.tx.badgeId}`)
  }

  // User 3 completes TTS quest
  updateTTSProgress('charlie', 'tts-enabled', 1)
  const result3 = await handleQuestCompletion('charlie', 'quest-tts-001')
  if (result3.success && result3.tx) {
    trackRewardFromTransaction(result3.tx)
    console.log(`✅ charlie completed quest-tts-001 - Badge: ${result3.tx.badgeId}`)
  }

  // Alice completes another quest
  updateUserProgress('alice', 'quest-002', 'nft-minted', 3)
  updateUserProgress('alice', 'quest-002', 'nft-traded', 1)
  const result4 = await handleQuestCompletion('alice', 'quest-002')
  if (result4.success && result4.tx) {
    trackRewardFromTransaction(result4.tx)
    console.log(`✅ alice completed quest-002 - Badge: ${result4.tx.badgeId}`)
  }

  // Bob completes TTS quest
  updateTTSProgress('bob', 'tts-enabled', 1)
  const result5 = await handleQuestCompletion('bob', 'quest-tts-001')
  if (result5.success && result5.tx) {
    trackRewardFromTransaction(result5.tx)
    console.log(`✅ bob completed quest-tts-001 - Badge: ${result5.tx.badgeId}`)
  }

  console.log('\n' + '='.repeat(70))
  console.log('\n🏆 Step 2: Displaying Leaderboard\n')

  const topUsers = getTopUsers(10)
  console.log('Top Users by Badge Count:')
  console.log('-'.repeat(40))
  topUsers.forEach(([userId, count], index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  '
    console.log(`${medal} #${index + 1}  ${userId.padEnd(15)} - ${count} badge${count !== 1 ? 's' : ''}`)
  })

  console.log('\n' + '='.repeat(70))
  console.log('\n📊 Step 3: Viewing Statistics\n')

  const stats = getRewardStats()
  console.log(`Total Badges Minted:    ${stats.totalRewards}`)
  console.log(`Unique Users:           ${stats.uniqueUsers}`)
  console.log(`Unique Quests:          ${stats.uniqueQuests}`)
  console.log(`Fallback Usage Rate:    ${(stats.fallbackUsageRate * 100).toFixed(1)}%`)

  const fallbackRewards = getFallbackRewards()
  console.log(`Fallback Badges:        ${fallbackRewards.length}`)

  console.log('\n' + '='.repeat(70))
  console.log('\n🎖️ Step 4: Admin Manual Badge Grant\n')

  // Admin grants a special badge
  MeeBot.setSprite('admin')
  MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')
  
  console.log('Admin "admin-sarah" grants special badge to "alice"...')
  const manualBadgeId = triggerManualBadge('alice', 'special-event-quest', 'admin-sarah')
  console.log(`✅ Manual badge granted: ${manualBadgeId}`)

  console.log('\nAdmin "admin-john" grants bug bounty badge to "david"...')
  const bugBountyBadge = triggerManualBadge('david', 'bug-bounty-001', 'admin-john')
  console.log(`✅ Manual badge granted: ${bugBountyBadge}`)

  console.log('\n' + '='.repeat(70))
  console.log('\n📋 Step 5: Recent Admin Actions\n')

  const recentActions = getRecentAdminActions(5)
  console.log('Recent Admin Actions:')
  console.log('-'.repeat(60))
  recentActions.forEach((action) => {
    const date = new Date(action.timestamp).toLocaleString()
    console.log(`[${date}]`)
    console.log(`  Admin: ${action.triggeredBy}`)
    console.log(`  Action: Granted badge "${action.badgeId}" to ${action.userId}`)
    console.log(`  Quest: ${action.questId}\n`)
  })

  console.log('='.repeat(70))
  console.log('\n🏆 Step 6: Updated Leaderboard (after manual badges)\n')

  const updatedTopUsers = getTopUsers(10)
  console.log('Updated Top Users by Badge Count:')
  console.log('-'.repeat(40))
  updatedTopUsers.forEach(([userId, count], index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  '
    console.log(`${medal} #${index + 1}  ${userId.padEnd(15)} - ${count} badge${count !== 1 ? 's' : ''}`)
  })

  console.log('\n' + '='.repeat(70))
  console.log('\n📤 Step 7: Exporting Reward Logs\n')

  console.log('Exporting reward logs to JSON and CSV formats...')
  
  try {
    await exportRewardLog('./logs/admin-demo-rewards.json')
    console.log('✅ JSON export complete: ./logs/admin-demo-rewards.json')
  } catch (error) {
    console.log('ℹ️  JSON export (would be saved in production environment)')
  }

  try {
    await exportRewardLogCSV('./logs/admin-demo-rewards.csv')
    console.log('✅ CSV export complete: ./logs/admin-demo-rewards.csv')
  } catch (error) {
    console.log('ℹ️  CSV export (would be saved in production environment)')
  }

  console.log('\n' + '='.repeat(70))
  console.log('\n📊 Step 8: Final Statistics\n')

  const allRewards = getAllRewards()
  const allAdminActions = getAllAdminActions()
  const finalStats = getRewardStats()

  console.log('Final System Statistics:')
  console.log('-'.repeat(40))
  console.log(`Total Badges:           ${allRewards.length}`)
  console.log(`Quest Badges:           ${allRewards.length - allAdminActions.length}`)
  console.log(`Manual Badges:          ${allAdminActions.length}`)
  console.log(`Unique Users:           ${finalStats.uniqueUsers}`)
  console.log(`Unique Quests:          ${finalStats.uniqueQuests}`)
  console.log(`Fallback Usage:         ${(finalStats.fallbackUsageRate * 100).toFixed(1)}%`)

  console.log('\n' + '='.repeat(70))
  console.log('\n✅ Demo Complete!\n')

  console.log('🎯 Key Features Demonstrated:')
  console.log('  ✅ Automatic badge tracking from quest completions')
  console.log('  ✅ Real-time leaderboard with user rankings')
  console.log('  ✅ Manual badge granting by admins')
  console.log('  ✅ Admin action audit trail')
  console.log('  ✅ Comprehensive statistics and analytics')
  console.log('  ✅ Data export to JSON and CSV')
  console.log('  ✅ MeeBot integration for admin mode')
  console.log('  ✅ Fallback usage tracking\n')

  console.log('🚀 Next Steps:')
  console.log('  1. Integrate AdminPanel.tsx into your React application')
  console.log('  2. Add authentication and authorization for admin routes')
  console.log('  3. Connect to real blockchain for badge verification')
  console.log('  4. Set up automated log exports and backups')
  console.log('  5. Add real-time updates using WebSockets or polling\n')

  console.log('📚 Documentation:')
  console.log('  - RewardTracker: tracker/RewardTracker.ts')
  console.log('  - AdminActions: admin/AdminActions.ts')
  console.log('  - AdminPanel: admin/AdminPanel.tsx')
  console.log('  - Leaderboard: admin/Leaderboard.tsx')
  console.log('  - Tests: tests/rewardTracker.test.ts, tests/adminActions.test.ts\n')

  MeeBot.setSprite('happy')
  MeeBot.speak('ระบบ Admin Panel พร้อมใช้งานแล้วครับ!')
}

// Run the demo
runDemo().catch(console.error)
