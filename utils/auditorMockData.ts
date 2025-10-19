/**
 * Mock Data for Auditor Dashboard
 * Provides sample data for testing and demonstration
 */

import { createRefundLog, submitFlag, validateFlag, completeReview } from '../src/services/auditorService.js'
import type { RefundLog } from '../src/types/auditor.js'

/**
 * Initialize mock refund logs
 */
export async function initializeMockData(): Promise<void> {
  // Create sample refund logs
  const logs: Omit<RefundLog, 'id' | 'flagged'>[] = [
    {
      requester: '0x883A1f8126f6170e7100a05b0e6b2ba42C2f90B2',
      status: 'success',
      confirmationTime: new Date('2025-10-18T10:30:00Z'),
      refundTx: '0xabc123def456789012345678901234567890abcd',
      amount: '100 MEE',
      chain: 'polygon'
    },
    {
      requester: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb6',
      status: 'success',
      confirmationTime: new Date('2025-10-17T14:20:00Z'),
      refundTx: '0xdef456abc789012345678901234567890abcdef1',
      amount: '250 MEE',
      chain: 'ethereum'
    },
    {
      requester: '0x9A8f8C6dB5c7a3b2D1e0F9C8B7A6D5E4F3C2B1A0',
      status: 'success',
      confirmationTime: new Date('2025-10-16T09:15:00Z'),
      refundTx: '0x123abc456def789012345678901234567890abcd',
      amount: '500 MEE',
      chain: 'arbitrum'
    },
    {
      requester: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'failed',
      confirmationTime: new Date('2025-10-15T16:45:00Z'),
      refundTx: '0x',
      amount: '75 MEE',
      chain: 'polygon'
    },
    {
      requester: '0xabcdef1234567890abcdef1234567890abcdef12',
      status: 'success',
      confirmationTime: new Date('2025-10-14T11:00:00Z'),
      refundTx: '0x789def123abc456789012345678901234567890a',
      amount: '150 MEE',
      chain: 'ethereum'
    }
  ]

  // Create refund logs
  const createdLogs = logs.map(log => createRefundLog(log))
  
  // Create some flags
  const auditor1 = '0xAuditor123456789012345678901234567890AB'
  const auditor2 = '0xAuditor987654321098765432109876543210DC'
  
  // Flag the first log
  submitFlag(
    createdLogs[0].id,
    auditor1,
    'Unusual transaction pattern - multiple refunds from same address within 24 hours'
  )
  
  // Validate the flag
  await validateFlag(createdLogs[0].id, auditor1, true)
  
  // Complete a review
  await completeReview(
    createdLogs[1].id,
    auditor1,
    'Transaction verified successfully. All signatures valid.'
  )
  
  // Another review
  await completeReview(
    createdLogs[2].id,
    auditor2,
    'Refund amount matches original transaction. Approved.'
  )
  
  console.log('✅ Mock auditor data initialized')
  console.log(`   - Created ${createdLogs.length} refund logs`)
  console.log(`   - Created 1 flag`)
  console.log(`   - Completed 2 reviews`)
}

/**
 * Get sample auditor addresses for testing
 */
export function getSampleAuditors(): string[] {
  return [
    '0xAuditor123456789012345678901234567890AB',
    '0xAuditor987654321098765432109876543210DC',
    '0xAuditor456789012345678901234567890ABCDEF'
  ]
}
