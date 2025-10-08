/**
 * Reward Tracker Test Suite
 * Tests for reward tracking functionality
 */

import {
  trackReward,
  getAllRewards,
  getRewardsByUser,
  getRewardsByQuest,
  getFallbackRewards,
  getBadgeCount,
  clearRewards,
} from '../tracker/RewardTracker'

describe('Reward Tracker', () => {
  beforeEach(() => {
    clearRewards()
  })

  describe('trackReward', () => {
    test('should track a reward', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe('user1')
      expect(rewards[0].questId).toBe('quest-001')
    })

    test('should track multiple rewards', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(2)
    })
  })

  describe('getRewardsByUser', () => {
    test('should filter rewards by user', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user1',
        questId: 'quest-003',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const user1Rewards = getRewardsByUser('user1')
      expect(user1Rewards).toHaveLength(2)
      expect(user1Rewards.every((r) => r.userId === 'user1')).toBe(true)
    })

    test('should return empty array for user with no rewards', () => {
      const rewards = getRewardsByUser('nonexistent-user')
      expect(rewards).toHaveLength(0)
    })
  })

  describe('getRewardsByQuest', () => {
    test('should filter rewards by quest', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-001',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user3',
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
    test('should filter rewards that used fallback', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      trackReward({
        userId: 'user3',
        questId: 'quest-003',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: true,
      })

      const fallbackRewards = getFallbackRewards()
      expect(fallbackRewards).toHaveLength(2)
      expect(fallbackRewards.every((r) => r.fallbackUsed === true)).toBe(true)
    })

    test('should return empty array when no fallback rewards', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      const fallbackRewards = getFallbackRewards()
      expect(fallbackRewards).toHaveLength(0)
    })
  })

  describe('getBadgeCount', () => {
    test('should count badges for a user', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-003',
        badgeId: 'badge-003',
        timestamp: Date.now(),
        fallbackUsed: false,
      })

      expect(getBadgeCount('user1')).toBe(2)
      expect(getBadgeCount('user2')).toBe(1)
      expect(getBadgeCount('nonexistent-user')).toBe(0)
    })
  })

  describe('clearRewards', () => {
    test('should clear all rewards', () => {
      trackReward({
        userId: 'user1',
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
