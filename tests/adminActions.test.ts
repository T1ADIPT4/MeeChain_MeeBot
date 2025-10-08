/**
 * Admin Actions Test Suite
 * Tests for manual badge operations and admin interventions
 */

import {
  triggerManualBadge,
  getAllAdminActions,
  getAdminActionsByUser,
  getAdminActionsByAdmin,
  getRecentAdminActions,
  clearAdminActions,
} from '../admin/AdminActions'
import { getAllRewards, clearRewards } from '../tracker/RewardTracker'
import { clearLogs, getLogsByType } from '../src/utils/logger'

describe('Admin Actions', () => {
  beforeEach(() => {
    clearAdminActions()
    clearRewards()
    clearLogs()
  })

  describe('triggerManualBadge', () => {
    test('should grant manual badge to user', () => {
      const userId = 'user-1'
      const questId = 'special-quest'
      
      const badgeId = triggerManualBadge(userId, questId)

      expect(badgeId).toContain('manual-')
      expect(badgeId).toContain(questId)

      // Verify reward was tracked
      const rewards = getAllRewards()
      expect(rewards).toHaveLength(1)
      expect(rewards[0].userId).toBe(userId)
      expect(rewards[0].questId).toBe(questId)
      expect(rewards[0].badgeId).toBe(badgeId)
      expect(rewards[0].fallbackUsed).toBe(false)
    })

    test('should log admin action', () => {
      triggerManualBadge('user-1', 'special-quest', 'admin-john')

      const logs = getLogsByType('manual-badge-granted')
      expect(logs).toHaveLength(1)
      expect(logs[0].context.userId).toBe('user-1')
      expect(logs[0].context.questId).toBe('special-quest')
      expect(logs[0].context.triggeredBy).toBe('admin-john')
    })

    test('should record admin action', () => {
      const badgeId = triggerManualBadge('user-1', 'special-quest', 'admin-sarah')

      const actions = getAllAdminActions()
      expect(actions).toHaveLength(1)
      expect(actions[0].userId).toBe('user-1')
      expect(actions[0].questId).toBe('special-quest')
      expect(actions[0].badgeId).toBe(badgeId)
      expect(actions[0].triggeredBy).toBe('admin-sarah')
      expect(actions[0].timestamp).toBeDefined()
    })

    test('should use default admin if not specified', () => {
      triggerManualBadge('user-1', 'quest-1')

      const actions = getAllAdminActions()
      expect(actions[0].triggeredBy).toBe('admin')
    })

    test('should generate unique badge IDs', () => {
      const badge1 = triggerManualBadge('user-1', 'quest-1')
      const badge2 = triggerManualBadge('user-1', 'quest-1')

      expect(badge1).not.toBe(badge2)
    })
  })

  describe('getAllAdminActions', () => {
    test('should return all admin actions', () => {
      triggerManualBadge('user-1', 'quest-1', 'admin-1')
      triggerManualBadge('user-2', 'quest-2', 'admin-2')
      triggerManualBadge('user-3', 'quest-3', 'admin-1')

      const actions = getAllAdminActions()
      expect(actions).toHaveLength(3)
    })

    test('should return empty array when no actions', () => {
      const actions = getAllAdminActions()
      expect(actions).toHaveLength(0)
    })
  })

  describe('getAdminActionsByUser', () => {
    test('should filter actions by user ID', () => {
      triggerManualBadge('user-1', 'quest-1', 'admin-1')
      triggerManualBadge('user-2', 'quest-2', 'admin-2')
      triggerManualBadge('user-1', 'quest-3', 'admin-1')

      const user1Actions = getAdminActionsByUser('user-1')
      expect(user1Actions).toHaveLength(2)
      expect(user1Actions.every((a) => a.userId === 'user-1')).toBe(true)

      const user2Actions = getAdminActionsByUser('user-2')
      expect(user2Actions).toHaveLength(1)
    })

    test('should return empty array for user with no actions', () => {
      triggerManualBadge('user-1', 'quest-1')

      const user2Actions = getAdminActionsByUser('user-2')
      expect(user2Actions).toHaveLength(0)
    })
  })

  describe('getAdminActionsByAdmin', () => {
    test('should filter actions by admin who triggered them', () => {
      triggerManualBadge('user-1', 'quest-1', 'admin-john')
      triggerManualBadge('user-2', 'quest-2', 'admin-sarah')
      triggerManualBadge('user-3', 'quest-3', 'admin-john')

      const johnActions = getAdminActionsByAdmin('admin-john')
      expect(johnActions).toHaveLength(2)
      expect(johnActions.every((a) => a.triggeredBy === 'admin-john')).toBe(true)

      const sarahActions = getAdminActionsByAdmin('admin-sarah')
      expect(sarahActions).toHaveLength(1)
    })
  })

  describe('getRecentAdminActions', () => {
    test('should return actions sorted by timestamp descending', () => {
      const badge1 = triggerManualBadge('user-1', 'quest-1', 'admin-1')
      
      // Wait a bit to ensure different timestamps
      const wait = () => new Promise(resolve => setTimeout(resolve, 10))
      
      return wait()
        .then(() => triggerManualBadge('user-2', 'quest-2', 'admin-2'))
        .then(() => wait())
        .then(() => triggerManualBadge('user-3', 'quest-3', 'admin-3'))
        .then(() => {
          const recentActions = getRecentAdminActions(10)
          expect(recentActions).toHaveLength(3)
          expect(recentActions[0].userId).toBe('user-3') // Most recent
          expect(recentActions[2].userId).toBe('user-1') // Oldest
        })
    })

    test('should limit results by limit parameter', () => {
      for (let i = 1; i <= 10; i++) {
        triggerManualBadge(`user-${i}`, 'quest-1', 'admin')
      }

      const recentActions = getRecentAdminActions(5)
      expect(recentActions).toHaveLength(5)
    })

    test('should default to 10 results', () => {
      for (let i = 1; i <= 15; i++) {
        triggerManualBadge(`user-${i}`, 'quest-1', 'admin')
      }

      const recentActions = getRecentAdminActions()
      expect(recentActions).toHaveLength(10)
    })
  })

  describe('clearAdminActions', () => {
    test('should clear all admin actions', () => {
      triggerManualBadge('user-1', 'quest-1')
      triggerManualBadge('user-2', 'quest-2')

      expect(getAllAdminActions()).toHaveLength(2)

      clearAdminActions()

      expect(getAllAdminActions()).toHaveLength(0)
    })
  })

  describe('Integration with Reward Tracker', () => {
    test('should track rewards when granting manual badges', () => {
      triggerManualBadge('user-1', 'quest-1', 'admin-1')
      triggerManualBadge('user-2', 'quest-2', 'admin-1')
      triggerManualBadge('user-1', 'quest-3', 'admin-2')

      const rewards = getAllRewards()
      expect(rewards).toHaveLength(3)

      const user1Rewards = rewards.filter((r) => r.userId === 'user-1')
      expect(user1Rewards).toHaveLength(2)
    })

    test('should not use fallback for manual badges', () => {
      triggerManualBadge('user-1', 'quest-1')

      const rewards = getAllRewards()
      expect(rewards[0].fallbackUsed).toBe(false)
    })
  })
})
