/**
 * In-memory database for refund logs and flags
 * In production, this would be replaced with a real database (MongoDB, PostgreSQL, etc.)
 */

import { RefundLog, RefundFlag } from './types.js';

// In-memory storage
const refundLogs: RefundLog[] = [];
const refundFlags: RefundFlag[] = [];

// Initialize with some sample data
function initializeSampleData() {
  const sampleLogs: RefundLog[] = [
    {
      refundId: 'ref_abc123',
      userAddress: '0x883A1234567890abcdef1234567890abcdef1234',
      txHash: '0xabc123def456789012345678901234567890123456789012345678901234567890',
      amount: '0.0083595',
      reason: 'Replay failed',
      status: 'success',
      verifiedAt: '2025-10-18T13:35:00.000Z',
      signatureValid: true,
      executedBy: 'MeeBot',
      notes: 'Auto-refund after 3 retries',
      createdAt: '2025-10-18T13:30:00.000Z',
    },
    {
      refundId: 'ref_xyz789',
      userAddress: '0x9fB21234567890abcdef1234567890abcdef1234',
      txHash: null,
      amount: '0.0125000',
      reason: 'Transaction timeout',
      status: 'failed',
      verifiedAt: '2025-10-18T14:20:00.000Z',
      signatureValid: false,
      executedBy: 'MeeBot',
      notes: 'Signature verification failed',
      createdAt: '2025-10-18T14:15:00.000Z',
    },
    {
      refundId: 'ref_def456',
      userAddress: '0x1234567890abcdef1234567890abcdef12345678',
      txHash: '0xdef456abc789012345678901234567890123456789012345678901234567890123',
      amount: '0.0095000',
      reason: 'Network congestion',
      status: 'success',
      verifiedAt: '2025-10-19T10:15:00.000Z',
      signatureValid: true,
      executedBy: 'MeeBot',
      notes: 'Auto-refund successful',
      createdAt: '2025-10-19T10:10:00.000Z',
    },
  ];

  refundLogs.push(...sampleLogs);
}

// Initialize sample data on module load
initializeSampleData();

export const db = {
  refundLogs: {
    getAll(): RefundLog[] {
      return [...refundLogs];
    },
    getById(refundId: string): RefundLog | undefined {
      return refundLogs.find(log => log.refundId === refundId);
    },
    search(query: string): RefundLog[] {
      const lowerQuery = query.toLowerCase();
      return refundLogs.filter(
        log =>
          log.userAddress.toLowerCase().includes(lowerQuery) ||
          log.refundId.toLowerCase().includes(lowerQuery) ||
          (log.txHash && log.txHash.toLowerCase().includes(lowerQuery))
      );
    },
    filterByDateRange(startDate: string, endDate: string): RefundLog[] {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return refundLogs.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate >= start && logDate <= end;
      });
    },
    add(log: RefundLog): RefundLog {
      refundLogs.push(log);
      return log;
    },
  },
  refundFlags: {
    getAll(): RefundFlag[] {
      return [...refundFlags];
    },
    getByRefundId(refundId: string): RefundFlag[] {
      return refundFlags.filter(flag => flag.refundId === refundId);
    },
    add(flag: RefundFlag): RefundFlag {
      refundFlags.push(flag);
      return flag;
    },
  },
};
