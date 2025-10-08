/**
 * Reward Tracker Test Suite
 * Tests for reward tracking functionality and integration with quest system
 */

import {
  trackReward,
  getUserRewards,
  getAllRewards,
  getRewardsByQuest,
  getFallbackRewardsCount,
  getPrimaryRewardsCount,
  clearRewards,
  getUserRewardCount
} from '../tracker/RewardTracker'
import {
  getRewardStatistics,
  exportRewardsAsJSON,
  exportRewardsAsCSV,
  getUserRewardSummary,
  generateTelemetryReport
} from '../tracker/RewardLog'
import { handleQuestCompletion } from '../src/QuestManager'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier'
import {
  setPrimaryMintingStatus,
  setFallbackMintingStatus
} from '../src/minting/badgeMinter'
import { clearLogs } from '../src/utils/logger'

describe('Reward Tracker System', () => {
  beforeEach(() => {
    clearRewards()
    clearLogs()
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
  })

  describe('Basic Reward Tracking', () => {
    test('should track a reward successfully', () => {
      const reward = {
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
        txHash: '0x123abc',
        chain: 'primary' as const
      }

      trackReward(reward)

      const userRewards = getUserRewards('user-1')
      expect(userRewards.length).toBe(1)
      expect(userRewards[0]).toMatchObject(reward)
    })

    test('should track multiple rewards for the same user', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      const userRewards = getUserRewards('user-1')
      expect(userRewards.length).toBe(2)
    })

    test('should separate rewards by user', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-2',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      expect(getUserRewards('user-1').length).toBe(1)
      expect(getUserRewards('user-2').length).toBe(1)
      expect(getAllRewards().length).toBe(2)
    })

    test('should return empty array for user with no rewards', () => {
      const rewards = getUserRewards('non-existent-user')
      expect(rewards).toEqual([])
    })
  })

  describe('Fallback Tracking', () => {
    test('should correctly track fallback vs primary rewards', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      expect(getPrimaryRewardsCount()).toBe(1)
      expect(getFallbackRewardsCount()).toBe(1)
    })

    test('should count fallback rewards across all users', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      trackReward({
        userId: 'user-2',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      trackReward({
        userId: 'user-3',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      expect(getFallbackRewardsCount()).toBe(2)
      expect(getPrimaryRewardsCount()).toBe(1)
    })
  })

  describe('Quest Filtering', () => {
    test('should filter rewards by quest ID', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-tts-001',
        badgeId: 'badge-tts',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-2',
        questId: 'quest-tts-001',
        badgeId: 'badge-tts',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-3',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const ttsRewards = getRewardsByQuest('quest-tts-001')
      expect(ttsRewards.length).toBe(2)
      expect(ttsRewards.every(r => r.questId === 'quest-tts-001')).toBe(true)
    })
  })

  describe('Integration with Quest Manager', () => {
    test('should automatically track reward when quest is completed successfully', async () => {
      const userId = 'integration-user-1'
      const questId = 'quest-tts-001'

      // Enable TTS to meet quest conditions
      updateTTSProgress(userId, 'tts-enabled', 1)

      // Complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBeUndefined()

      // Check that reward was tracked
      const rewards = getUserRewards(userId)
      expect(rewards.length).toBe(1)
      expect(rewards[0].questId).toBe(questId)
      expect(rewards[0].fallbackUsed).toBe(false)
      expect(rewards[0].txHash).toBeDefined()
    })

    test('should track fallback reward when primary minting fails', async () => {
      const userId = 'integration-user-2'
      const questId = 'quest-tts-001'

      // Enable TTS
      updateTTSProgress(userId, 'tts-enabled', 1)

      // Simulate primary minting failure
      setPrimaryMintingStatus(false)

      // Complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBe(true)

      // Check that fallback reward was tracked
      const rewards = getUserRewards(userId)
      expect(rewards.length).toBe(1)
      expect(rewards[0].fallbackUsed).toBe(true)
      expect(rewards[0].chain).toBe('fallback')
    })

    test('should not track reward when quest completion fails', async () => {
      const userId = 'integration-user-3'
      const questId = 'quest-tts-001'

      // Do NOT enable TTS - quest will fail

      // Try to complete the quest
      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(false)

      // Check that no reward was tracked
      const rewards = getUserRewards(userId)
      expect(rewards.length).toBe(0)
    })
  })

  describe('Reward Statistics', () => {
    test('should calculate correct statistics', () => {
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

      trackReward({
        userId: 'user-1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      const stats = getRewardStatistics()

      expect(stats.totalRewards).toBe(3)
      expect(stats.primaryRewards).toBe(1)
      expect(stats.fallbackRewards).toBe(2)
      expect(stats.fallbackPercentage).toBeCloseTo(66.67, 1)
      expect(stats.uniqueUsers).toBe(2)
      expect(stats.uniqueQuests).toBe(2)
    })

    test('should return zero percentage for no rewards', () => {
      const stats = getRewardStatistics()
      expect(stats.fallbackPercentage).toBe(0)
      expect(stats.totalRewards).toBe(0)
    })
  })

  describe('User Reward Summary', () => {
    test('should generate correct user summary', () => {
      const userId = 'summary-user'

      trackReward({
        userId,
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: 1000,
        fallbackUsed: false
      })

      trackReward({
        userId,
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: 2000,
        fallbackUsed: true
      })

      const summary = getUserRewardSummary(userId)

      expect(summary.totalBadges).toBe(2)
      expect(summary.primaryBadges).toBe(1)
      expect(summary.fallbackBadges).toBe(1)
      expect(summary.questsCompleted).toEqual(['quest-001', 'quest-002'])
      expect(summary.firstReward?.timestamp).toBe(1000)
      expect(summary.latestReward?.timestamp).toBe(2000)
    })

    test('should handle user with no rewards', () => {
      const summary = getUserRewardSummary('no-rewards-user')
      expect(summary.totalBadges).toBe(0)
      expect(summary.firstReward).toBeUndefined()
      expect(summary.latestReward).toBeUndefined()
    })
  })

  describe('Export Functionality', () => {
    test('should export rewards as JSON', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const json = exportRewardsAsJSON()
      expect(json).toBeTruthy()
      
      const parsed = JSON.parse(json)
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed.length).toBe(1)
    })

    test('should export rewards as CSV', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const csv = exportRewardsAsCSV()
      expect(csv).toContain('userId,questId,badgeId')
      expect(csv).toContain('user-1')
      expect(csv).toContain('quest-001')
    })

    test('should filter exports by user', () => {
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

      const json = exportRewardsAsJSON('user-1')
      const parsed = JSON.parse(json)
      expect(parsed.length).toBe(1)
      expect(parsed[0].userId).toBe('user-1')
    })
  })

  describe('Telemetry Report', () => {
    test('should generate telemetry with healthy status', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const report = generateTelemetryReport()
      expect(report.systemHealth.healthStatus).toBe('healthy')
      expect(report.systemHealth.fallbackRate).toBe(0)
    })

    test('should generate telemetry with warning status', () => {
      // 30% fallback rate (3 out of 10)
      for (let i = 0; i < 7; i++) {
        trackReward({
          userId: `user-${i}`,
          questId: 'quest-001',
          badgeId: 'badge-001',
          timestamp: Date.now(),
          fallbackUsed: false
        })
      }

      for (let i = 0; i < 3; i++) {
        trackReward({
          userId: `user-fallback-${i}`,
          questId: 'quest-001',
          badgeId: 'badge-001',
          timestamp: Date.now(),
          fallbackUsed: true
        })
      }

      const report = generateTelemetryReport()
      expect(report.systemHealth.healthStatus).toBe('warning')
      expect(report.systemHealth.fallbackRate).toBe(30)
    })

    test('should generate telemetry with critical status', () => {
      // 60% fallback rate
      for (let i = 0; i < 4; i++) {
        trackReward({
          userId: `user-${i}`,
          questId: 'quest-001',
          badgeId: 'badge-001',
          timestamp: Date.now(),
          fallbackUsed: false
        })
      }

      for (let i = 0; i < 6; i++) {
        trackReward({
          userId: `user-fallback-${i}`,
          questId: 'quest-001',
          badgeId: 'badge-001',
          timestamp: Date.now(),
          fallbackUsed: true
        })
      }

      const report = generateTelemetryReport()
      expect(report.systemHealth.healthStatus).toBe('critical')
      expect(report.systemHealth.fallbackRate).toBe(60)
    })
  })

  describe('getUserRewardCount', () => {
    test('should return correct count for user', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user-1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      expect(getUserRewardCount('user-1')).toBe(2)
      expect(getUserRewardCount('user-2')).toBe(0)
    })
  })

  describe('Clear Rewards', () => {
    test('should clear all rewards', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      expect(getAllRewards().length).toBe(1)

      clearRewards()

      expect(getAllRewards().length).toBe(0)
      expect(getUserRewards('user-1').length).toBe(0)
    })
  })
})
