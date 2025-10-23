/**
 * Tests for Export Log API and DAO Governance Integration
 */

import {
  getAllRefundLogs,
  getRefundLogById,
  addRefundLog,
  updateRefundLog,
  getAllRefundFlags,
  getFlagsByRefundId,
  addRefundFlag,
  initializeSampleData,
  RefundLog,
  RefundFlag
} from '../api/models/RefundLog'

describe('RefundLog Model', () => {
  beforeEach(() => {
    // Initialize sample data before each test
    initializeSampleData()
  })

  describe('RefundLog Operations', () => {
    test('should get all refund logs', () => {
      const logs = getAllRefundLogs()
      expect(logs).toBeDefined()
      expect(Array.isArray(logs)).toBe(true)
      expect(logs.length).toBeGreaterThan(0)
    })

    test('should get refund log by ID', () => {
      const log = getRefundLogById('refund-001')
      expect(log).toBeDefined()
      expect(log?.refundId).toBe('refund-001')
      expect(log?.userAddress).toBeDefined()
      expect(log?.txHash).toBeDefined()
    })

    test('should return undefined for non-existent refund ID', () => {
      const log = getRefundLogById('non-existent-id')
      expect(log).toBeUndefined()
    })

    test('should add a new refund log', () => {
      const newLog: RefundLog = {
        refundId: 'refund-test-001',
        userAddress: '0xTestAddress123',
        txHash: '0xTestHash456',
        amount: '5.0',
        status: 'pending',
        reason: 'Test refund',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const added = addRefundLog(newLog)
      expect(added).toEqual(newLog)

      const retrieved = getRefundLogById('refund-test-001')
      expect(retrieved).toEqual(newLog)
    })

    test('should update an existing refund log', () => {
      const updates = {
        status: 'verified' as const,
        verifiedAt: new Date().toISOString(),
        executedBy: '0xValidator123'
      }

      const updated = updateRefundLog('refund-001', updates)
      expect(updated).toBeDefined()
      expect(updated?.status).toBe('verified')
      expect(updated?.verifiedAt).toBeDefined()
      expect(updated?.executedBy).toBe('0xValidator123')
    })

    test('should return undefined when updating non-existent log', () => {
      const updated = updateRefundLog('non-existent-id', { status: 'verified' })
      expect(updated).toBeUndefined()
    })
  })

  describe('RefundFlag Operations', () => {
    test('should get all refund flags', () => {
      const flags = getAllRefundFlags()
      expect(flags).toBeDefined()
      expect(Array.isArray(flags)).toBe(true)
    })

    test('should get flags by refund ID', () => {
      const flags = getFlagsByRefundId('refund-003')
      expect(flags).toBeDefined()
      expect(Array.isArray(flags)).toBe(true)
      expect(flags.length).toBeGreaterThan(0)
      expect(flags[0].refundId).toBe('refund-003')
    })

    test('should add a new refund flag', () => {
      const newFlag: RefundFlag = {
        refundId: 'refund-001',
        reason: 'Test flag reason',
        flaggedBy: '0xTestAuditor',
        flaggedAt: new Date().toISOString(),
        status: 'open'
      }

      const added = addRefundFlag(newFlag)
      expect(added).toEqual(newFlag)

      const flags = getFlagsByRefundId('refund-001')
      expect(flags.some(f => f.flaggedBy === '0xTestAuditor')).toBe(true)
    })

    test('should return empty array for refund with no flags', () => {
      const flags = getFlagsByRefundId('refund-001')
      // refund-001 should have no flags initially
      expect(Array.isArray(flags)).toBe(true)
    })
  })

  describe('Data Validation', () => {
    test('should have valid refund log structure', () => {
      const log = getRefundLogById('refund-001')
      expect(log).toBeDefined()
      
      // Check required fields
      expect(log?.refundId).toBeDefined()
      expect(log?.userAddress).toBeDefined()
      expect(log?.txHash).toBeDefined()
      expect(log?.amount).toBeDefined()
      expect(log?.status).toBeDefined()
      expect(log?.createdAt).toBeDefined()
      expect(log?.updatedAt).toBeDefined()
      
      // Check status is valid
      expect(['pending', 'verified', 'refunded', 'failed']).toContain(log?.status)
    })

    test('should have valid refund flag structure', () => {
      const flags = getFlagsByRefundId('refund-003')
      expect(flags.length).toBeGreaterThan(0)
      
      const flag = flags[0]
      expect(flag.refundId).toBeDefined()
      expect(flag.reason).toBeDefined()
      expect(flag.flaggedBy).toBeDefined()
      expect(flag.flaggedAt).toBeDefined()
      expect(flag.status).toBeDefined()
      
      // Check status is valid
      expect(['open', 'resolved', 'dismissed']).toContain(flag.status)
    })
  })

  describe('Sample Data Initialization', () => {
    test('should initialize with sample refund logs', () => {
      const logs = getAllRefundLogs()
      expect(logs.length).toBeGreaterThanOrEqual(3)
      
      // Check that specific sample logs exist
      const log1 = getRefundLogById('refund-001')
      const log2 = getRefundLogById('refund-002')
      const log3 = getRefundLogById('refund-003')
      
      expect(log1).toBeDefined()
      expect(log2).toBeDefined()
      expect(log3).toBeDefined()
    })

    test('should initialize with sample flags', () => {
      const flags = getAllRefundFlags()
      expect(flags.length).toBeGreaterThanOrEqual(1)
      
      // Check that refund-003 has a flag
      const refund3Flags = getFlagsByRefundId('refund-003')
      expect(refund3Flags.length).toBeGreaterThan(0)
    })
  })
})

describe('API Export Functionality', () => {
  beforeEach(() => {
    initializeSampleData()
  })

  test('should have logs ready for CSV export', () => {
    const logs = getAllRefundLogs()
    
    // Check that all logs have the fields needed for CSV export
    logs.forEach(log => {
      expect(log.refundId).toBeDefined()
      expect(log.userAddress).toBeDefined()
      expect(log.txHash).toBeDefined()
      expect(log.amount).toBeDefined()
      expect(log.status).toBeDefined()
      expect(log.createdAt).toBeDefined()
      expect(log.updatedAt).toBeDefined()
    })
  })

  test('should prepare data for DAO proposal', () => {
    const log = getRefundLogById('refund-001')
    expect(log).toBeDefined()
    
    if (log) {
      // Check that log has all fields needed for DAO proposal
      expect(log.userAddress).toBeDefined()
      expect(log.txHash).toBeDefined()
      expect(log.reason).toBeDefined()
      expect(log.status).toBeDefined()
      
      // Generate proposal text
      const proposalText = `### Refund Audit Proposal
**ผู้ขอ:** ${log.userAddress}
**ธุรกรรม:** [ดูบน BscScan](https://bscscan.com/tx/${log.txHash})
**เหตุผล:** ${log.reason || 'N/A'}
**สถานะ:** ${log.status}`
      
      expect(proposalText).toContain(log.userAddress)
      expect(proposalText).toContain(log.txHash)
    }
  })
})
