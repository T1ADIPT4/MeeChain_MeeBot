/**
 * Auditor System Tests
 * Tests for reputation service, badge service, and auditor service
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { 
  updateReputation, 
  getReputation, 
  resetReputation 
} from '../src/services/reputationService'
import { 
  getUserBadges, 
  checkAndUnlockBadges, 
  hasBadge,
  resetBadges,
  BADGE_RULES 
} from '../src/services/badgeService'
import { 
  createRefundLog, 
  getRefundLogs, 
  submitFlag, 
  validateFlag,
  completeReview 
} from '../src/services/auditorService'

describe('Reputation Service', () => {
  const testAuditor = '0xTestAuditor123456789012345678901234567890'

  beforeEach(() => {
    resetReputation(testAuditor)
  })

  test('should create initial reputation with zero score', () => {
    const rep = getReputation(testAuditor)
    expect(rep.user).toBe(testAuditor)
    expect(rep.score).toBe(0)
    expect(rep.flags).toBe(0)
    expect(rep.reviews).toBe(0)
  })

  test('should award 10 points for validated flag', async () => {
    await updateReputation(testAuditor, 'flag_validated')
    const rep = getReputation(testAuditor)
    expect(rep.score).toBe(10)
    expect(rep.flags).toBe(1)
  })

  test('should award 5 points for completed review', async () => {
    await updateReputation(testAuditor, 'review_completed')
    const rep = getReputation(testAuditor)
    expect(rep.score).toBe(5)
    expect(rep.reviews).toBe(1)
  })

  test('should accumulate reputation over multiple actions', async () => {
    await updateReputation(testAuditor, 'flag_validated')
    await updateReputation(testAuditor, 'review_completed')
    await updateReputation(testAuditor, 'flag_validated')
    
    const rep = getReputation(testAuditor)
    expect(rep.score).toBe(25) // 10 + 5 + 10
    expect(rep.flags).toBe(2)
    expect(rep.reviews).toBe(1)
  })
})

describe('Badge Service', () => {
  const testAuditor = '0xTestAuditor234567890123456789012345678901'

  beforeEach(() => {
    resetReputation(testAuditor)
    resetBadges(testAuditor)
  })

  test('should start with no badges', () => {
    const badges = getUserBadges(testAuditor)
    expect(badges.length).toBe(0)
  })

  test('should unlock Watchdog badge after 5 flags', async () => {
    // Award 5 flag_validated actions
    for (let i = 0; i < 5; i++) {
      await updateReputation(testAuditor, 'flag_validated')
    }
    
    const rep = getReputation(testAuditor)
    const newBadges = checkAndUnlockBadges(testAuditor, rep)
    
    expect(newBadges.length).toBeGreaterThan(0)
    expect(hasBadge(testAuditor, 'watchdog')).toBe(true)
  })

  test('should unlock Truth Seeker badge after 10 reviews', async () => {
    // Award 10 review_completed actions
    for (let i = 0; i < 10; i++) {
      await updateReputation(testAuditor, 'review_completed')
    }
    
    const rep = getReputation(testAuditor)
    checkAndUnlockBadges(testAuditor, rep)
    
    expect(hasBadge(testAuditor, 'truth-seeker')).toBe(true)
  })

  test('should unlock Auditor OG badge after reaching 100 points', async () => {
    // Award enough actions to reach 100 points
    for (let i = 0; i < 10; i++) {
      await updateReputation(testAuditor, 'flag_validated') // 10 * 10 = 100
    }
    
    const rep = getReputation(testAuditor)
    checkAndUnlockBadges(testAuditor, rep)
    
    expect(hasBadge(testAuditor, 'auditor-og')).toBe(true)
  })

  test('should not unlock same badge twice', async () => {
    // Award flags to unlock Watchdog
    for (let i = 0; i < 5; i++) {
      await updateReputation(testAuditor, 'flag_validated')
    }
    
    const rep = getReputation(testAuditor)
    const firstUnlock = checkAndUnlockBadges(testAuditor, rep)
    const secondUnlock = checkAndUnlockBadges(testAuditor, rep)
    
    expect(firstUnlock.length).toBeGreaterThan(0)
    expect(secondUnlock.length).toBe(0)
  })

  test('should unlock multiple badges when conditions are met', async () => {
    // Award actions to meet multiple badge conditions
    for (let i = 0; i < 10; i++) {
      await updateReputation(testAuditor, 'flag_validated')
      await updateReputation(testAuditor, 'review_completed')
    }
    
    const rep = getReputation(testAuditor)
    checkAndUnlockBadges(testAuditor, rep)
    
    const badges = getUserBadges(testAuditor)
    expect(badges.length).toBeGreaterThanOrEqual(3) // Should have Watchdog, Truth Seeker, and Auditor OG
  })
})

describe('Auditor Service', () => {
  const testAuditor = '0xTestAuditor345678901234567890123456789012'

  test('should create refund log', () => {
    const log = createRefundLog({
      requester: '0xRequester123',
      status: 'success',
      confirmationTime: new Date(),
      refundTx: '0xabc123',
      amount: '100 MEE',
      chain: 'polygon'
    })

    expect(log.id).toBeDefined()
    expect(log.requester).toBe('0xRequester123')
    expect(log.status).toBe('success')
    expect(log.flagged).toBe(false)
  })

  test('should retrieve all refund logs', () => {
    createRefundLog({
      requester: '0xRequester1',
      status: 'success',
      confirmationTime: new Date(),
      refundTx: '0xabc1',
      amount: '100 MEE'
    })
    
    createRefundLog({
      requester: '0xRequester2',
      status: 'failed',
      confirmationTime: new Date(),
      refundTx: '0xabc2',
      amount: '200 MEE'
    })

    const logs = getRefundLogs()
    expect(logs.length).toBeGreaterThanOrEqual(2)
  })

  test('should filter logs by status', () => {
    createRefundLog({
      requester: '0xRequester1',
      status: 'success',
      confirmationTime: new Date(),
      refundTx: '0xabc1'
    })
    
    createRefundLog({
      requester: '0xRequester2',
      status: 'failed',
      confirmationTime: new Date(),
      refundTx: '0xabc2'
    })

    const successLogs = getRefundLogs({ status: 'success' })
    const failedLogs = getRefundLogs({ status: 'failed' })
    
    expect(successLogs.every(log => log.status === 'success')).toBe(true)
    expect(failedLogs.every(log => log.status === 'failed')).toBe(true)
  })

  test('should submit flag for refund log', () => {
    const log = createRefundLog({
      requester: '0xRequester123',
      status: 'success',
      confirmationTime: new Date(),
      refundTx: '0xabc123'
    })

    const flag = submitFlag(log.id, testAuditor, 'Suspicious activity')
    
    expect(flag.logId).toBe(log.id)
    expect(flag.auditor).toBe(testAuditor)
    expect(flag.reason).toBe('Suspicious activity')
    expect(flag.validated).toBe(false)

    const flaggedLogs = getRefundLogs({ flagged: true })
    expect(flaggedLogs.some(l => l.id === log.id)).toBe(true)
  })

  test('should validate flag and award reputation', async () => {
    resetReputation(testAuditor)
    
    const log = createRefundLog({
      requester: '0xRequester123',
      status: 'success',
      confirmationTime: new Date(),
      refundTx: '0xabc123'
    })

    submitFlag(log.id, testAuditor, 'Suspicious activity')
    await validateFlag(log.id, testAuditor, true)

    const rep = getReputation(testAuditor)
    expect(rep.score).toBe(10) // Should have received flag_validated points
    expect(rep.flags).toBe(1)
  })

  test('should complete review and award reputation', async () => {
    resetReputation(testAuditor)
    
    const log = createRefundLog({
      requester: '0xRequester123',
      status: 'success',
      confirmationTime: new Date(),
      refundTx: '0xabc123'
    })

    await completeReview(log.id, testAuditor, 'Review completed successfully')

    const rep = getReputation(testAuditor)
    expect(rep.score).toBe(5) // Should have received review_completed points
    expect(rep.reviews).toBe(1)
  })
})

describe('Badge Rules', () => {
  test('should have all expected badge rules', () => {
    expect(BADGE_RULES.length).toBeGreaterThanOrEqual(6)
    
    const badgeIds = BADGE_RULES.map(r => r.id)
    expect(badgeIds).toContain('watchdog')
    expect(badgeIds).toContain('truth-seeker')
    expect(badgeIds).toContain('auditor-og')
    expect(badgeIds).toContain('eagle-eye')
    expect(badgeIds).toContain('master-auditor')
    expect(badgeIds).toContain('legend')
  })

  test('each badge should have required properties', () => {
    BADGE_RULES.forEach(rule => {
      expect(rule.id).toBeDefined()
      expect(rule.name).toBeDefined()
      expect(rule.icon).toBeDefined()
      expect(rule.description).toBeDefined()
      expect(typeof rule.condition).toBe('function')
    })
  })
})

console.log('✅ Auditor System test suite defined')
console.log('Run with: npm test tests/auditorSystem.test.ts')
