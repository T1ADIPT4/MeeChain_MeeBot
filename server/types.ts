/**
 * Types for Auditor Dashboard and Refund Log System
 */

export interface RefundLog {
  refundId: string;
  userAddress: string;
  txHash: string | null;
  amount: string;
  reason: string;
  status: 'success' | 'failed' | 'pending';
  verifiedAt: string;
  signatureValid: boolean;
  executedBy: string;
  notes: string;
  createdAt: string;
}

export interface RefundFlag {
  id: string;
  refundId: string;
  reason: string;
  flaggedBy: string;
  flaggedAt: string;
}

export interface FlagRequest {
  refundId: string;
  reason: string;
  flaggedBy: string;
}

export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}
