/**
 * Refund Log Model for MeeChain Singapore
 * Tracks refund transactions and their verification status
 */

export interface RefundLog {
  refundId: string
  userAddress: string
  txHash: string
  amount: string
  status: 'pending' | 'verified' | 'refunded' | 'failed'
  verifiedAt?: string
  refundTxHash?: string
  reason?: string
  executedBy?: string
  createdAt: string
  updatedAt: string
}

export interface RefundFlag {
  refundId: string
  reason: string
  flaggedBy: string
  flaggedAt: string
  status: 'open' | 'resolved' | 'dismissed'
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
}

// In-memory storage for demo purposes
// In production, this would be replaced with MongoDB or another database
const refundLogs: RefundLog[] = []
const refundFlags: RefundFlag[] = []

/**
 * Get all refund logs
 */
export function getAllRefundLogs(): RefundLog[] {
  return [...refundLogs]
}

/**
 * Get refund log by ID
 */
export function getRefundLogById(refundId: string): RefundLog | undefined {
  return refundLogs.find(log => log.refundId === refundId)
}

/**
 * Add a new refund log
 */
export function addRefundLog(log: RefundLog): RefundLog {
  refundLogs.push(log)
  return log
}

/**
 * Update refund log
 */
export function updateRefundLog(refundId: string, updates: Partial<RefundLog>): RefundLog | undefined {
  const index = refundLogs.findIndex(log => log.refundId === refundId)
  if (index === -1) return undefined
  
  refundLogs[index] = {
    ...refundLogs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  return refundLogs[index]
}

/**
 * Get all refund flags
 */
export function getAllRefundFlags(): RefundFlag[] {
  return [...refundFlags]
}

/**
 * Get flags for a specific refund
 */
export function getFlagsByRefundId(refundId: string): RefundFlag[] {
  return refundFlags.filter(flag => flag.refundId === refundId)
}

/**
 * Add a new refund flag
 */
export function addRefundFlag(flag: RefundFlag): RefundFlag {
  refundFlags.push(flag)
  return flag
}

/**
 * Update refund flag
 */
export function updateRefundFlag(refundId: string, flaggedBy: string, updates: Partial<RefundFlag>): RefundFlag | undefined {
  const index = refundFlags.findIndex(flag => 
    flag.refundId === refundId && flag.flaggedBy === flaggedBy
  )
  if (index === -1) return undefined
  
  refundFlags[index] = {
    ...refundFlags[index],
    ...updates
  }
  return refundFlags[index]
}

/**
 * Initialize with sample data for testing
 */
export function initializeSampleData(): void {
  // Clear existing data
  refundLogs.length = 0
  refundFlags.length = 0
  
  // Add sample refund logs
  const sampleLogs: RefundLog[] = [
    {
      refundId: 'refund-001',
      userAddress: '0x883AD20a1B9F8DE54C088B6c85329EE9fA58cf33',
      txHash: '0xabc123def456...',
      amount: '1.5',
      status: 'verified',
      verifiedAt: '2025-10-18T13:35:00Z',
      refundTxHash: '0xrefund123...',
      reason: 'Replay failed',
      executedBy: '0xValidator001',
      createdAt: '2025-10-18T13:00:00Z',
      updatedAt: '2025-10-18T13:35:00Z'
    },
    {
      refundId: 'refund-002',
      userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
      txHash: '0xdef789ghi012...',
      amount: '2.3',
      status: 'refunded',
      verifiedAt: '2025-10-17T09:20:00Z',
      refundTxHash: '0xrefund456...',
      reason: 'Transaction timeout',
      executedBy: '0xValidator002',
      createdAt: '2025-10-17T08:00:00Z',
      updatedAt: '2025-10-17T09:45:00Z'
    },
    {
      refundId: 'refund-003',
      userAddress: '0x1234567890abcdef1234567890abcdef12345678',
      txHash: '0xjkl345mno678...',
      amount: '0.8',
      status: 'pending',
      reason: 'Smart contract error',
      createdAt: '2025-10-19T15:00:00Z',
      updatedAt: '2025-10-19T15:00:00Z'
    }
  ]
  
  sampleLogs.forEach(log => addRefundLog(log))
  
  // Add sample flags
  const sampleFlags: RefundFlag[] = [
    {
      refundId: 'refund-003',
      reason: 'Suspicious transaction pattern',
      flaggedBy: '0xAuditor001',
      flaggedAt: '2025-10-19T16:00:00Z',
      status: 'open'
    }
  ]
  
  sampleFlags.forEach(flag => addRefundFlag(flag))
}
