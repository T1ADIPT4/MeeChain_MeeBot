/**
 * Reward Exporter for MeeChain
 * Exports reward logs to files for backup and analytics
 */

import { getAllRewards, getRewardStats } from './RewardTracker.js'
import { getLogs } from '../src/utils/logger.js'
import { logEvent } from '../src/utils/logger.js'

/**
 * Export reward log to a JSON string
 * @returns JSON string containing all rewards and statistics
 */
export function exportRewardLogToJSON(): string {
  const rewards = getAllRewards()
  const stats = getRewardStats()
  const systemLogs = getLogs()

  const exportData = {
    exportedAt: new Date().toISOString(),
    statistics: stats,
    rewards,
    systemLogs: systemLogs.map((log) => ({
      ...log,
      timestamp: log.timestamp.toISOString(),
    })),
  }

  logEvent('reward-log-exported', {
    rewardCount: rewards.length,
    stats,
  })

  return JSON.stringify(exportData, null, 2)
}

/**
 * Export reward log to a file (Node.js environment)
 * @param filepath - Path where the log should be saved
 */
export async function exportRewardLog(filepath: string): Promise<void> {
  const fs = await import('fs/promises')
  const path = await import('path')

  const logData = exportRewardLogToJSON()
  
  // Ensure directory exists
  const dir = path.dirname(filepath)
  await fs.mkdir(dir, { recursive: true })
  
  await fs.writeFile(filepath, logData, 'utf-8')
  
  logEvent('reward-log-saved', {
    filepath,
    size: logData.length,
  })
  
  console.log(`📤 Reward log exported to ${filepath}`)
}

/**
 * Export rewards as CSV format
 * @returns CSV string of all rewards
 */
export function exportRewardLogToCSV(): string {
  const rewards = getAllRewards()
  
  const headers = ['userId', 'questId', 'badgeId', 'timestamp', 'fallbackUsed', 'txHash', 'chain']
  const rows = rewards.map((r) => [
    r.userId,
    r.questId,
    r.badgeId,
    new Date(r.timestamp).toISOString(),
    r.fallbackUsed.toString(),
    r.txHash || '',
    r.chain || '',
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  logEvent('reward-log-exported-csv', {
    rewardCount: rewards.length,
  })

  return csv
}

/**
 * Export reward log as CSV to a file
 * @param filepath - Path where the CSV should be saved
 */
export async function exportRewardLogCSV(filepath: string): Promise<void> {
  const fs = await import('fs/promises')
  const path = await import('path')

  const csvData = exportRewardLogToCSV()
  
  // Ensure directory exists
  const dir = path.dirname(filepath)
  await fs.mkdir(dir, { recursive: true })
  
  await fs.writeFile(filepath, csvData, 'utf-8')
  
  logEvent('reward-log-saved-csv', {
    filepath,
    size: csvData.length,
  })
  
  console.log(`📤 Reward log (CSV) exported to ${filepath}`)
}
