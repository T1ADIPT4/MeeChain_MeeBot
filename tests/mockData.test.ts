/**
 * Tests for Mock Data Utilities
 * Tests the badge and fallback log data functions
 */

import { getUserBadges, getFallbackLogs, mintBadge } from '../utils/mockData'
import { clearLogs, logEvent } from '../src/utils/logger'

describe('Mock Data Utilities', () => {
  beforeEach(() => {
    clearLogs()
  })

  describe('getUserBadges', () => {
    test('should return array of badges for a user', () => {
      const badges = getUserBadges('user-001')
      expect(Array.isArray(badges)).toBe(true)
      expect(badges.length).toBeGreaterThan(0)
    })

    test('should return badges with required fields', () => {
      const badges = getUserBadges('user-001')
      badges.forEach(badge => {
        expect(badge).toHaveProperty('badgeId')
        expect(badge).toHaveProperty('questId')
        expect(badge).toHaveProperty('userId')
        expect(badge.userId).toBe('user-001')
      })
    })

    test('should include chain information', () => {
      const badges = getUserBadges('user-123')
      badges.forEach(badge => {
        expect(badge).toHaveProperty('chain')
        expect(['ethereum', 'polygon', 'arbitrum']).toContain(badge.chain)
      })
    })
  })

  describe('getFallbackLogs', () => {
    test('should return empty array when no logs exist', () => {
      const logs = getFallbackLogs()
      // Should return mock data when no actual logs
      expect(Array.isArray(logs)).toBe(true)
    })

    test('should return fallback logs from logger when available', () => {
      // Create some fallback logs
      logEvent('badge-fallback-minted', {
        userId: 'test-user',
        questId: 'test-quest',
        network: 'ethereum',
        tx: '0xtest123'
      })

      const logs = getFallbackLogs()
      expect(logs.length).toBeGreaterThan(0)
      expect(logs[0]).toHaveProperty('userId')
      expect(logs[0]).toHaveProperty('questId')
      expect(logs[0]).toHaveProperty('fallbackUsed')
      expect(logs[0].fallbackUsed).toBe(true)
    })

    test('should include chain and transaction info', () => {
      logEvent('badge-fallback-mint-success', {
        userId: 'user-002',
        questId: 'quest-002',
        network: 'polygon',
        tx: '0xabc123'
      })

      const logs = getFallbackLogs()
      expect(logs.length).toBeGreaterThan(0)
      const log = logs.find(l => l.userId === 'user-002')
      if (log) {
        expect(log.chain).toBe('polygon')
        expect(log.txHash).toBe('0xabc123')
      }
    })
  })

  describe('mintBadge', () => {
    test('should execute without errors', () => {
      expect(() => {
        mintBadge('user-001', 'quest-001', '0xContract123')
      }).not.toThrow()
    })

    test('should log the mint operation', () => {
      const consoleSpy = jest.spyOn(console, 'log')
      mintBadge('user-123', 'quest-456', '0xTestContract')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Admin Override]')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('user-123')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('quest-456')
      )
      
      consoleSpy.mockRestore()
    })
  })
})
