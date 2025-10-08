/**
 * Example usage of the MeeChain Quest Manager
 * Demonstrates fallback-aware quest completion with MeeBot integration
 */

import { handleQuestCompletion, getQuestStatus } from './QuestManager.js'
import { updateUserProgress } from './verifiers/questVerifier.js'
import { setPrimaryMintingStatus } from './minting/badgeMinter.js'
import { getLogs, clearLogs } from './utils/logger.js'
import { updateTTSSetting } from './pages/Settings.js'

// Mock MeeBot and TTS interfaces (replace with actual implementation)
const MeeBot = {
  setSprite: (emotion: string) => {
    console.log(`🤖 MeeBot: Setting sprite to "${emotion}"`)
  },
}

const TTS = {
  speak: (message: string) => {
    console.log(`🔊 TTS: "${message}"`)
  },
}

/**
 * Example 1: Successful quest completion with primary minting
 */
async function example1_SuccessfulCompletion() {
  console.log('\n=== Example 1: Successful Quest Completion ===\n')
  clearLogs()

  const userId = 'user-001'
  const questId = 'quest-001'

  // Simulate user completing quest conditions
  updateUserProgress(userId, questId, 'login', 1)
  updateUserProgress(userId, questId, 'profile-setup', 1)

  // Check status
  const status = await getQuestStatus(userId, questId)
  console.log(`Quest Status: ${status}`)

  // Complete the quest
  const result = await handleQuestCompletion(userId, questId)

  if (result.success && !result.fallback) {
    MeeBot.setSprite('happy')
    TTS.speak('เควสสำเร็จ! ได้รับ badge แล้ว')
    console.log(`\n✅ Badge minted successfully!`)
    console.log(`Transaction: ${result.tx?.txHash}`)
  }
}

/**
 * Example 2: Quest completion with fallback minting
 */
async function example2_FallbackMinting() {
  console.log('\n=== Example 2: Quest Completion with Fallback ===\n')
  clearLogs()

  const userId = 'user-002'
  const questId = 'quest-001'

  // Simulate user completing quest conditions
  updateUserProgress(userId, questId, 'login', 1)
  updateUserProgress(userId, questId, 'profile-setup', 1)

  // Simulate primary chain failure
  setPrimaryMintingStatus(false)

  // Complete the quest
  const result = await handleQuestCompletion(userId, questId)

  if (result.success && result.fallback) {
    MeeBot.setSprite('confused')
    TTS.speak('ระบบ fallback ทำงานแล้วนะครับ')
    console.log(`\n⚠️  Badge minted via fallback chain!`)
    console.log(`Transaction: ${result.tx?.txHash}`)
  }

  // Reset for next example
  setPrimaryMintingStatus(true)
}

/**
 * Example 3: Quest conditions not met
 */
async function example3_ConditionsNotMet() {
  console.log('\n=== Example 3: Quest Conditions Not Met ===\n')
  clearLogs()

  const userId = 'user-003'
  const questId = 'quest-002'

  // Only complete some conditions
  updateUserProgress(userId, questId, 'nft-minted', 1) // Needs 3

  // Try to complete the quest
  const result = await handleQuestCompletion(userId, questId)

  if (!result.success) {
    MeeBot.setSprite('sad')
    TTS.speak('เควสยังไม่สำเร็จนะครับ กรุณาทำเงื่อนไขให้ครบก่อน')
    console.log(`\n❌ Quest failed: ${result.reason}`)
  }
}

/**
 * Example 4: View all logs
 */
async function example4_ViewLogs() {
  console.log('\n=== Example 4: All Event Logs ===\n')
  
  const logs = getLogs()
  console.log(`Total events logged: ${logs.length}`)
  console.log('\nRecent events:')
  logs.slice(-5).forEach((log) => {
    console.log(`  - ${log.eventType} (${log.level}) at ${log.timestamp.toISOString()}`)
  })
}

/**
 * Example 5: TTS Quest - Enable TTS to receive badge
 */
async function example5_TTSQuest() {
  console.log('\n=== Example 5: TTS Quest ===\n')
  clearLogs()

  const userId = 'user-005'
  
  // User initially has TTS disabled
  console.log('User enables TTS in Settings...')
  await updateTTSSetting(userId, { ttsEnabled: false }, true)
  
  console.log('\n✅ TTS Quest example completed!')
}

// Run all examples
async function runExamples() {
  console.log('🚀 MeeChain Quest Manager - Example Demonstrations\n')
  
  await example1_SuccessfulCompletion()
  await example2_FallbackMinting()
  await example3_ConditionsNotMet()
  await example4_ViewLogs()
  await example5_TTSQuest()

  console.log('\n✅ All examples completed!\n')
}

// Execute if run directly
runExamples().catch(console.error)
