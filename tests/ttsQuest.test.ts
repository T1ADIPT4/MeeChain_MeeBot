/**
 * TTS Quest Badge Test Suite
 * Tests for TTS quest verification and badge minting with fallback support
 */

import { handleQuestCompletion, getQuestStatus } from '../src/QuestManager'
import {
  verifyTTSQuestConditions,
  updateTTSProgress,
  getTTSProgress,
  getTTSQuest,
} from '../src/verifiers/TTSQuestVerifier'
import {
  setPrimaryMintingStatus,
  setFallbackMintingStatus,
} from '../src/minting/badgeMinter'
import { clearLogs, getLogs, getLogsByType } from '../src/utils/logger'

describe('TTS Quest Badge System', () => {
  beforeEach(() => {
    // Clear logs before each test
    clearLogs()
    // Reset minting status
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
  })

  describe('TTS Quest Verification', () => {
    test('should fail verification when TTS not enabled', async () => {
      const userId = 'test-user-1'
      
      const result = await verifyTTSQuestConditions(userId)
      
      expect(result).toBe(false)
      
      const logs = getLogsByType('tts-quest-verification-failed')
      expect(logs.length).toBeGreaterThan(0)
    })

    test('should pass verification when TTS is enabled', async () => {
      const userId = 'test-user-2'
      
      // Simulate user enabling TTS
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      const result = await verifyTTSQuestConditions(userId)
      
      expect(result).toBe(true)
      
      const logs = getLogsByType('tts-quest-verification-success')
      expect(logs.length).toBe(1)
    })

    test('should track user progress correctly', () => {
      const userId = 'test-user-3'
      
      // Initially no progress
      let progress = getTTSProgress(userId)
      expect(progress['tts-enabled']).toBeUndefined()
      
      // Update progress
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      progress = getTTSProgress(userId)
      expect(progress['tts-enabled']).toBe(1)
      
      const logs = getLogsByType('tts-progress-updated')
      expect(logs.length).toBe(1)
    })
  })

  describe('TTS Quest Badge Minting', () => {
    test('should mint badge successfully when conditions are met', async () => {
      const userId = 'test-user-4'
      const questId = 'quest-tts-001'
      
      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      const result = await handleQuestCompletion(userId, questId)
      
      expect(result.success).toBe(true)
      expect(result.fallback).toBeUndefined()
      expect(result.tx).toBeDefined()
      expect(result.tx?.txHash).toBeDefined()
      
      const mintLogs = getLogsByType('badge-minted')
      expect(mintLogs.length).toBe(1)
    })

    test('should fail minting when conditions are not met', async () => {
      const userId = 'test-user-5'
      const questId = 'quest-tts-001'
      
      // Do not enable TTS
      
      const result = await handleQuestCompletion(userId, questId)
      
      expect(result.success).toBe(false)
      expect(result.reason).toContain('conditions not met')
      expect(result.tx).toBeUndefined()
    })

    test('should use fallback minting when primary fails', async () => {
      const userId = 'test-user-6'
      const questId = 'quest-tts-001'
      
      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      // Simulate primary minting failure
      setPrimaryMintingStatus(false)
      
      const result = await handleQuestCompletion(userId, questId)
      
      expect(result.success).toBe(true)
      expect(result.fallback).toBe(true)
      expect(result.tx).toBeDefined()
      
      const fallbackLogs = getLogsByType('badge-fallback-minted')
      expect(fallbackLogs.length).toBe(1)
      
      const failLogs = getLogsByType('badge-mint-failed')
      expect(failLogs.length).toBe(1)
    })

    test('should fail when both primary and fallback minting fail', async () => {
      const userId = 'test-user-7'
      const questId = 'quest-tts-001'
      
      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      // Simulate both minting failures
      setPrimaryMintingStatus(false)
      setFallbackMintingStatus(false)
      
      const result = await handleQuestCompletion(userId, questId)
      
      expect(result.success).toBe(false)
      expect(result.reason).toContain('fallback minting failed')
      
      const failLogs = getLogsByType('badge-mint-failed')
      expect(failLogs.length).toBeGreaterThan(0)
      
      const fallbackFailLogs = getLogsByType('badge-fallback-failed')
      expect(fallbackFailLogs.length).toBeGreaterThan(0)
    })
  })

  describe('TTS Quest Status', () => {
    test('should return correct status when conditions not met', async () => {
      const userId = 'test-user-8'
      const questId = 'quest-tts-001'
      
      const status = await getQuestStatus(userId, questId)
      
      expect(status).toContain('not yet met')
    })

    test('should return correct status when conditions are met', async () => {
      const userId = 'test-user-9'
      const questId = 'quest-tts-001'
      
      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      const status = await getQuestStatus(userId, questId)
      
      expect(status).toContain('ready to complete')
    })
  })

  describe('TTS Quest Definition', () => {
    test('should return correct quest structure', () => {
      const quest = getTTSQuest()
      
      expect(quest.id).toBe('quest-tts-001')
      expect(quest.name).toBe('Enable TTS')
      expect(quest.conditions).toHaveLength(1)
      expect(quest.conditions[0].type).toBe('tts-enabled')
      expect(quest.conditions[0].required).toBe(1)
    })
  })

  describe('Logging System Integration', () => {
    test('should log all TTS quest events correctly', async () => {
      const userId = 'test-user-10'
      const questId = 'quest-tts-001'
      
      clearLogs()
      
      // Enable TTS and complete quest
      updateTTSProgress(userId, 'tts-enabled', 1)
      await handleQuestCompletion(userId, questId)
      
      const allLogs = getLogs()
      expect(allLogs.length).toBeGreaterThan(0)
      
      // Check for specific log types
      const progressLogs = getLogsByType('tts-progress-updated')
      const verificationLogs = getLogsByType('tts-quest-verification-start')
      const mintLogs = getLogsByType('badge-minted')
      
      expect(progressLogs.length).toBeGreaterThan(0)
      expect(verificationLogs.length).toBeGreaterThan(0)
      expect(mintLogs.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    test('should handle multiple TTS enable attempts', () => {
      const userId = 'test-user-11'
      
      updateTTSProgress(userId, 'tts-enabled', 1)
      updateTTSProgress(userId, 'tts-enabled', 1)
      updateTTSProgress(userId, 'tts-enabled', 1)
      
      const progress = getTTSProgress(userId)
      expect(progress['tts-enabled']).toBe(3)
    })

    test('should handle quest completion with invalid quest ID', async () => {
      const userId = 'test-user-12'
      const invalidQuestId = 'invalid-quest-id'
      
      const result = await handleQuestCompletion(userId, invalidQuestId)
      
      expect(result.success).toBe(false)
    })

    test('should return empty progress for new user', () => {
      const userId = 'new-user'
      
      const progress = getTTSProgress(userId)
      expect(progress).toEqual({})
    })
  })
})
