/**
 * Auditor Service
 * Manages refund logs, flags, and auditor actions
 */

import type { RefundLog, FlagSubmission } from '../types/auditor.js'
import { logEvent } from '../utils/logger.js'
import { updateReputation, getReputation } from './reputationService.js'
import { checkAndUnlockBadges } from './badgeService.js'

// In-memory stores for demo (in production, these would be database collections)
const refundLogsStore: Map<string, RefundLog> = new Map()
const flagSubmissionsStore: Map<string, FlagSubmission[]> = new Map()

/**
 * Create a new refund log entry
 */
export function createRefundLog(log: Omit<RefundLog, 'id' | 'flagged'>): RefundLog {
  const id = `refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const refundLog: RefundLog = {
    ...log,
    id,
    flagged: false
  }
  
  refundLogsStore.set(id, refundLog)
  
  logEvent('refund-log-created', {
    logId: id,
    requester: log.requester,
    status: log.status,
    refundTx: log.refundTx
  })
  
  return refundLog
}

/**
 * Get all refund logs
 */
export function getRefundLogs(filters?: {
  status?: RefundLog['status']
  flagged?: boolean
  requester?: string
  startDate?: Date
  endDate?: Date
}): RefundLog[] {
  let logs = Array.from(refundLogsStore.values())
  
  if (filters) {
    if (filters.status) {
      logs = logs.filter(log => log.status === filters.status)
    }
    if (filters.flagged !== undefined) {
      logs = logs.filter(log => log.flagged === filters.flagged)
    }
    if (filters.requester) {
      logs = logs.filter(log => 
        log.requester.toLowerCase().includes(filters.requester!.toLowerCase())
      )
    }
    if (filters.startDate) {
      logs = logs.filter(log => log.confirmationTime >= filters.startDate!)
    }
    if (filters.endDate) {
      logs = logs.filter(log => log.confirmationTime <= filters.endDate!)
    }
  }
  
  return logs.sort((a, b) => b.confirmationTime.getTime() - a.confirmationTime.getTime())
}

/**
 * Get a specific refund log by ID
 */
export function getRefundLog(logId: string): RefundLog | null {
  return refundLogsStore.get(logId) || null
}

/**
 * Submit a flag for a refund log
 */
export function submitFlag(
  logId: string,
  auditorAddress: string,
  reason: string
): FlagSubmission {
  const log = refundLogsStore.get(logId)
  if (!log) {
    throw new Error(`Refund log ${logId} not found`)
  }
  
  const flag: FlagSubmission = {
    logId,
    auditor: auditorAddress,
    reason,
    timestamp: new Date(),
    validated: false
  }
  
  // Add flag to store
  const existingFlags = flagSubmissionsStore.get(logId) || []
  existingFlags.push(flag)
  flagSubmissionsStore.set(logId, existingFlags)
  
  // Update log to mark as flagged
  log.flagged = true
  log.flagReason = reason
  log.flaggedBy = auditorAddress
  log.flaggedAt = new Date()
  log.status = 'flagged'
  refundLogsStore.set(logId, log)
  
  logEvent('refund-log-flagged', {
    logId,
    auditor: auditorAddress,
    reason
  })
  
  return flag
}

/**
 * Validate a flag (by DAO or Core Team)
 */
export async function validateFlag(
  logId: string,
  auditorAddress: string,
  isValid: boolean
): Promise<void> {
  const flags = flagSubmissionsStore.get(logId) || []
  const flag = flags.find(f => f.auditor === auditorAddress)
  
  if (!flag) {
    throw new Error(`Flag not found for log ${logId} and auditor ${auditorAddress}`)
  }
  
  flag.validated = isValid
  
  if (isValid) {
    // Award reputation points for validated flag
    await updateReputation(auditorAddress, 'flag_validated')
    
    // Check and unlock badges
    const reputation = getReputation(auditorAddress)
    const newBadges = checkAndUnlockBadges(auditorAddress, reputation)
    
    logEvent('flag-validated', {
      logId,
      auditor: auditorAddress,
      newBadges: newBadges.map(b => b.name)
    })
  } else {
    logEvent('flag-rejected', {
      logId,
      auditor: auditorAddress
    })
  }
}

/**
 * Complete a review
 */
export async function completeReview(
  logId: string,
  auditorAddress: string,
  notes?: string
): Promise<void> {
  const log = refundLogsStore.get(logId)
  if (!log) {
    throw new Error(`Refund log ${logId} not found`)
  }
  
  // Award reputation points for completed review
  await updateReputation(auditorAddress, 'review_completed')
  
  // Check and unlock badges
  const reputation = getReputation(auditorAddress)
  const newBadges = checkAndUnlockBadges(auditorAddress, reputation)
  
  logEvent('review-completed', {
    logId,
    auditor: auditorAddress,
    notes,
    newBadges: newBadges.map(b => b.name)
  })
}

/**
 * Get flags for a specific log
 */
export function getFlagsForLog(logId: string): FlagSubmission[] {
  return flagSubmissionsStore.get(logId) || []
}

/**
 * Get all flags submitted by an auditor
 */
export function getFlagsByAuditor(auditorAddress: string): FlagSubmission[] {
  const allFlags: FlagSubmission[] = []
  
  for (const flags of flagSubmissionsStore.values()) {
    allFlags.push(...flags.filter(f => f.auditor === auditorAddress))
  }
  
  return allFlags.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
