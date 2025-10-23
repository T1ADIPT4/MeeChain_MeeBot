/**
 * Tests for Refund Middleware
 * Tests for signature verification and refund request processing
 */

import {
  verifySignature,
  processRefundRequest,
  handleReplayFailureRefund,
  batchProcessRefunds
} from '../src/utils/refundMiddleware'
import { clearRefundLogs, getRefundLogs } from '../src/utils/refundLogger'

describe('Refund Middleware', () => {
  beforeEach(() => {
    clearRefundLogs()
  })

  describe('Signature Verification', () => {
    test('should accept valid signature format', () => {
      const message = 'MeeChain Refund Request for tx 0x19cea8...'
      const signature = '0x' + '1'.repeat(130)
      const userAddress = '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1'

      const isValid = verifySignature(message, signature, userAddress)
      expect(isValid).toBe(true)
    })

    test('should reject signature without 0x prefix', () => {
      const message = 'Test message'
      const signature = '1'.repeat(130)
      const userAddress = '0xUser'

      const isValid = verifySignature(message, signature, userAddress)
      expect(isValid).toBe(false)
    })

    test('should reject short signature', () => {
      const message = 'Test message'
      const signature = '0x123'
      const userAddress = '0xUser'

      const isValid = verifySignature(message, signature, userAddress)
      expect(isValid).toBe(false)
    })
  })

  describe('Process Refund Request', () => {
    test('should process valid refund request successfully', async () => {
      const request = {
        userAddress: '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
        txHash: '0x19cea8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c9877f3',
        amount: '0.0083595',
        signature: '0x' + '1'.repeat(130),
        message: 'MeeChain Refund Request for tx 0x19cea8...',
        contractAddress: '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F',
        reason: 'Replay failed'
      }

      const response = await processRefundRequest(request)

      expect(response.success).toBe(true)
      expect(response.refundId).toBe('ref_0x19cea8e8')
      expect(response.refundTxHash).toBeDefined()
      expect(response.refundTxHash).toMatch(/^0x[0-9a-f]{64}$/)
    })

    test('should reject invalid signature', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xInvalidSig',
        amount: '1.0',
        signature: '0x123', // Invalid signature
        message: 'Test',
        contractAddress: '0xContract'
      }

      const response = await processRefundRequest(request)

      expect(response.success).toBe(false)
      expect(response.error).toBe('Invalid signature')
    })

    test('should log refund request with IP and user agent', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxWithIP',
        amount: '1.0',
        signature: '0x' + '1'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract'
      }

      const mockReq = {
        ip: '203.0.113.42',
        headers: {
          'user-agent': 'MetaMask/Chrome'
        }
      }

      await processRefundRequest(request, mockReq)

      const logs = getRefundLogs()
      const log = logs.find(l => l.txHash === '0xTxWithIP')

      expect(log?.ip).toBe('203.0.113.42')
      expect(log?.userAgent).toBe('MetaMask/Chrome')
    })

    test('should handle missing IP and user agent gracefully', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxNoIP',
        amount: '1.0',
        signature: '0x' + '1'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract'
      }

      await processRefundRequest(request)

      const logs = getRefundLogs()
      const log = logs.find(l => l.txHash === '0xTxNoIP')

      expect(log?.ip).toBe('N/A')
      expect(log?.userAgent).toBe('N/A')
    })
  })

  describe('Handle Replay Failure Refund', () => {
    test('should process refund after replay failure', async () => {
      const response = await handleReplayFailureRefund(
        '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
        '0x19cea8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c9877f3',
        '0.0083595',
        3,
        '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F'
      )

      expect(response.success).toBe(true)
      expect(response.refundId).toBe('ref_0x19cea8e8')

      const logs = getRefundLogs()
      const log = logs.find(l => l.refundId === response.refundId)
      expect(log?.reason).toBe('Replay failed after 3 attempts')
    })

    test('should include retry count in reason', async () => {
      await handleReplayFailureRefund(
        '0xUser',
        '0xTxRetry',
        '1.0',
        5,
        '0xContract'
      )

      const logs = getRefundLogs()
      const log = logs.find(l => l.txHash === '0xTxRetry')
      expect(log?.reason).toBe('Replay failed after 5 attempts')
    })
  })

  describe('Batch Process Refunds', () => {
    test('should process multiple refund requests', async () => {
      const requests = [
        {
          userAddress: '0xUser1',
          txHash: '0xTx1',
          amount: '1.0',
          signature: '0x' + '1'.repeat(130),
          message: 'Test 1',
          contractAddress: '0xContract1'
        },
        {
          userAddress: '0xUser2',
          txHash: '0xTx2',
          amount: '2.0',
          signature: '0x' + '2'.repeat(130),
          message: 'Test 2',
          contractAddress: '0xContract2'
        },
        {
          userAddress: '0xUser3',
          txHash: '0xTx3',
          amount: '3.0',
          signature: '0x' + '3'.repeat(130),
          message: 'Test 3',
          contractAddress: '0xContract3'
        }
      ]

      const responses = await batchProcessRefunds(requests)

      expect(responses).toHaveLength(3)
      expect(responses.every(r => r.success)).toBe(true)
      expect(responses[0].refundId).toBe('ref_0xTx1')
      expect(responses[1].refundId).toBe('ref_0xTx2')
      expect(responses[2].refundId).toBe('ref_0xTx3')
    })

    test('should handle mixed valid and invalid requests', async () => {
      const requests = [
        {
          userAddress: '0xUser1',
          txHash: '0xTxValid',
          amount: '1.0',
          signature: '0x' + '1'.repeat(130), // Valid
          message: 'Test',
          contractAddress: '0xContract'
        },
        {
          userAddress: '0xUser2',
          txHash: '0xTxInvalid',
          amount: '2.0',
          signature: '0x123', // Invalid
          message: 'Test',
          contractAddress: '0xContract'
        }
      ]

      const responses = await batchProcessRefunds(requests)

      expect(responses).toHaveLength(2)
      expect(responses[0].success).toBe(true)
      expect(responses[1].success).toBe(false)
      expect(responses[1].error).toBe('Invalid signature')
    })

    test('should process empty batch without errors', async () => {
      const responses = await batchProcessRefunds([])
      expect(responses).toHaveLength(0)
    })
  })

  describe('Integration with Logger', () => {
    test('should create log entries for all refund requests', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxLog',
        amount: '1.0',
        signature: '0x' + '1'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract',
        reason: 'Integration test'
      }

      await processRefundRequest(request)

      const logs = getRefundLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0].txHash).toBe('0xTxLog')
      expect(logs[0].reason).toBe('Integration test')
    })

    test('should log failed signature verification', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxFailLog',
        amount: '1.0',
        signature: '0xinvalid',
        message: 'Test',
        contractAddress: '0xContract'
      }

      await processRefundRequest(request)

      const logs = getRefundLogs()
      const failedLog = logs.find(l => l.txHash === '0xTxFailLog')
      expect(failedLog?.status).toBe('failed')
      expect(failedLog?.notes).toContain('Signature verification failed')
    })
  })

  describe('Error Handling', () => {
    test('should handle errors gracefully', async () => {
      // This test verifies that errors don't crash the system
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxError',
        amount: '1.0',
        signature: '0x' + '1'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract'
      }

      const response = await processRefundRequest(request)
      
      // Should complete without throwing
      expect(response).toBeDefined()
      expect(response.refundId).toBe('ref_0xTxError')
    })
  })

  describe('Edge Cases', () => {
    test('should handle zero amount refund', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxZero',
        amount: '0',
        signature: '0x' + '1'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract'
      }

      const response = await processRefundRequest(request)
      expect(response.success).toBe(true)

      const logs = getRefundLogs()
      const log = logs.find(l => l.txHash === '0xTxZero')
      expect(log?.amount).toBe('0')
    })

    test('should handle very long transaction hashes', async () => {
      const longTxHash = '0x' + '1'.repeat(100)
      const request = {
        userAddress: '0xUser',
        txHash: longTxHash,
        amount: '1.0',
        signature: '0x' + '2'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract'
      }

      const response = await processRefundRequest(request)
      expect(response.success).toBe(true)
      expect(response.refundId).toBe(`ref_${longTxHash.slice(0, 10)}`)
    })

    test('should handle unicode characters in reason', async () => {
      const request = {
        userAddress: '0xUser',
        txHash: '0xTxUnicode',
        amount: '1.0',
        signature: '0x' + '1'.repeat(130),
        message: 'Test',
        contractAddress: '0xContract',
        reason: 'เหตุผล: การทำ replay ล้มเหลว 🔄'
      }

      const response = await processRefundRequest(request)
      expect(response.success).toBe(true)

      const logs = getRefundLogs()
      const log = logs.find(l => l.txHash === '0xTxUnicode')
      expect(log?.reason).toBe('เหตุผล: การทำ replay ล้มเหลว 🔄')
    })
  })
})
