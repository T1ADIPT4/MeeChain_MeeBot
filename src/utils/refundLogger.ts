/**
 * Refund Logger utility for MeeChain
 * Comprehensive logging and audit trail system for refund operations
 * Tracks all refund requests with signature verification and metadata
 */

import * as fs from 'fs'
import * as path from 'path'

export interface RefundLogEntry {
  refundId: string
  userAddress: string
  txHash: string
  amount: string
  status: 'pending' | 'success' | 'failed'
  signature: string
  messageSigned: string
  verifiedBy: string
  verifiedAt: string
  executedBy: string
  refundTxHash: string
  contractAddress: string
  reason: string
  ip: string
  userAgent: string
  notes: string
}

// In-memory log storage (can be replaced with MongoDB or PostgreSQL)
const refundLogs: RefundLogEntry[] = []

// Path to refund logs directory
const REFUND_LOGS_DIR = path.join(process.cwd(), 'logs', 'refunds')

/**
 * Ensure refund logs directory exists
 */
function ensureRefundLogsDir(): void {
  try {
    if (!fs.existsSync(REFUND_LOGS_DIR)) {
      fs.mkdirSync(REFUND_LOGS_DIR, { recursive: true })
    }
  } catch (error) {
    console.warn('Could not create refund logs directory:', error)
  }
}

/**
 * Write refund log to file
 * @param logEntry - Refund log entry to write
 */
function writeRefundLogToFile(logEntry: RefundLogEntry): void {
  try {
    ensureRefundLogsDir()

    const dateStr = new Date().toISOString().split('T')[0]
    const fileName = `refund-${dateStr}.log`
    const logFilePath = path.join(REFUND_LOGS_DIR, fileName)

    // Format log entry for file
    const logLine = `[${logEntry.verifiedAt}] [${logEntry.status.toUpperCase()}]\n` +
                    `Refund ID: ${logEntry.refundId}\n` +
                    `User: ${logEntry.userAddress}\n` +
                    `Tx Hash: ${logEntry.txHash}\n` +
                    `Amount: ${logEntry.amount}\n` +
                    `Reason: ${logEntry.reason}\n` +
                    `Refund Tx: ${logEntry.refundTxHash}\n` +
                    `Notes: ${logEntry.notes}\n` +
                    JSON.stringify(logEntry, null, 2) + '\n\n' +
                    '='.repeat(80) + '\n\n'

    fs.appendFileSync(logFilePath, logLine, 'utf-8')
  } catch (error) {
    console.warn('Could not write refund log to file:', error)
  }
}

/**
 * Log a refund action
 * @param data - Refund action data
 * @returns The created log entry
 */
export async function logRefundAction(data: {
  userAddress: string
  txHash: string
  amount: string
  status?: 'pending' | 'success' | 'failed'
  signature: string
  message: string
  executedBy: string
  refundTxHash?: string
  contractAddress: string
  reason?: string
  ip?: string
  userAgent?: string
  notes?: string
}): Promise<RefundLogEntry> {
  const refundId = `ref_${data.txHash.slice(0, 10)}`
  
  const logEntry: RefundLogEntry = {
    refundId,
    userAddress: data.userAddress,
    txHash: data.txHash,
    amount: data.amount,
    status: data.status || 'pending',
    signature: data.signature,
    messageSigned: data.message,
    verifiedBy: 'MeeBot',
    verifiedAt: new Date().toISOString(),
    executedBy: data.executedBy,
    refundTxHash: data.refundTxHash || '',
    contractAddress: data.contractAddress,
    reason: data.reason || 'N/A',
    ip: data.ip || 'N/A',
    userAgent: data.userAgent || 'N/A',
    notes: data.notes || ''
  }

  // Store in memory
  refundLogs.push(logEntry)

  // Write to file
  writeRefundLogToFile(logEntry)

  // Console output
  const emoji = logEntry.status === 'success' ? '✅' : 
                logEntry.status === 'failed' ? '❌' : '⏳'
  console.log(
    `${emoji} [${logEntry.verifiedAt}] Refund ${logEntry.status}:`,
    JSON.stringify({
      refundId: logEntry.refundId,
      user: logEntry.userAddress,
      amount: logEntry.amount,
      reason: logEntry.reason
    }, null, 2)
  )

  return logEntry
}

/**
 * Update refund log status
 * @param refundId - Refund ID to update
 * @param status - New status
 * @param refundTxHash - Optional transaction hash of the refund
 */
export function updateRefundStatus(
  refundId: string,
  status: 'success' | 'failed',
  refundTxHash?: string
): void {
  const logEntry = refundLogs.find(log => log.refundId === refundId)
  if (logEntry) {
    logEntry.status = status
    if (refundTxHash) {
      logEntry.refundTxHash = refundTxHash
    }
    writeRefundLogToFile(logEntry)
  }
}

/**
 * Get all refund logs
 * @returns Array of all refund log entries
 */
export function getRefundLogs(): RefundLogEntry[] {
  return [...refundLogs]
}

/**
 * Get refund logs filtered by user address
 * @param userAddress - User address to filter by
 * @returns Filtered array of refund log entries
 */
export function getRefundLogsByUser(userAddress: string): RefundLogEntry[] {
  return refundLogs.filter(log => 
    log.userAddress.toLowerCase() === userAddress.toLowerCase()
  )
}

/**
 * Get refund logs filtered by status
 * @param status - Status to filter by
 * @returns Filtered array of refund log entries
 */
export function getRefundLogsByStatus(status: 'pending' | 'success' | 'failed'): RefundLogEntry[] {
  return refundLogs.filter(log => log.status === status)
}

/**
 * Get refund log by transaction hash
 * @param txHash - Transaction hash to search for
 * @returns Refund log entry or undefined
 */
export function getRefundLogByTxHash(txHash: string): RefundLogEntry | undefined {
  return refundLogs.find(log => log.txHash === txHash)
}

/**
 * Get refund log by refund ID
 * @param refundId - Refund ID to search for
 * @returns Refund log entry or undefined
 */
export function getRefundLogById(refundId: string): RefundLogEntry | undefined {
  return refundLogs.find(log => log.refundId === refundId)
}

/**
 * Export refund logs to JSON
 * @param filePath - Optional file path to write to
 * @returns JSON string of all refund logs
 */
export function exportRefundLogsToJSON(filePath?: string): string {
  const json = JSON.stringify(refundLogs, null, 2)
  
  if (filePath) {
    try {
      ensureRefundLogsDir()
      fs.writeFileSync(filePath, json, 'utf-8')
    } catch (error) {
      console.warn('Could not write JSON export:', error)
    }
  }
  
  return json
}

/**
 * Export refund logs to CSV
 * @param filePath - Optional file path to write to
 * @returns CSV string of all refund logs
 */
export function exportRefundLogsToCSV(filePath?: string): string {
  const headers = [
    'Refund ID',
    'User Address',
    'Tx Hash',
    'Amount',
    'Status',
    'Reason',
    'Verified At',
    'Refund Tx Hash',
    'Contract Address',
    'Notes'
  ]
  
  const rows = refundLogs.map(log => [
    log.refundId,
    log.userAddress,
    log.txHash,
    log.amount,
    log.status,
    log.reason,
    log.verifiedAt,
    log.refundTxHash,
    log.contractAddress,
    log.notes
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  if (filePath) {
    try {
      ensureRefundLogsDir()
      fs.writeFileSync(filePath, csv, 'utf-8')
    } catch (error) {
      console.warn('Could not write CSV export:', error)
    }
  }
  
  return csv
}

/**
 * Clear all refund logs (for testing)
 */
export function clearRefundLogs(): void {
  refundLogs.length = 0
}
