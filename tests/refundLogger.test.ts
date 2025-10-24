/**
 * Tests for Refund Logger
 * Comprehensive tests for refund logging and audit trail system
 */

import {
  logRefundAction,
  updateRefundStatus,
  getRefundLogs,
  getRefundLogsByUser,
  getRefundLogsByStatus,
  getRefundLogByTxHash,
  getRefundLogById,
  exportRefundLogsToJSON,
  exportRefundLogsToCSV,
  clearRefundLogs
} from '../src/utils/refundLogger'
import * as fs from 'fs'
import * as path from 'path'

describe('Refund Logger', () => {
  const logsDir = path.join(process.cwd(), 'logs', 'refunds')

  beforeEach(() => {
    clearRefundLogs()
  })

  describe('Basic Logging', () => {
    test('should log a refund action with all required fields', async () => {
      const logEntry = await logRefundAction({
        userAddress: '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
        txHash: '0x19cea8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c9877f3',
        amount: '0.0083595',
        status: 'pending',
        signature: '0x1234567890abcdef',
        message: 'MeeChain Refund Request for tx 0x19cea8...',
        executedBy: '0xMeeBotAddress',
        contractAddress: '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F',
        reason: 'Replay failed',
        ip: '203.0.113.42',
        userAgent: 'MetaMask/Chrome',
        notes: 'Auto-refund triggered after 3 failed replay attempts'
      })

      expect(logEntry).toBeDefined()
      expect(logEntry.refundId).toBe('ref_0x19cea8e8')
      expect(logEntry.userAddress).toBe('0x883AD20a608e6990ddFF249Ad686b986cD10b4f1')
      expect(logEntry.amount).toBe('0.0083595')
      expect(logEntry.status).toBe('pending')
      expect(logEntry.verifiedBy).toBe('MeeBot')
    })

    test('should generate unique refund ID based on tx hash', async () => {
      const logEntry1 = await logRefundAction({
        userAddress: '0xUser1',
        txHash: '0xabc123',
        amount: '1.0',
        signature: '0xsig1',
        message: 'Test message',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1'
      })

      const logEntry2 = await logRefundAction({
        userAddress: '0xUser2',
        txHash: '0xdef456',
        amount: '2.0',
        signature: '0xsig2',
        message: 'Test message 2',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1'
      })

      expect(logEntry1.refundId).toBe('ref_0xabc123')
      expect(logEntry2.refundId).toBe('ref_0xdef456')
      expect(logEntry1.refundId).not.toBe(logEntry2.refundId)
    })

    test('should set default values for optional fields', async () => {
      const logEntry = await logRefundAction({
        userAddress: '0xUser',
        txHash: '0xTx',
        amount: '1.0',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract'
      })

      expect(logEntry.reason).toBe('N/A')
      expect(logEntry.ip).toBe('N/A')
      expect(logEntry.userAgent).toBe('N/A')
      expect(logEntry.notes).toBe('')
    })
  })

  describe('Status Updates', () => {
    test('should update refund status to success', async () => {
      const logEntry = await logRefundAction({
        userAddress: '0xUser',
        txHash: '0xTx123',
        amount: '1.0',
        status: 'pending',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract'
      })

      updateRefundStatus(logEntry.refundId, 'success', '0xRefundTx')

      const logs = getRefundLogs()
      const updatedLog = logs.find(log => log.refundId === logEntry.refundId)

      expect(updatedLog?.status).toBe('success')
      expect(updatedLog?.refundTxHash).toBe('0xRefundTx')
    })

    test('should update refund status to failed', async () => {
      const logEntry = await logRefundAction({
        userAddress: '0xUser',
        txHash: '0xTx456',
        amount: '1.0',
        status: 'pending',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract'
      })

      updateRefundStatus(logEntry.refundId, 'failed')

      const logs = getRefundLogs()
      const updatedLog = logs.find(log => log.refundId === logEntry.refundId)

      expect(updatedLog?.status).toBe('failed')
    })
  })

  describe('Querying Logs', () => {
    beforeEach(async () => {
      // Create test data
      await logRefundAction({
        userAddress: '0xUser1',
        txHash: '0xTx1',
        amount: '1.0',
        status: 'success',
        signature: '0xSig1',
        message: 'Test 1',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1'
      })

      await logRefundAction({
        userAddress: '0xUser1',
        txHash: '0xTx2',
        amount: '2.0',
        status: 'pending',
        signature: '0xSig2',
        message: 'Test 2',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1'
      })

      await logRefundAction({
        userAddress: '0xUser2',
        txHash: '0xTx3',
        amount: '3.0',
        status: 'failed',
        signature: '0xSig3',
        message: 'Test 3',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract2'
      })
    })

    test('should get all refund logs', () => {
      const logs = getRefundLogs()
      expect(logs).toHaveLength(3)
    })

    test('should filter logs by user address', () => {
      const user1Logs = getRefundLogsByUser('0xUser1')
      expect(user1Logs).toHaveLength(2)
      expect(user1Logs.every(log => log.userAddress === '0xUser1')).toBe(true)
    })

    test('should filter logs by user address (case insensitive)', () => {
      const user1Logs = getRefundLogsByUser('0xuser1')
      expect(user1Logs).toHaveLength(2)
    })

    test('should filter logs by status', () => {
      const successLogs = getRefundLogsByStatus('success')
      const pendingLogs = getRefundLogsByStatus('pending')
      const failedLogs = getRefundLogsByStatus('failed')

      expect(successLogs).toHaveLength(1)
      expect(pendingLogs).toHaveLength(1)
      expect(failedLogs).toHaveLength(1)
    })

    test('should get log by transaction hash', () => {
      const log = getRefundLogByTxHash('0xTx1')
      expect(log).toBeDefined()
      expect(log?.txHash).toBe('0xTx1')
      expect(log?.userAddress).toBe('0xUser1')
    })

    test('should get log by refund ID', () => {
      const log = getRefundLogById('ref_0xTx2')
      expect(log).toBeDefined()
      expect(log?.refundId).toBe('ref_0xTx2')
      expect(log?.amount).toBe('2.0')
    })

    test('should return undefined for non-existent transaction hash', () => {
      const log = getRefundLogByTxHash('0xNonExistent')
      expect(log).toBeUndefined()
    })

    test('should return undefined for non-existent refund ID', () => {
      const log = getRefundLogById('ref_nonexistent')
      expect(log).toBeUndefined()
    })
  })

  describe('Export Functionality', () => {
    beforeEach(async () => {
      await logRefundAction({
        userAddress: '0xUser1',
        txHash: '0xTx1',
        amount: '1.0',
        status: 'success',
        signature: '0xSig1',
        message: 'Test 1',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1',
        reason: 'Test reason'
      })
    })

    test('should export logs to JSON format', () => {
      const json = exportRefundLogsToJSON()
      const parsed = JSON.parse(json)

      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].refundId).toBe('ref_0xTx1')
    })

    test('should export logs to CSV format', () => {
      const csv = exportRefundLogsToCSV()
      const lines = csv.split('\n')

      expect(lines[0]).toContain('Refund ID')
      expect(lines[0]).toContain('User Address')
      expect(lines[0]).toContain('Amount')
      expect(lines[1]).toContain('ref_0xTx1')
      expect(lines[1]).toContain('0xUser1')
      expect(lines[1]).toContain('1.0')
    })

    test('should export logs to JSON file', () => {
      const testFilePath = path.join(logsDir, 'test-export.json')
      exportRefundLogsToJSON(testFilePath)

      expect(fs.existsSync(testFilePath)).toBe(true)
      const content = fs.readFileSync(testFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      expect(parsed).toHaveLength(1)

      // Cleanup
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath)
      }
    })

    test('should export logs to CSV file', () => {
      const testFilePath = path.join(logsDir, 'test-export.csv')
      exportRefundLogsToCSV(testFilePath)

      expect(fs.existsSync(testFilePath)).toBe(true)
      const content = fs.readFileSync(testFilePath, 'utf-8')
      expect(content).toContain('Refund ID')
      expect(content).toContain('ref_0xTx1')

      // Cleanup
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath)
      }
    })
  })

  describe('File Writing', () => {
    test('should write refund log to file', async () => {
      await logRefundAction({
        userAddress: '0xUser1',
        txHash: '0xTestTx',
        amount: '1.0',
        status: 'success',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1'
      })

      const dateStr = new Date().toISOString().split('T')[0]
      const logFilePath = path.join(logsDir, `refund-${dateStr}.log`)

      expect(fs.existsSync(logFilePath)).toBe(true)
      const content = fs.readFileSync(logFilePath, 'utf-8')
      expect(content).toContain('ref_0xTestTx')
      expect(content).toContain('0xUser1')
    })
  })

  describe('Clear Logs', () => {
    test('should clear all logs', async () => {
      await logRefundAction({
        userAddress: '0xUser1',
        txHash: '0xTx1',
        amount: '1.0',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract1'
      })

      expect(getRefundLogs()).toHaveLength(1)

      clearRefundLogs()

      expect(getRefundLogs()).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty user address', async () => {
      const logEntry = await logRefundAction({
        userAddress: '',
        txHash: '0xTx',
        amount: '0',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract'
      })

      expect(logEntry).toBeDefined()
      expect(logEntry.userAddress).toBe('')
    })

    test('should handle very large amounts', async () => {
      const largeAmount = '999999999999999999.999999999999999999'
      const logEntry = await logRefundAction({
        userAddress: '0xUser',
        txHash: '0xTx',
        amount: largeAmount,
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract'
      })

      expect(logEntry.amount).toBe(largeAmount)
    })

    test('should handle special characters in notes', async () => {
      const specialNotes = 'Test with special chars: \n\t"quotes" & <html>'
      const logEntry = await logRefundAction({
        userAddress: '0xUser',
        txHash: '0xTx',
        amount: '1.0',
        signature: '0xSig',
        message: 'Test',
        executedBy: '0xMeeBot',
        contractAddress: '0xContract',
        notes: specialNotes
      })

      expect(logEntry.notes).toBe(specialNotes)
    })
  })
})
