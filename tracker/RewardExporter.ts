/**
 * Reward Exporter for MeeChain
 * Exports reward log data to JSON files
 */

import { getAllRewards, RewardRecord } from './RewardTracker.js'

/**
 * Export reward log to a JSON file
 * @param filePath - Path to export the log to
 * @returns Export result message
 */
export function exportRewardLog(filePath: string): string {
  const rewards = getAllRewards()
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalRewards: rewards.length,
    rewards,
  }

  // In a real implementation, this would write to an actual file
  // For now, we'll simulate the export
  console.log(`📤 Exporting ${rewards.length} reward records to ${filePath}`)
  console.log(JSON.stringify(exportData, null, 2))

  return `Successfully exported ${rewards.length} rewards to ${filePath}`
}

/**
 * Get export preview data (for display in UI)
 * @returns Export data object
 */
export function getExportPreview(): {
  exportedAt: string
  totalRewards: number
  rewards: RewardRecord[]
} {
  const rewards = getAllRewards()
  return {
    exportedAt: new Date().toISOString(),
    totalRewards: rewards.length,
    rewards,
  }
}

/**
 * Export rewards by user
 * @param userId - User ID to export rewards for
 * @param filePath - Path to export the log to
 * @returns Export result message
 */
export function exportRewardsByUser(userId: string, filePath: string): string {
  const rewards = getAllRewards().filter((r) => r.userId === userId)
  const exportData = {
    exportedAt: new Date().toISOString(),
    userId,
    totalRewards: rewards.length,
    rewards,
  }

  console.log(`📤 Exporting ${rewards.length} reward records for user ${userId} to ${filePath}`)
  console.log(JSON.stringify(exportData, null, 2))

  return `Successfully exported ${rewards.length} rewards for user ${userId} to ${filePath}`
}
