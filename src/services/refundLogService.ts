/**
 * Refund Log Service
 * Manages refund flags and their confirmation status
 */

import { recordAction } from './contributorReputationService';
import { logEvent } from '../utils/logger';

export type FlagStatus = 'pending' | 'approved' | 'rejected';

export interface RefundFlag {
  refundId: string;
  requester: string;
  transaction: string;
  reason: string;
  status: FlagStatus;
  flaggedBy: string;
  flaggedAt: Date;
  confirmedBy?: string;
  confirmedAt?: Date;
  notes?: string;
  signatureVerified: boolean;
}

// In-memory storage (can be replaced with database)
const refundFlags = new Map<string, RefundFlag>();

/**
 * Create a new refund flag
 */
export function createFlag(
  refundId: string,
  requester: string,
  transaction: string,
  reason: string,
  flaggedBy: string,
  signatureVerified: boolean = false
): RefundFlag {
  const flag: RefundFlag = {
    refundId,
    requester,
    transaction,
    reason,
    status: 'pending',
    flaggedBy,
    flaggedAt: new Date(),
    signatureVerified
  };
  
  refundFlags.set(refundId, flag);
  
  // Record action for contributor reputation
  recordAction(flaggedBy, 'flag_created', {
    refundId,
    transaction,
    reason
  });
  
  // Log the event
  logEvent('refund-flag-created', {
    refundId,
    requester,
    transaction,
    flaggedBy
  }, 'info');
  
  return flag;
}

/**
 * Confirm (approve or reject) a refund flag
 */
export function confirmFlag(
  refundId: string,
  approved: boolean,
  confirmedBy: string,
  notes?: string
): RefundFlag | null {
  const flag = refundFlags.get(refundId);
  
  if (!flag) {
    return null;
  }
  
  // Update flag status
  flag.status = approved ? 'approved' : 'rejected';
  flag.confirmedBy = confirmedBy;
  flag.confirmedAt = new Date();
  flag.notes = notes;
  
  // Record action for the original flagger
  const actionType = approved ? 'flag_validated' : 'flag_rejected';
  recordAction(flag.flaggedBy, actionType, {
    refundId,
    confirmedBy,
    notes
  });
  
  // Log the event
  logEvent('refund-flag-confirmed', {
    refundId,
    approved,
    confirmedBy,
    flaggedBy: flag.flaggedBy,
    notes
  }, 'info');
  
  return flag;
}

/**
 * Get a refund flag by ID
 */
export function getFlag(refundId: string): RefundFlag | null {
  return refundFlags.get(refundId) || null;
}

/**
 * Get all refund flags
 */
export function getAllFlags(): RefundFlag[] {
  return Array.from(refundFlags.values());
}

/**
 * Get flags by status
 */
export function getFlagsByStatus(status: FlagStatus): RefundFlag[] {
  return Array.from(refundFlags.values()).filter(flag => flag.status === status);
}

/**
 * Get flags by flagger
 */
export function getFlagsByFlagger(flaggedBy: string): RefundFlag[] {
  return Array.from(refundFlags.values()).filter(flag => flag.flaggedBy === flaggedBy);
}

/**
 * Export flags to CSV format
 */
export function exportToCSV(): string {
  const headers = [
    'Refund ID',
    'Requester',
    'Transaction',
    'Reason',
    'Status',
    'Flagged By',
    'Flagged At',
    'Confirmed By',
    'Confirmed At',
    'Signature Verified',
    'Notes'
  ];
  
  const rows = Array.from(refundFlags.values()).map(flag => [
    flag.refundId,
    flag.requester,
    flag.transaction,
    flag.reason,
    flag.status,
    flag.flaggedBy,
    flag.flaggedAt.toISOString(),
    flag.confirmedBy || '',
    flag.confirmedAt?.toISOString() || '',
    flag.signatureVerified ? 'Yes' : 'No',
    flag.notes || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Clear all flags (for testing)
 */
export function clearAllFlags(): void {
  refundFlags.clear();
}
