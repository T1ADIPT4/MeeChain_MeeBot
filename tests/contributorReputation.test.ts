/**
 * Tests for Contributor Reputation Service
 */

import {
  getContributorProfile,
  recordAction,
  recordAuditLog,
  linkSBTToken,
  getAllContributors,
  getLeaderboard,
  getBadgeDefinitions,
  clearAllProfiles,
  type ContributorAction
} from '../src/services/contributorReputationService'

describe('Contributor Reputation Service', () => {
  const testAddress = '0x1234567890123456789012345678901234567890'

  beforeEach(() => {
    // Clear any existing profiles for clean tests
    clearAllProfiles()
  })

  describe('getContributorProfile', () => {
    it('should create a new profile if it does not exist', () => {
      const profile = getContributorProfile(testAddress)
      
      expect(profile).toBeDefined()
      expect(profile.address).toBe(testAddress)
      expect(profile.score).toBe(0)
      expect(profile.badges).toHaveLength(0)
      expect(profile.actions).toHaveLength(0)
    })

    it('should return existing profile on subsequent calls', () => {
      const profile1 = getContributorProfile(testAddress)
      profile1.score = 100
      
      const profile2 = getContributorProfile(testAddress)
      expect(profile2.score).toBe(100)
    })
  })

  describe('recordAction', () => {
    it('should record valid refund flag action and increase score', async () => {
      const action: ContributorAction = {
        type: 'refund_flag',
        refundId: 'refund-001',
        timestamp: new Date(),
        valid: true
      }

      const result = await recordAction(testAddress, action)
      
      expect(result.success).toBe(true)
      expect(result.newScore).toBe(10) // refund_flag = 10 points
      expect(result.badgesUnlocked).toHaveLength(0) // Not enough for badge yet
    })

    it('should not increase score for invalid actions', async () => {
      const action: ContributorAction = {
        type: 'refund_flag',
        refundId: 'refund-002',
        timestamp: new Date(),
        valid: false
      }

      const result = await recordAction(testAddress, action)
      
      expect(result.success).toBe(true)
      expect(result.newScore).toBe(0)
    })

    it('should unlock Watchdog badge after 5 valid refund flags', async () => {
      const address = '0xbadge-test-1'
      
      // Record 5 valid refund flags
      for (let i = 0; i < 5; i++) {
        await recordAction(address, {
          type: 'refund_flag',
          refundId: `refund-00${i}`,
          timestamp: new Date(),
          valid: true
        })
      }

      const profile = getContributorProfile(address)
      expect(profile.badges).toHaveLength(1)
      expect(profile.badges[0].id).toBe('watchdog')
      expect(profile.score).toBe(50) // 5 * 10 points
    })

    it('should unlock Proposer badge after 3 proposal creations', async () => {
      const address = '0xbadge-test-2'
      
      // Record 3 valid proposals
      for (let i = 0; i < 3; i++) {
        await recordAction(address, {
          type: 'proposal_create',
          proposalId: `proposal-00${i}`,
          timestamp: new Date(),
          valid: true
        })
      }

      const profile = getContributorProfile(address)
      expect(profile.badges).toHaveLength(1)
      expect(profile.badges[0].id).toBe('proposer')
      expect(profile.score).toBe(75) // 3 * 25 points
    })

    it('should award correct scores for different action types', async () => {
      const address = '0xscore-test'
      
      await recordAction(address, {
        type: 'refund_flag',
        timestamp: new Date(),
        valid: true
      }) // +10
      
      await recordAction(address, {
        type: 'audit_complete',
        timestamp: new Date(),
        valid: true
      }) // +15
      
      await recordAction(address, {
        type: 'vote_cast',
        timestamp: new Date(),
        valid: true
      }) // +5
      
      await recordAction(address, {
        type: 'dispute_resolve',
        timestamp: new Date(),
        valid: true
      }) // +30

      const profile = getContributorProfile(address)
      expect(profile.score).toBe(60) // 10 + 15 + 5 + 30
    })
  })

  describe('recordAuditLog', () => {
    it('should add audit log to contributor profile', () => {
      recordAuditLog(testAddress, 'refund-123', 'approved', 'verified transaction')
      
      const profile = getContributorProfile(testAddress)
      expect(profile.auditLogs).toHaveLength(1)
      expect(profile.auditLogs[0].refundId).toBe('refund-123')
      expect(profile.auditLogs[0].status).toBe('approved')
    })
  })

  describe('linkSBTToken', () => {
    it('should link SBT token to contributor profile', async () => {
      // First unlock a badge
      for (let i = 0; i < 5; i++) {
        await recordAction(testAddress, {
          type: 'refund_flag',
          timestamp: new Date(),
          valid: true
        })
      }

      // Link SBT token
      linkSBTToken(
        testAddress,
        1001,
        '🛡️ Watchdog',
        '0xBadgeContract',
        'QmMetadataHash123'
      )

      const profile = getContributorProfile(testAddress)
      expect(profile.sbtTokens).toHaveLength(1)
      expect(profile.sbtTokens[0].tokenId).toBe(1001)
      expect(profile.sbtTokens[0].contractAddress).toBe('0xBadgeContract')
      
      // Check that badge is updated with token info
      const badge = profile.badges.find(b => b.name === '🛡️ Watchdog')
      expect(badge).toBeDefined()
      expect(badge?.tokenId).toBe(1001)
    })
  })

  describe('getAllContributors and getLeaderboard', () => {
    it('should return all contributors sorted by score', async () => {
      // Create multiple contributors with different scores
      await recordAction('0xuser1', {
        type: 'proposal_create',
        timestamp: new Date(),
        valid: true
      }) // 25 points

      await recordAction('0xuser2', {
        type: 'dispute_resolve',
        timestamp: new Date(),
        valid: true
      }) // 30 points

      await recordAction('0xuser3', {
        type: 'vote_cast',
        timestamp: new Date(),
        valid: true
      }) // 5 points

      const contributors = getAllContributors()
      expect(contributors.length).toBeGreaterThanOrEqual(3)
      
      // Check sorting (highest score first)
      expect(contributors[0].address).toBe('0xuser2') // 30 points
      expect(contributors[1].address).toBe('0xuser1') // 25 points
    })

    it('should return limited leaderboard', async () => {
      const leaderboard = getLeaderboard(2)
      expect(leaderboard.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getBadgeDefinitions', () => {
    it('should return all badge definitions', () => {
      const badges = getBadgeDefinitions()
      
      expect(badges).toBeDefined()
      expect(badges.length).toBeGreaterThan(0)
      
      const watchdog = badges.find(b => b.id === 'watchdog')
      expect(watchdog).toBeDefined()
      expect(watchdog?.requirement.type).toBe('refund_flag')
      expect(watchdog?.requirement.count).toBe(5)
    })
  })
})
