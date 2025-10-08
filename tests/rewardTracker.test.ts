/**
 * Reward Tracker Test Suite
 * Tests for reward tracking and leaderboard functionality
 */

import {
  trackReward,
  trackRewardFromTransaction,
  getAllRewards,
  getRewardsByUser,
  getRewardsByQuest,
  getFallbackRewards,
  getBadgeCountByUser,
  getTopUsers,
  getRewardStats,
  clearRewards,
} from '../tracker/RewardTracker'
import { BadgeTransaction } from '../src/minting/badgeMinter'

describe('Reward Tracker', () => {
  beforeEach(() => {
    clearRewards()
  })

  describe('trackReward', () => {
    test('should track a reward correctly', () => {
      const reward = {
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      }

      trackReward(reward)

      const allRewards = getAllRewards()
      expect(allRewards).toHaveLength(1)
      expect(allRewards[0]).toEqual(reward)
    })

    test('should track multiple rewards', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const allRewards = getAllRewards()
      expect(allRewards).toHaveLength(2)
    })
  })

  describe('trackRewardFromTransaction', () => {
    test('should track reward from badge transaction', () => {
      const tx: BadgeTransaction = {
        txHash: '0x123',
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: new Date(),
        chain: 'primary',
      }

      trackRewardFromTransaction(tx)

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe('user-1')
      expect(rewards[0].fallbackUsed).toBe(false)
      expect(rewards[0].txHash).toBe('0x123')
    })

    test('should detect fallback usage from transaction chain', () => {
      const tx: BadgeTransaction = {
        txHash: '0xfb456',
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: new Date(),
        chain: 'fallback',
      }

      trackRewardFromTransaction(tx)

      const rewards = getAllRewards()
      expect(rewards[0].fallbackUsed).toBe(true)
      expect(rewards[0].chain).toBe('fallback')
    })
  })

  describe('getRewardsByUser', () => {
    test('should filter rewards by user ID', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-1',
        questId: 'quest-003',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const user1Rewards = getRewardsByUser('user-1')
      expect(user1Rewards).toHaveLength(2)
      expect(user1Rewards.every((r) => r.userId === 'user-1')).toBe(true)

      const user2Rewards = getRewardsByUser('user-2')
      expect(user2Rewards).toHaveLength(1)
    })
  })

  describe('getRewardsByQuest', () => {
    test('should filter rewards by quest ID', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-2',
        questId: 'quest-001',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-3',
        questId: 'quest-002',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const quest001Rewards = getRewardsByQuest('quest-001')
      expect(quest001Rewards).toHaveLength(2)
      expect(quest001Rewards.every((r) => r.questId === 'quest-001')).toBe(true)
    })
  })

  describe('getFallbackRewards', () => {
    test('should filter fallback rewards only', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true,
      })
      trackReward({
        userId: 'user-3',
        questId: 'quest-003',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const fallbackRewards = getFallbackRewards()
      expect(fallbackRewards).toHaveLength(2)
      expect(fallbackRewards.every((r) => r.fallbackUsed === true)).toBe(true)
    })
  })

  describe('getBadgeCountByUser', () => {
    test('should count badges per user', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-2',
        questId: 'quest-001',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const badgeCounts = getBadgeCountByUser()
      expect(badgeCounts['user-1']).toBe(2)
      expect(badgeCounts['user-2']).toBe(1)
    })
  })

  describe('getTopUsers', () => {
    test('should return users sorted by badge count', () => {
      // Create rewards for multiple users
      for (let i = 0; i < 5; i++) {
        trackReward({
          userId: 'user-1',
          questId: `quest-${i}`,
          badgeId: `badge-${i}`,
          timestamp: Date.now(),
          fallbackUsed: false,
        })
      }
      for (let i = 0; i < 3; i++) {
        trackReward({
          userId: 'user-2',
          questId: `quest-${i}`,
          badgeId: `badge-${i}`,
          timestamp: Date.now(),
          fallbackUsed: false,
        })
      }
      for (let i = 0; i < 7; i++) {
        trackReward({
          userId: 'user-3',
          questId: `quest-${i}`,
          badgeId: `badge-${i}`,
          timestamp: Date.now(),
          fallbackUsed: false,
        })
      }

      const topUsers = getTopUsers(10)
      expect(topUsers).toHaveLength(3)
      expect(topUsers[0][0]).toBe('user-3')
      expect(topUsers[0][1]).toBe(7)
      expect(topUsers[1][0]).toBe('user-1')
      expect(topUsers[1][1]).toBe(5)
      expect(topUsers[2][0]).toBe('user-2')
      expect(topUsers[2][1]).toBe(3)
    })

    test('should limit results by limit parameter', () => {
      for (let i = 1; i <= 15; i++) {
        trackReward({
          userId: `user-${i}`,
          questId: 'quest-001',
          badgeId: `badge-${i}`,
          timestamp: Date.now(),
          fallbackUsed: false,
        })
      }

      const topUsers = getTopUsers(5)
      expect(topUsers).toHaveLength(5)
    })
  })

  describe('getRewardStats', () => {
    test('should return correct statistics', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true,
      })
      trackReward({
        userId: 'user-1',
        questId: 'quest-003',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: false,
      })
      trackReward({
        userId: 'user-3',
        questId: 'quest-001',
        badgeId: 'badge-004',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const stats = getRewardStats()
      expect(stats.totalRewards).toBe(4)
      expect(stats.uniqueUsers).toBe(3)
      expect(stats.uniqueQuests).toBe(3)
      expect(stats.fallbackUsageRate).toBe(0.5) // 2 out of 4
    })

    test('should handle zero rewards', () => {
      const stats = getRewardStats()
      expect(stats.totalRewards).toBe(0)
      expect(stats.uniqueUsers).toBe(0)
      expect(stats.uniqueQuests).toBe(0)
      expect(stats.fallbackUsageRate).toBe(0)
    })
  })

  describe('clearRewards', () => {
    test('should clear all rewards', () => {
      trackReward({
        userId: 'user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      expect(getAllRewards()).toHaveLength(1)

      clearRewards()

      expect(getAllRewards()).toHaveLength(0)
    })
  })
})
