/**
 * Transaction types for MeeBot Replay & Supply flow
 */

export type TransactionStatus = 'pending' | 'replayed' | 'supplied' | 'failed' | 'refunded';

export type UserRole = 'User' | 'Supplier' | 'RecoveryAgent' | 'Auditor';

export interface Transaction {
  id: string;
  address: string;
  amount: string;
  token: string; // e.g., 'BNB', 'ETH'
  timestamp: Date;
  status: TransactionStatus;
  replayAttempts: number;
  supplyDestination?: string;
  triggerBy?: string;
  txHash?: string;
  error?: string;
}

export interface TransactionLog {
  timestamp: Date;
  action: string;
  status: TransactionStatus;
  details?: string;
  triggeredBy?: string;
}

export interface UserPermissions {
  role: UserRole;
  canSupply: boolean;
  canRefund: boolean;
  canViewLogs: boolean;
  canTriggerActions: boolean;
}

/**
 * Get user permissions based on role
 */
export function getUserPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'User':
      return {
        role,
        canSupply: false,
        canRefund: false,
        canViewLogs: false,
        canTriggerActions: false,
      };
    case 'Supplier':
      return {
        role,
        canSupply: true,
        canRefund: false,
        canViewLogs: true,
        canTriggerActions: true,
      };
    case 'RecoveryAgent':
      return {
        role,
        canSupply: false,
        canRefund: true,
        canViewLogs: true,
        canTriggerActions: true,
      };
    case 'Auditor':
      return {
        role,
        canSupply: false,
        canRefund: false,
        canViewLogs: true,
        canTriggerActions: false,
      };
    default:
      return {
        role: 'User',
        canSupply: false,
        canRefund: false,
        canViewLogs: false,
        canTriggerActions: false,
      };
  }
}
