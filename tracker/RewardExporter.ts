/**
 * Reward Exporter for MeeChain
 * Exports reward logs to files or external systems
 */

import { getAllRewards, RewardRecord } from './RewardTracker.js'

/**
 * Export reward log to a JSON file
 * @param filepath - Path to export the log to
 * @returns Success status and exported data
 */
export function exportRewardLog(filepath: string): { 
  success: boolean
  filepath: string
  records: RewardRecord[]
  count: number
} {
  const rewards = getAllRewards()
  
  console.log(`📤 Exporting ${rewards.length} reward records to ${filepath}`)
  
  // In production, this would write to filesystem using fs.writeFileSync
  // For now, we'll just return the data structure
  
  return {
    success: true,
    filepath,
    records: rewards,
    count: rewards.length
  }
}

/**
 * Export reward statistics
 * @returns Aggregated reward statistics
 */
export function exportRewardStats(): {
  totalRewards: number
  totalUsers: number
  fallbackRate: number
  rewardsByQuest: Record<string, number>
} {
  const rewards = getAllRewards()
  const totalRewards = rewards.length
  const uniqueUsers = new Set(rewards.map((r) => r.userId)).size
  const fallbackCount = rewards.filter((r) => r.fallbackUsed).length
  const fallbackRate = totalRewards > 0 ? fallbackCount / totalRewards : 0
  
  const rewardsByQuest = rewards.reduce((acc, r) => {
    acc[r.questId] = (acc[r.questId] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalRewards,
    totalUsers: uniqueUsers,
    fallbackRate,
    rewardsByQuest
  }
}
