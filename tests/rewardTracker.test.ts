// tests/rewardTracker.test.ts

/**
 * Tests for Reward Tracker system
 * Validates tracking of badge rewards with fallback awareness
 */

import { trackReward, getUserRewards, getAllRewards, clearRewards } from '../tracker/RewardTracker'
import { handleQuestCompletion } from '../src/QuestManager'
import { updateUserProgress } from '../src/verifiers/questVerifier'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier'
import { setPrimaryMintingStatus, setFallbackMintingStatus } from '../src/minting/badgeMinter'
import { clearLogs } from '../src/utils/logger'

describe('Reward Tracker System', () => {
  beforeEach(() => {
    clearRewards()
    clearLogs()
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
  })

  describe('Basic Reward Tracking', () => {
    test('should track a reward entry', () => {
      const entry = {
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      }

      trackReward(entry)
      const rewards = getUserRewards('user-1')

      expect(rewards).toHaveLength(1)
      expect(rewards[0]).toEqual(entry)
    })

    test('should track multiple rewards for a user', () => {
      const entry1 = {
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      }

      const entry2 = {
        userId: 'user-1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true
      }

      trackReward(entry1)
      trackReward(entry2)

      const rewards = getUserRewards('user-1')
      expect(rewards).toHaveLength(2)
    })

    test('should filter rewards by user', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const user1Rewards = getUserRewards('user-1')
      const user2Rewards = getUserRewards('user-2')

      expect(user1Rewards).toHaveLength(1)
      expect(user2Rewards).toHaveLength(1)
      expect(user1Rewards[0].userId).toBe('user-1')
      expect(user2Rewards[0].userId).toBe('user-2')
    })

    test('should return empty array for user with no rewards', () => {
      const rewards = getUserRewards('non-existent-user')
      expect(rewards).toHaveLength(0)
      expect(rewards).toEqual([])
    })
  })

  describe('Integration with Quest Completion', () => {
    test('should track reward after successful quest completion', async () => {
      const userId = 'user-integration-1'
      const questId = 'quest-001'

      // Set up quest conditions
      updateUserProgress(userId, questId, 'login', 1)
      updateUserProgress(userId, questId, 'profile-setup', 1)

      // Complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBeUndefined()

      // Check that reward was tracked
      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
      expect(rewards[0].fallbackUsed).toBe(false)
      expect(rewards[0].badgeId).toContain('badge-')
    })

    test('should track reward with fallback flag when primary minting fails', async () => {
      const userId = 'user-integration-2'
      const questId = 'quest-001'

      // Set up quest conditions
      updateUserProgress(userId, questId, 'login', 1)
      updateUserProgress(userId, questId, 'profile-setup', 1)

      // Disable primary minting to force fallback
      setPrimaryMintingStatus(false)

      // Complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBe(true)

      // Check that reward was tracked with fallback flag
      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
      expect(rewards[0].fallbackUsed).toBe(true)
      expect(rewards[0].badgeId).toContain('fallback')
    })

    test('should track TTS quest reward', async () => {
      const userId = 'user-tts-1'
      const questId = 'quest-tts-001'

      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)

      // Complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)

      // Check that reward was tracked
      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
    })

    test('should not track reward when quest fails', async () => {
      const userId = 'user-fail-1'
      const questId = 'quest-001'

      // Don't set up quest conditions (quest will fail)

      // Try to complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(false)

      // Check that no reward was tracked
      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(0)
    })
  })

  describe('Fallback Status Tracking', () => {
    test('should distinguish between normal and fallback rewards', async () => {
      const userId = 'user-fallback-1'
      
      // First quest with normal minting
      updateUserProgress(userId, 'quest-001', 'login', 1)
      updateUserProgress(userId, 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion(userId, 'quest-001')

      // Second quest with fallback minting
      setPrimaryMintingStatus(false)
      updateUserProgress(userId, 'quest-002', 'nft-minted', 3)
      updateUserProgress(userId, 'quest-002', 'nft-traded', 1)
      await handleQuestCompletion(userId, 'quest-002')

      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(2)

      const normalReward = rewards.find(r => r.questId === 'quest-001')
      const fallbackReward = rewards.find(r => r.questId === 'quest-002')

      expect(normalReward?.fallbackUsed).toBe(false)
      expect(fallbackReward?.fallbackUsed).toBe(true)
    })
  })

  describe('Timestamp Tracking', () => {
    test('should track timestamp for each reward', () => {
      const beforeTime = Date.now()
      
      trackReward({
        userId: 'user-time-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const afterTime = Date.now()
      const rewards = getUserRewards('user-time-1')

      expect(rewards[0].timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(rewards[0].timestamp).toBeLessThanOrEqual(afterTime)
    })

    test('should track rewards in chronological order', async () => {
      const userId = 'user-time-2'

      // Complete multiple quests
      updateUserProgress(userId, 'quest-001', 'login', 1)
      updateUserProgress(userId, 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion(userId, 'quest-001')

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 10))

      updateUserProgress(userId, 'quest-002', 'nft-minted', 3)
      updateUserProgress(userId, 'quest-002', 'nft-traded', 1)
      await handleQuestCompletion(userId, 'quest-002')

      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(2)
      expect(rewards[0].timestamp).toBeLessThan(rewards[1].timestamp)
    })
  })

  describe('Utility Functions', () => {
    test('getAllRewards should return all tracked rewards', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      const allRewards = getAllRewards()
      expect(allRewards).toHaveLength(2)
    })

    test('clearRewards should remove all tracked rewards', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      expect(getAllRewards()).toHaveLength(1)

      clearRewards()

      expect(getAllRewards()).toHaveLength(0)
      expect(getUserRewards('user-1')).toHaveLength(0)
    })
  })
})
