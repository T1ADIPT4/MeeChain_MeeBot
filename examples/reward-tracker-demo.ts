/**
 * Example: Reward Tracker Integration with MeeBot
 * Demonstrates the complete flow of quest completion with reward tracking
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import { getUserRewards, getUserRewardCount } from '../tracker/RewardTracker.js'
import { getRewardStatistics, getUserRewardSummary, generateTelemetryReport } from '../tracker/RewardLog.js'
import { MeeBot } from '../components/MeeBot.js'
import { setPrimaryMintingStatus } from '../src/minting/badgeMinter.js'

console.log('🎮 MeeChain Reward Tracker Demo\n')
console.log('=' .repeat(50))

/**
 * Example 1: Complete a TTS quest and track the reward
 */
async function example1_CompleteQuestAndTrackReward() {
  console.log('\n📌 Example 1: Complete TTS Quest and Track Reward\n')
  
  const userId = 'demo-user-001'
  const questId = 'quest-tts-001'
  
  // Step 1: Enable TTS to meet quest conditions
  console.log('Step 1: Enabling TTS...')
  updateTTSProgress(userId, 'tts-enabled', 1)
  MeeBot.setSprite('happy')
  MeeBot.speak('เปิด TTS แล้วครับ!')
  
  // Step 2: Complete the quest
  console.log('\nStep 2: Completing quest...')
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success) {
    if (result.fallback) {
      MeeBot.setSprite('confused')
      MeeBot.speak('ระบบ fallback ทำงานแล้วครับ คุณยังได้รับ badge อยู่นะ')
    } else {
      MeeBot.setSprite('celebrate')
      MeeBot.speak('คุณได้รับ badge แล้ว เยี่ยมมาก!')
    }
    
    console.log('✅ Quest completed successfully!')
    console.log(`   Badge ID: ${result.tx?.badgeId}`)
    console.log(`   TX Hash: ${result.tx?.txHash}`)
    console.log(`   Chain: ${result.tx?.chain}`)
    console.log(`   Fallback used: ${result.fallback ? 'Yes' : 'No'}`)
  }
  
  // Step 3: Check user's rewards
  console.log('\nStep 3: Checking user rewards...')
  const rewards = getUserRewards(userId)
  console.log(`User has ${rewards.length} badge(s):`)
  rewards.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.questId} - ${r.badgeId} (${r.fallbackUsed ? 'fallback' : 'primary'})`)
  })
}

/**
 * Example 2: Handle fallback minting scenario
 */
async function example2_FallbackScenario() {
  console.log('\n📌 Example 2: Fallback Minting Scenario\n')
  
  const userId = 'demo-user-002'
  const questId = 'quest-tts-001'
  
  // Simulate primary chain failure
  console.log('Simulating primary chain failure...')
  setPrimaryMintingStatus(false)
  
  // Enable TTS
  updateTTSProgress(userId, 'tts-enabled', 1)
  
  // Complete quest
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success && result.fallback) {
    console.log('✅ Quest completed via fallback!')
    console.log(`   Badge ID: ${result.tx?.badgeId}`)
    console.log(`   TX Hash: ${result.tx?.txHash}`)
    console.log(`   Chain: ${result.tx?.chain}`)
    
    MeeBot.setSprite('confused')
    MeeBot.speak('ระบบ fallback ทำงานแล้วนะครับ แต่คุณก็ได้ badge แล้ว!')
  }
  
  // Reset primary minting status
  setPrimaryMintingStatus(true)
}

/**
 * Example 3: View user reward dashboard
 */
async function example3_RewardDashboard() {
  console.log('\n📌 Example 3: Reward Dashboard\n')
  
  const userId = 'demo-user-001'
  const rewardCount = getUserRewardCount(userId)
  
  MeeBot.setSprite('proud')
  MeeBot.speak(`คุณได้รับทั้งหมด ${rewardCount} badge แล้วครับ เก่งมาก!`)
  
  // Get detailed summary
  const summary = getUserRewardSummary(userId)
  console.log(`User Reward Summary:`)
  console.log(`  Total Badges: ${summary.totalBadges}`)
  console.log(`  Primary Badges: ${summary.primaryBadges}`)
  console.log(`  Fallback Badges: ${summary.fallbackBadges}`)
  console.log(`  Quests Completed: ${summary.questsCompleted.join(', ')}`)
  
  if (summary.firstReward) {
    console.log(`  First Badge: ${new Date(summary.firstReward.timestamp).toLocaleString('th-TH')}`)
  }
  if (summary.latestReward) {
    console.log(`  Latest Badge: ${new Date(summary.latestReward.timestamp).toLocaleString('th-TH')}`)
  }
}

/**
 * Example 4: System statistics and telemetry
 */
async function example4_SystemTelemetry() {
  console.log('\n📌 Example 4: System Statistics & Telemetry\n')
  
  // Get overall statistics
  const stats = getRewardStatistics()
  console.log('System Statistics:')
  console.log(`  Total Rewards: ${stats.totalRewards}`)
  console.log(`  Primary Rewards: ${stats.primaryRewards}`)
  console.log(`  Fallback Rewards: ${stats.fallbackRewards}`)
  console.log(`  Fallback Rate: ${stats.fallbackPercentage.toFixed(2)}%`)
  console.log(`  Unique Users: ${stats.uniqueUsers}`)
  console.log(`  Unique Quests: ${stats.uniqueQuests}`)
  
  // Generate telemetry report
  const telemetry = generateTelemetryReport()
  console.log(`\nSystem Health:`)
  console.log(`  Status: ${telemetry.systemHealth.healthStatus.toUpperCase()}`)
  console.log(`  Fallback Rate: ${telemetry.systemHealth.fallbackRate.toFixed(2)}%`)
  
  if (telemetry.systemHealth.healthStatus === 'healthy') {
    MeeBot.setSprite('happy')
    MeeBot.speak('ระบบทำงานได้ดีมากครับ!')
  } else if (telemetry.systemHealth.healthStatus === 'warning') {
    MeeBot.setSprite('concerned')
    MeeBot.speak('ระบบมีการใช้ fallback บ่อยขึ้นนะ ควรตรวจสอบ')
  } else {
    MeeBot.setSprite('sad')
    MeeBot.speak('เตือน! ระบบใช้ fallback บ่อยมาก ต้องแก้ไขด่วน')
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await example1_CompleteQuestAndTrackReward()
    await example2_FallbackScenario()
    await example3_RewardDashboard()
    await example4_SystemTelemetry()
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ All examples completed successfully!')
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Error running examples:', error)
    process.exit(1)
  }
}

// Run the demo
runAllExamples()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
