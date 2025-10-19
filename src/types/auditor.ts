/**
 * Auditor Dashboard Types
 * Types and interfaces for the Auditor Dashboard, Reputation System, and Badge System
 */

export interface Reputation {
  user: string
  score: number
  flags: number
  reviews: number
  lastUpdated: Date
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlockedAt?: Date
}

export interface RefundLog {
  id: string
  requester: string
  status: 'success' | 'failed' | 'flagged'
  confirmationTime: Date
  refundTx: string
  flagged: boolean
  flagReason?: string
  flaggedBy?: string
  flaggedAt?: Date
  amount?: string
  chain?: string
}

export interface AuditorAction {
  auditor: string
  action: 'flag_validated' | 'review_completed'
  timestamp: Date
  relatedLogId: string
  points: number
}

export interface FlagSubmission {
  logId: string
  auditor: string
  reason: string
  timestamp: Date
  validated: boolean
}

export type ReputationAction = 'flag_validated' | 'review_completed'

export interface BadgeRule {
  id: string
  name: string
  icon: string
  description: string
  condition: (reputation: Reputation) => boolean
}
