/**
 * Test suite for MeeChain Quest System
 * Demonstrates testing of fallback-aware quest verification and badge minting
 */

import { handleQuestCompletion, getQuestStatus } from './QuestManager.js'
import { 
  verifyQuestConditions, 
  updateUserProgress, 
  getUserProgress 
} from './verifiers/questVerifier.js'
import { 
  setPrimaryMintingStatus, 
  setFallbackMintingStatus 
} from './minting/badgeMinter.js'
import { clearLogs, getLogs, getLogsByType, getLogsByLevel } from './utils/logger.js'
import { verifyTTSQuest } from './quests/TTSQuestVerifier.js'
import { updateTTSSetting, handleTTSQuest } from './pages/Settings.js'

// Test utilities
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Assertion failed: ${message}`)
  }
  console.log(`✅ ${message}`)
}

function assertEquals<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`❌ ${message}\n  Expected: ${expected}\n  Actual: ${actual}`)
  }
  console.log(`✅ ${message}`)
}

// Test Suite
async function runTests() {
  console.log('\n🧪 MeeChain Quest System - Test Suite\n')
  let testsPassed = 0
  let testsFailed = 0

  // Test 1: Quest verification - conditions not met
  try {
    console.log('Test 1: Quest verification - conditions not met')
    clearLogs()
    
    const userId = 'test-user-1'
    const questId = 'quest-001'
    
    const result = await verifyQuestConditions(userId, questId)
    assert(result === false, 'Quest should not be verified when conditions not met')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 2: Quest verification - conditions met
  try {
    console.log('\nTest 2: Quest verification - conditions met')
    clearLogs()
    
    const userId = 'test-user-2'
    const questId = 'quest-001'
    
    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)
    
    const result = await verifyQuestConditions(userId, questId)
    assert(result === true, 'Quest should be verified when all conditions met')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 3: Successful quest completion with primary minting
  try {
    console.log('\nTest 3: Successful quest completion with primary minting')
    clearLogs()
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
    
    const userId = 'test-user-3'
    const questId = 'quest-001'
    
    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)
    
    const result = await handleQuestCompletion(userId, questId)
    
    assert(result.success === true, 'Quest completion should succeed')
    assert(result.tx !== undefined, 'Transaction should be present')
    assert(result.fallback !== true, 'Should use primary chain, not fallback')
    
    const mintLogs = getLogsByType('badge-minted')
    assertEquals(mintLogs.length, 1, 'Should have one badge-minted log')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 4: Quest completion with fallback minting
  try {
    console.log('\nTest 4: Quest completion with fallback minting')
    clearLogs()
    setPrimaryMintingStatus(false) // Primary fails
    setFallbackMintingStatus(true) // Fallback works
    
    const userId = 'test-user-4'
    const questId = 'quest-001'
    
    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)
    
    const result = await handleQuestCompletion(userId, questId)
    
    assert(result.success === true, 'Quest should succeed via fallback')
    assert(result.fallback === true, 'Should indicate fallback was used')
    assert(result.tx !== undefined, 'Transaction should be present')
    
    const fallbackLogs = getLogsByType('badge-fallback-minted')
    assertEquals(fallbackLogs.length, 1, 'Should have one fallback mint log')
    
    const failLogs = getLogsByType('badge-mint-failed')
    assertEquals(failLogs.length, 1, 'Should have one primary mint failure log')
    
    // Reset for next tests
    setPrimaryMintingStatus(true)
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 5: Quest completion failure - conditions not met
  try {
    console.log('\nTest 5: Quest completion failure - conditions not met')
    clearLogs()
    
    const userId = 'test-user-5'
    const questId = 'quest-002' // NFT Collector quest
    
    // Only complete partial conditions
    updateUserProgress(userId, questId, 'nft-minted', 1) // Needs 3
    
    const result = await handleQuestCompletion(userId, questId)
    
    assert(result.success === false, 'Quest should fail when conditions not met')
    assertEquals(result.reason, 'Quest conditions not met', 'Should have correct failure reason')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 6: Both primary and fallback fail
  try {
    console.log('\nTest 6: Both primary and fallback fail')
    clearLogs()
    setPrimaryMintingStatus(false)
    setFallbackMintingStatus(false)
    
    const userId = 'test-user-6'
    const questId = 'quest-001'
    
    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)
    
    const result = await handleQuestCompletion(userId, questId)
    
    assert(result.success === false, 'Quest should fail when both chains fail')
    assertEquals(
      result.reason, 
      'Both primary and fallback minting failed', 
      'Should have correct failure reason'
    )
    
    const errorLogs = getLogsByLevel('error')
    assert(errorLogs.length > 0, 'Should have error logs')
    
    // Reset
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 7: User progress tracking
  try {
    console.log('\nTest 7: User progress tracking')
    clearLogs()
    
    const userId = 'test-user-7'
    const questId = 'quest-002'
    
    updateUserProgress(userId, questId, 'nft-minted', 2)
    updateUserProgress(userId, questId, 'nft-minted', 1) // Increment again
    updateUserProgress(userId, questId, 'nft-traded', 1)
    
    const progress = getUserProgress(userId, questId)
    
    assertEquals(progress['nft-minted'], 3, 'NFT minted count should be 3')
    assertEquals(progress['nft-traded'], 1, 'NFT traded count should be 1')
    
    // Now verify quest should pass
    const verified = await verifyQuestConditions(userId, questId)
    assert(verified === true, 'Quest should be verified with correct progress')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 8: Quest status check
  try {
    console.log('\nTest 8: Quest status check')
    clearLogs()
    
    const userId = 'test-user-8'
    const questId = 'quest-001'
    
    // Check status before completing
    let status = await getQuestStatus(userId, questId)
    assert(
      status === 'Quest conditions not yet met', 
      'Status should show conditions not met'
    )
    
    // Complete conditions
    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)
    
    // Check status after completing
    status = await getQuestStatus(userId, questId)
    assert(
      status === 'Quest conditions met - ready to complete', 
      'Status should show ready to complete'
    )
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 9: Logging system
  try {
    console.log('\nTest 9: Logging system')
    clearLogs()
    
    const initialLogCount = getLogs().length
    assertEquals(initialLogCount, 0, 'Logs should be cleared')
    
    const userId = 'test-user-9'
    const questId = 'quest-001'
    
    updateUserProgress(userId, questId, 'login', 1)
    
    const logs = getLogs()
    assert(logs.length > 0, 'Logs should be created')
    
    const progressLogs = getLogsByType('user-progress-updated')
    assertEquals(progressLogs.length, 1, 'Should have one progress update log')
    
    assert(progressLogs[0].context.userId === userId, 'Log should have correct userId')
    assert(progressLogs[0].context.questId === questId, 'Log should have correct questId')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 10: Multiple quest completions
  try {
    console.log('\nTest 10: Multiple quest completions')
    clearLogs()
    setPrimaryMintingStatus(true)
    
    const userIds = ['user-10a', 'user-10b', 'user-10c']
    const questId = 'quest-001'
    const results = []
    
    for (const userId of userIds) {
      updateUserProgress(userId, questId, 'login', 1)
      updateUserProgress(userId, questId, 'profile-setup', 1)
      
      const result = await handleQuestCompletion(userId, questId)
      results.push(result)
    }
    
    const successfulCompletions = results.filter(r => r.success).length
    assertEquals(successfulCompletions, 3, 'All three completions should succeed')
    
    const mintLogs = getLogsByType('badge-minted')
    assertEquals(mintLogs.length, 3, 'Should have three mint logs')
    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 11: TTS Quest - verifyTTSQuest function
  try {
    console.log('\nTest 11: TTS Quest verification')
    clearLogs()

    // Test when TTS is disabled
    const disabledSettings = { ttsEnabled: false }
    const disabledResult = await verifyTTSQuest(disabledSettings)
    assert(disabledResult === false, 'Should return false when TTS is disabled')

    // Test when TTS is enabled
    const enabledSettings = { ttsEnabled: true }
    const enabledResult = await verifyTTSQuest(enabledSettings)
    assert(enabledResult === true, 'Should return true when TTS is enabled')

    // Verify logging
    const logs = getLogsByType('tts-quest-verification')
    assertEquals(logs.length, 2, 'Should have two verification logs')

    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 12: TTS Quest - handleTTSQuest with successful minting
  try {
    console.log('\nTest 12: TTS Quest with successful badge minting')
    clearLogs()
    setPrimaryMintingStatus(true)

    const userId = 'test-user-11'
    const settings = { ttsEnabled: true }

    await handleTTSQuest(userId, settings)

    const mintLogs = getLogsByType('tts-quest-completed')
    assertEquals(mintLogs.length, 1, 'Should have one completion log')

    const progressLogs = getLogsByType('user-progress-updated')
    assert(progressLogs.length > 0, 'Should have progress update logs')

    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 13: TTS Quest - handleTTSQuest with fallback minting
  try {
    console.log('\nTest 13: TTS Quest with fallback badge minting')
    clearLogs()
    setPrimaryMintingStatus(false)
    setFallbackMintingStatus(true)

    const userId = 'test-user-12'
    const settings = { ttsEnabled: true }

    await handleTTSQuest(userId, settings)

    const fallbackLogs = getLogsByType('tts-quest-completed-fallback')
    assertEquals(fallbackLogs.length, 1, 'Should have one fallback completion log')

    // Reset for next test
    setPrimaryMintingStatus(true)

    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 14: TTS Quest - updateTTSSetting integration
  try {
    console.log('\nTest 14: TTS Quest setting update integration')
    clearLogs()

    const userId = 'test-user-13'
    const initialSettings = { ttsEnabled: false }

    // Enable TTS (should trigger quest)
    await updateTTSSetting(userId, initialSettings, true)

    const settingsLogs = getLogsByType('settings-updated')
    assertEquals(settingsLogs.length, 1, 'Should have one settings update log')

    const completionLogs = getLogsByType('tts-quest-completed')
    assertEquals(completionLogs.length, 1, 'Should have completed the quest')

    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Test 15: TTS Quest - no quest trigger when already enabled
  try {
    console.log('\nTest 15: TTS Quest should not trigger when already enabled')
    clearLogs()

    const userId = 'test-user-14'
    const alreadyEnabledSettings = { ttsEnabled: true }

    // Keep TTS enabled (should NOT trigger quest)
    await updateTTSSetting(userId, alreadyEnabledSettings, true)

    const completionLogs = getLogsByType('tts-quest-completed')
    assertEquals(completionLogs.length, 0, 'Should NOT trigger quest when already enabled')

    testsPassed++
  } catch (error) {
    console.error(error)
    testsFailed++
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Summary')
  console.log('='.repeat(50))
  console.log(`✅ Tests Passed: ${testsPassed}`)
  console.log(`❌ Tests Failed: ${testsFailed}`)
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`)
  console.log('='.repeat(50) + '\n')

  if (testsFailed === 0) {
    console.log('🎉 All tests passed!')
    return 0
  } else {
    console.log('⚠️  Some tests failed')
    return 1
  }
}

// Run tests
runTests()
  .then((exitCode) => {
    process.exit(exitCode)
  })
  .catch((error) => {
    console.error('Fatal error running tests:', error)
    process.exit(1)
  })
