/**
 * Integration Test: Quest Completion with Reward Tracking
 * Tests that rewards are tracked when quests are completed
 */

import { handleQuestCompletion } from '../src/QuestManager'
import { updateUserProgress } from '../src/verifiers/questVerifier'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier'
import {
  getAllRewards,
  getRewardsByUser,
  getFallbackRewards,
  getBadgeCount,
  clearRewards,
} from '../tracker/RewardTracker'
import {
  setPrimaryMintingStatus,
  setFallbackMintingStatus,
} from '../src/minting/badgeMinter'
import { clearLogs } from '../src/utils/logger'

describe('Quest Completion with Reward Tracking Integration', () => {
  beforeEach(() => {
    clearRewards()
    clearLogs()
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
  })

  describe('Regular Quest Completion', () => {
    test('should track reward when quest is completed successfully', async () => {
      const userId = 'user1'
      const questId = 'quest-001'

      // Set up quest conditions
      updateUserProgress(userId, questId, 'login', 1)
      updateUserProgress(userId, questId, 'profile-setup', 1)

      // Complete quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBeUndefined()

      // Verify reward was tracked
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
      expect(rewards[0].fallbackUsed).toBe(false)
    })

    test('should track fallback reward when primary minting fails', async () => {
      const userId = 'user2'
      const questId = 'quest-001'

      // Set up quest conditions
      updateUserProgress(userId, questId, 'login', 1)
      updateUserProgress(userId, questId, 'profile-setup', 1)

      // Simulate primary minting failure
      setPrimaryMintingStatus(false)

      // Complete quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBe(true)

      // Verify fallback reward was tracked
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
      expect(rewards[0].fallbackUsed).toBe(true)

      const fallbackRewards = getFallbackRewards()
      expect(fallbackRewards).toHaveLength(1)
    })

    test('should not track reward when quest fails', async () => {
      const userId = 'user3'
      const questId = 'quest-001'

      // Do not set up quest conditions
      // Complete quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(false)

      // Verify no reward was tracked
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(0)
    })
  })

  describe('TTS Quest Completion', () => {
    test('should track reward when TTS quest is completed', async () => {
      const userId = 'user4'
      const questId = 'quest-tts-001'

      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)

      // Complete quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)

      // Verify reward was tracked
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
    })
  })

  describe('Multiple Quests', () => {
    test('should track multiple rewards for the same user', async () => {
      const userId = 'user5'

      // Complete first quest
      updateUserProgress(userId, 'quest-001', 'login', 1)
      updateUserProgress(userId, 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion(userId, 'quest-001')

      // Complete second quest
      updateUserProgress(userId, 'quest-002', 'nft-minted', 3)
      updateUserProgress(userId, 'quest-002', 'nft-traded', 1)
      await handleQuestCompletion(userId, 'quest-002')

      // Verify both rewards were tracked
      const rewards = getRewardsByUser(userId)
      expect(rewards).toHaveLength(2)
      expect(getBadgeCount(userId)).toBe(2)
    })

    test('should track rewards for multiple users', async () => {
      // User 1 completes quest-001
      updateUserProgress('user1', 'quest-001', 'login', 1)
      updateUserProgress('user1', 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion('user1', 'quest-001')

      // User 2 completes quest-001
      updateUserProgress('user2', 'quest-001', 'login', 1)
      updateUserProgress('user2', 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion('user2', 'quest-001')

      // Verify rewards for both users
      const allRewards = getAllRewards()
      expect(allRewards).toHaveLength(2)

      expect(getBadgeCount('user1')).toBe(1)
      expect(getBadgeCount('user2')).toBe(1)
    })
  })

  describe('Fallback Statistics', () => {
    test('should accurately track fallback usage rate', async () => {
      // User 1: successful primary minting
      updateUserProgress('user1', 'quest-001', 'login', 1)
      updateUserProgress('user1', 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion('user1', 'quest-001')

      // User 2: fallback minting
      setPrimaryMintingStatus(false)
      updateUserProgress('user2', 'quest-001', 'login', 1)
      updateUserProgress('user2', 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion('user2', 'quest-001')

      // User 3: successful primary minting
      setPrimaryMintingStatus(true)
      updateUserProgress('user3', 'quest-001', 'login', 1)
      updateUserProgress('user3', 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion('user3', 'quest-001')

      const allRewards = getAllRewards()
      const fallbackRewards = getFallbackRewards()

      expect(allRewards).toHaveLength(3)
      expect(fallbackRewards).toHaveLength(1)

      const fallbackRate = (fallbackRewards.length / allRewards.length) * 100
      expect(fallbackRate).toBeCloseTo(33.33, 1)
    })
  })
})
