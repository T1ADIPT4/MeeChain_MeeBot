/**
 * Admin Actions Test Suite
 * Tests for admin badge management functionality
 */

import {
  triggerManualBadge,
  revokeBadge,
  resetQuestProgress,
} from '../admin/AdminActions'
import {
  getAllRewards,
  getRewardsByUser,
  clearRewards,
} from '../tracker/RewardTracker'
import { clearLogs, getLogsByType } from '../src/utils/logger'

describe('Admin Actions', () => {
  beforeEach(() => {
    clearRewards()
    clearLogs()
  })

  describe('triggerManualBadge', () => {
    test('should grant a manual badge to a user', () => {
      triggerManualBadge('user1', 'special-quest', 'admin')

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe('user1')
      expect(rewards[0].questId).toBe('special-quest')
      expect(rewards[0].badgeId).toContain('manual-special-quest')
      expect(rewards[0].fallbackUsed).toBe(false)
    })

    test('should log the manual badge grant', () => {
      triggerManualBadge('user1', 'special-quest', 'admin')

      const logs = getLogsByType('manual-badge-granted')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.userId).toBe('user1')
      expect(logs[0].context.questId).toBe('special-quest')
      expect(logs[0].context.triggeredBy).toBe('admin')
    })

    test('should use default triggeredBy if not provided', () => {
      triggerManualBadge('user1', 'quest-001')

      const logs = getLogsByType('manual-badge-granted')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.triggeredBy).toBe('admin')
    })

    test('should grant multiple manual badges', () => {
      triggerManualBadge('user1', 'quest-001', 'admin')
      triggerManualBadge('user1', 'quest-002', 'admin')
      triggerManualBadge('user2', 'quest-001', 'admin')

      const allRewards = getAllRewards()
      expect(allRewards).toHaveLength(3)

      const user1Rewards = getRewardsByUser('user1')
      expect(user1Rewards).toHaveLength(2)
    })
  })

  describe('revokeBadge', () => {
    test('should log badge revocation', () => {
      revokeBadge('user1', 'badge-001', 'admin')

      const logs = getLogsByType('badge-revoked')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.userId).toBe('user1')
      expect(logs[0].context.badgeId).toBe('badge-001')
      expect(logs[0].context.triggeredBy).toBe('admin')
    })

    test('should use default triggeredBy if not provided', () => {
      revokeBadge('user1', 'badge-001')

      const logs = getLogsByType('badge-revoked')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.triggeredBy).toBe('admin')
    })
  })

  describe('resetQuestProgress', () => {
    test('should log quest progress reset', () => {
      resetQuestProgress('user1', 'quest-001', 'admin')

      const logs = getLogsByType('quest-progress-reset')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.userId).toBe('user1')
      expect(logs[0].context.questId).toBe('quest-001')
      expect(logs[0].context.triggeredBy).toBe('admin')
    })

    test('should use default triggeredBy if not provided', () => {
      resetQuestProgress('user1', 'quest-001')

      const logs = getLogsByType('quest-progress-reset')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.triggeredBy).toBe('admin')
    })
  })
})
