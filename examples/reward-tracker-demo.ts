/**
 * Example usage of Reward Tracker system
 * Demonstrates integration with MeeChain quest completion and MeeBot
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateUserProgress } from '../src/verifiers/questVerifier.js'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier.js'
import { getUserRewards, clearRewards } from '../tracker/RewardTracker.js'
import { setPrimaryMintingStatus } from '../src/minting/badgeMinter.js'
import { MeeBot } from '../components/MeeBot.js'

console.log('🎮 MeeChain Reward Tracker Demo')
console.log('=' .repeat(50))
console.log('')

// Example 1: Complete a quest and track reward
console.log('Example 1: Complete Quest and Track Reward')
console.log('-'.repeat(50))

async function example1() {
  clearRewards()
  const userId = 'demo-user-1'
  const questId = 'quest-001'
  
  console.log(`📝 User ${userId} is attempting quest ${questId}`)
  
  // Update progress
  updateUserProgress(userId, questId, 'login', 1)
  updateUserProgress(userId, questId, 'profile-setup', 1)
  console.log('✅ Quest conditions met')
  
  // Complete quest
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success) {
    console.log(`🎉 Quest completed! Badge: ${result.tx?.badgeId}`)
    console.log(`📊 Transaction: ${result.tx?.txHash}`)
    
    // Check tracked rewards
    const rewards = getUserRewards(userId)
    console.log(`\n🏆 Total badges earned: ${rewards.length}`)
    console.log('Reward details:', rewards[0])
  }
  console.log('')
}

// Example 2: Fallback minting and tracking
console.log('\nExample 2: Fallback Minting with Reward Tracking')
console.log('-'.repeat(50))

async function example2() {
  const userId = 'demo-user-2'
  const questId = 'quest-002'
  
  console.log(`📝 User ${userId} is attempting quest ${questId}`)
  console.log('⚠️ Simulating primary chain failure...')
  
  // Disable primary chain
  setPrimaryMintingStatus(false)
  
  // Update progress
  updateUserProgress(userId, questId, 'nft-minted', 3)
  updateUserProgress(userId, questId, 'nft-traded', 1)
  console.log('✅ Quest conditions met')
  
  // Complete quest
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success) {
    console.log(`🎉 Quest completed via fallback! Badge: ${result.tx?.badgeId}`)
    console.log(`⚠️ Fallback used: ${result.fallback}`)
    
    // Check tracked rewards
    const rewards = getUserRewards(userId)
    console.log(`\n🏆 Total badges earned: ${rewards.length}`)
    console.log('Reward details:', rewards[0])
    console.log(`📊 Fallback status tracked: ${rewards[0].fallbackUsed}`)
  }
  
  // Re-enable primary chain
  setPrimaryMintingStatus(true)
  console.log('')
}

// Example 3: TTS Quest with Reward Tracking
console.log('\nExample 3: TTS Quest with Reward Tracking')
console.log('-'.repeat(50))

async function example3() {
  const userId = 'demo-user-3'
  const questId = 'quest-tts-001'
  
  console.log(`📝 User ${userId} is attempting TTS quest`)
  
  // Enable TTS
  updateTTSProgress(userId, 'tts-enabled', 1)
  console.log('🔊 TTS enabled')
  
  // Complete quest
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success) {
    console.log(`🎉 TTS Quest completed! Badge: ${result.tx?.badgeId}`)
    
    // Check tracked rewards
    const rewards = getUserRewards(userId)
    console.log(`\n🏆 Total badges earned: ${rewards.length}`)
    console.log('Reward details:', rewards[0])
  }
  console.log('')
}

// Example 4: View All User Rewards (Dashboard simulation)
console.log('\nExample 4: Reward Dashboard Simulation')
console.log('-'.repeat(50))

async function example4() {
  const userId = 'demo-user-dashboard'
  
  // Complete multiple quests
  console.log(`📝 User ${userId} completing multiple quests...`)
  
  // Quest 1
  updateUserProgress(userId, 'quest-001', 'login', 1)
  updateUserProgress(userId, 'quest-001', 'profile-setup', 1)
  await handleQuestCompletion(userId, 'quest-001')
  
  // Quest 2 with fallback
  setPrimaryMintingStatus(false)
  updateUserProgress(userId, 'quest-002', 'nft-minted', 3)
  updateUserProgress(userId, 'quest-002', 'nft-traded', 1)
  await handleQuestCompletion(userId, 'quest-002')
  setPrimaryMintingStatus(true)
  
  // Get all rewards for dashboard
  const rewards = getUserRewards(userId)
  
  console.log(`\n📊 Reward Dashboard for ${userId}`)
  console.log('=' .repeat(50))
  console.log(`🏆 Total badges earned: ${rewards.length}`)
  console.log('')
  
  rewards.forEach((reward, index) => {
    console.log(`Badge #${index + 1}:`)
    console.log(`  Quest: ${reward.questId}`)
    console.log(`  Badge ID: ${reward.badgeId}`)
    console.log(`  Time: ${new Date(reward.timestamp).toLocaleString()}`)
    console.log(`  Status: ${reward.fallbackUsed ? '✅ Fallback' : '🚀 Normal'}`)
    console.log('')
  })
  
  // MeeBot provides proud feedback
  console.log('🤖 MeeBot Feedback:')
  MeeBot.setSprite('proud')
  MeeBot.speak(`คุณได้รับทั้งหมด ${rewards.length} badge แล้วครับ เก่งมาก!`)
  console.log('')
}

// Run all examples
async function runAllExamples() {
  await example1()
  await example2()
  await example3()
  await example4()
  
  console.log('✅ All examples completed!')
  console.log('')
  console.log('Key Features Demonstrated:')
  console.log('  ✓ Reward tracking on quest completion')
  console.log('  ✓ Fallback status tracking')
  console.log('  ✓ TTS quest integration')
  console.log('  ✓ Reward dashboard display')
  console.log('  ✓ MeeBot emotional feedback')
  console.log('  ✓ Timestamp tracking')
}

runAllExamples().catch(console.error)
