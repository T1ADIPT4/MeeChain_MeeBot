/**
 * Example: Fallback Telemetry Usage
 * Demonstrates how to use the fallback telemetry features for monitoring
 */

import { handleQuestCompletion } from '../src/QuestManager.js'
import { updateUserProgress } from '../src/verifiers/questVerifier.js'
import { setPrimaryMintingStatus } from '../src/minting/badgeMinter.js'
import { 
  clearLogs, 
  getFallbackTelemetry, 
  getFallbackLogs 
} from '../src/utils/logger.js'

console.log('🔍 MeeChain Fallback Telemetry Demo\n')
console.log('=' .repeat(50))

// Clear previous logs
clearLogs()

// Simulate primary chain failure
console.log('\n📡 Simulating primary chain failure...')
setPrimaryMintingStatus(false)

// Example 1: Complete multiple quests with fallback
console.log('\n1️⃣  Completing quests via fallback chain...\n')

const quests = [
  { 
    userId: 'user-001', 
    questId: 'quest-001',
    name: 'First Steps',
    conditions: [
      { type: 'login', value: 1 },
      { type: 'profile-setup', value: 1 }
    ]
  },
  { 
    userId: 'user-002', 
    questId: 'quest-003',
    name: 'TTS Badge',
    conditions: [
      { type: 'tts-enabled', value: 1 },
      { type: 'tts-used', value: 5 }
    ]
  },
  { 
    userId: 'user-003', 
    questId: 'quest-004',
    name: 'NFT Football',
    conditions: [
      { type: 'football-nft-minted', value: 1 },
      { type: 'football-vote-cast', value: 3 }
    ]
  }
]

// Complete all quests
for (const quest of quests) {
  console.log(`  Completing ${quest.name} for ${quest.userId}...`)
  
  for (const condition of quest.conditions) {
    updateUserProgress(quest.userId, quest.questId, condition.type, condition.value)
  }
  
  const result = await handleQuestCompletion(quest.userId, quest.questId)
  
  if (result.success) {
    console.log(`  ✅ Success via ${result.fallback ? 'fallback' : 'primary'} chain`)
    console.log(`     TX: ${result.tx?.txHash}`)
  } else {
    console.log(`  ❌ Failed: ${result.reason}`)
  }
}

// Example 2: View telemetry statistics
console.log('\n2️⃣  Fallback Telemetry Statistics\n')

const telemetry = getFallbackTelemetry()

console.log(`  📊 Fallback Attempts: ${telemetry.totalFallbackAttempts}`)
console.log(`  ✅ Fallback Successes: ${telemetry.totalFallbackSuccesses}`)
console.log(`  ❌ Fallback Failures: ${telemetry.totalFallbackFailures}`)
console.log(`  ⚠️  Primary Failures: ${telemetry.totalPrimaryFailures}`)
console.log(`  📈 Success Rate: ${telemetry.fallbackSuccessRate.toFixed(1)}%`)
console.log(`  🎯 Quests Using Fallback: ${telemetry.questsUsingFallback.join(', ')}`)

// Example 3: View detailed fallback logs
console.log('\n3️⃣  Detailed Fallback Logs\n')

const fallbackLogs = getFallbackLogs()

fallbackLogs.forEach((log: any, index: number) => {
  const statusEmoji: Record<string, string> = {
    'attempt': '🔄',
    'success': '✅',
    'failure': '❌'
  }
  
  console.log(`  ${statusEmoji[log.status]} Log ${index + 1}:`)
  console.log(`     Time: ${log.timestamp.toISOString()}`)
  console.log(`     User: ${log.userId}`)
  console.log(`     Quest: ${log.questId}`)
  console.log(`     Status: ${log.status}`)
  if (log.tx) {
    console.log(`     TX: ${log.tx}`)
  }
  if (log.error) {
    console.log(`     Error: ${log.error}`)
  }
  console.log()
})

// Example 4: Monitoring recommendations
console.log('4️⃣  Monitoring Recommendations\n')

const successRate = telemetry.fallbackSuccessRate

if (successRate < 50) {
  console.log('  🚨 CRITICAL: Fallback success rate below 50%!')
  console.log('     Action: Check fallback chain health immediately')
} else if (successRate < 90) {
  console.log('  ⚠️  WARNING: Fallback success rate below 90%')
  console.log('     Action: Monitor fallback chain performance')
} else {
  console.log('  ✅ HEALTHY: Fallback system operating normally')
}

if (telemetry.totalPrimaryFailures > 10) {
  console.log('\n  ⚠️  WARNING: High number of primary chain failures')
  console.log('     Action: Investigate primary chain issues')
}

console.log('\n' + '=' .repeat(50))
console.log('\n✨ Telemetry demo completed!\n')

// Export for use in other modules
export { telemetry, fallbackLogs }
