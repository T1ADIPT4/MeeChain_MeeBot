/**
 * Reward Tracking and Admin Test Suite
 * Tests for reward tracking, leaderboard, and admin functionality
 */

import { handleQuestCompletion } from '../src/QuestManager'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier'
import { updateUserProgress } from '../src/verifiers/questVerifier'
import {
  setPrimaryMintingStatus,
  setFallbackMintingStatus,
} from '../src/minting/badgeMinter'
import {
  trackReward,
  getAllRewards,
  getUserRewards,
  getQuestRewards,
  getRewardCountByUser,
  clearRewards,
} from '../tracker/RewardTracker'
import { exportRewardLog, exportRewardStats } from '../tracker/RewardExporter'
import { triggerManualBadge } from '../admin/AdminActions'
import { clearLogs } from '../src/utils/logger'

describe('Reward Tracking System', () => {
  beforeEach(() => {
    // Clear rewards and logs before each test
    clearRewards()
    clearLogs()
    // Reset minting status
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
  })

  describe('Reward Tracker', () => {
    test('should track a reward correctly', () => {
      const reward = {
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      }

      trackReward(reward)

      const allRewards = getAllRewards()
      expect(allRewards).toHaveLength(1)
      expect(allRewards[0]).toMatchObject(reward)
    })

    test('should get rewards for a specific user', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user2',
        questId: 'quest-1',
        badgeId: 'badge-2',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user1',
        questId: 'quest-2',
        badgeId: 'badge-3',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const user1Rewards = getUserRewards('user1')
      expect(user1Rewards).toHaveLength(2)
      expect(user1Rewards.every((r) => r.userId === 'user1')).toBe(true)
    })

    test('should get rewards for a specific quest', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user2',
        questId: 'quest-1',
        badgeId: 'badge-2',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user3',
        questId: 'quest-2',
        badgeId: 'badge-3',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const quest1Rewards = getQuestRewards('quest-1')
      expect(quest1Rewards).toHaveLength(2)
      expect(quest1Rewards.every((r) => r.questId === 'quest-1')).toBe(true)
    })

    test('should count rewards by user correctly', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user1',
        questId: 'quest-2',
        badgeId: 'badge-2',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user2',
        questId: 'quest-1',
        badgeId: 'badge-3',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const counts = getRewardCountByUser()
      expect(counts['user1']).toBe(2)
      expect(counts['user2']).toBe(1)
    })
  })

  describe('Reward Exporter', () => {
    test('should export reward log successfully', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user2',
        questId: 'quest-2',
        badgeId: 'badge-2',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const result = exportRewardLog('./logs/test.json')

      expect(result.success).toBe(true)
      expect(result.count).toBe(2)
      expect(result.records).toHaveLength(2)
    })

    test('should export reward statistics correctly', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user2',
        questId: 'quest-1',
        badgeId: 'badge-2',
        timestamp: Date.now(),
        fallbackUsed: true,
      })
      trackReward({
        userId: 'user1',
        questId: 'quest-2',
        badgeId: 'badge-3',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const stats = exportRewardStats()

      expect(stats.totalRewards).toBe(3)
      expect(stats.totalUsers).toBe(2)
      expect(stats.fallbackRate).toBeCloseTo(1 / 3)
      expect(stats.rewardsByQuest['quest-1']).toBe(2)
      expect(stats.rewardsByQuest['quest-2']).toBe(1)
    })
  })

  describe('Admin Actions', () => {
    test('should grant manual badge successfully', () => {
      triggerManualBadge('admin-user', 'special-quest')

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe('admin-user')
      expect(rewards[0].questId).toBe('special-quest')
      expect(rewards[0].fallbackUsed).toBe(false)
      expect(rewards[0].badgeId).toContain('manual-special-quest')
    })

    test('should track multiple manual badges', () => {
      triggerManualBadge('user1', 'quest-1')
      triggerManualBadge('user2', 'quest-2')
      triggerManualBadge('user1', 'quest-3')

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(3)

      const user1Rewards = getUserRewards('user1')
      expect(user1Rewards).toHaveLength(2)
    })
  })

  describe('Integration with Quest System', () => {
    test('should automatically track rewards when quest is completed', async () => {
      const userId = 'integration-user-1'

      // Complete a TTS quest
      updateTTSProgress(userId, 'tts-enabled', 1)
      const result = await handleQuestCompletion(userId, 'quest-tts-001')

      expect(result.success).toBe(true)

      // Check that reward was tracked
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe('quest-tts-001')
      expect(rewards[0].fallbackUsed).toBe(false)
    })

    test('should track fallback rewards correctly', async () => {
      const userId = 'integration-user-2'

      // Setup for primary minting to fail
      setPrimaryMintingStatus(false)
      setFallbackMintingStatus(true)

      // Complete a TTS quest
      updateTTSProgress(userId, 'tts-enabled', 1)
      const result = await handleQuestCompletion(userId, 'quest-tts-001')

      expect(result.success).toBe(true)
      expect(result.fallback).toBe(true)

      // Check that reward was tracked with fallback flag
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].fallbackUsed).toBe(true)
    })

    test('should handle multiple quest completions', async () => {
      const userId = 'integration-user-3'

      // Complete TTS quest
      updateTTSProgress(userId, 'tts-enabled', 1)
      await handleQuestCompletion(userId, 'quest-tts-001')

      // Complete a regular quest (quest-001)
      updateUserProgress(userId, 'quest-001', 'login', 1)
      updateUserProgress(userId, 'quest-001', 'profile-setup', 1)
      await handleQuestCompletion(userId, 'quest-001')

      // Check that both rewards were tracked
      const rewards = getUserRewards(userId)
      expect(rewards).toHaveLength(2)
    })
  })

  describe('Leaderboard Data', () => {
    test('should generate correct leaderboard data', () => {
      // Simulate multiple users completing quests
      trackReward({
        userId: 'user1',
        questId: 'quest-1',
        badgeId: 'badge-1',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user1',
        questId: 'quest-2',
        badgeId: 'badge-2',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user1',
        questId: 'quest-3',
        badgeId: 'badge-3',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user2',
        questId: 'quest-1',
        badgeId: 'badge-4',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user3',
        questId: 'quest-1',
        badgeId: 'badge-5',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user3',
        questId: 'quest-2',
        badgeId: 'badge-6',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const leaderboard = getRewardCountByUser()
      const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1])

      expect(sorted[0][0]).toBe('user1') // user1 has 3 badges
      expect(sorted[0][1]).toBe(3)
      expect(sorted[1][1]).toBe(2) // user3 has 2 badges
      expect(sorted[2][1]).toBe(1) // user2 has 1 badge
    })
  })
})
