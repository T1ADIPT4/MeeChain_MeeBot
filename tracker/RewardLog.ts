/**
 * Reward Log and Telemetry for MeeChain
 * Provides analytics and export functionality for reward tracking
 */

import { getAllRewards, getUserRewards, getFallbackRewardsCount, getPrimaryRewardsCount } from './RewardTracker.js'
import type { RewardRecord } from './RewardTracker.js'

export interface RewardStatistics {
  totalRewards: number
  primaryRewards: number
  fallbackRewards: number
  fallbackPercentage: number
  uniqueUsers: number
  uniqueQuests: number
  recentRewards: RewardRecord[]
}

/**
 * Get comprehensive statistics about all rewards
 * @returns Statistics object with reward analytics
 */
export function getRewardStatistics(): RewardStatistics {
  const allRewards = getAllRewards()
  const primaryCount = getPrimaryRewardsCount()
  const fallbackCount = getFallbackRewardsCount()
  const totalRewards = allRewards.length
  
  const uniqueUsers = new Set(allRewards.map(r => r.userId)).size
  const uniqueQuests = new Set(allRewards.map(r => r.questId)).size
  
  // Get 10 most recent rewards
  const recentRewards = [...allRewards]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
  
  return {
    totalRewards,
    primaryRewards: primaryCount,
    fallbackRewards: fallbackCount,
    fallbackPercentage: totalRewards > 0 ? (fallbackCount / totalRewards) * 100 : 0,
    uniqueUsers,
    uniqueQuests,
    recentRewards
  }
}

/**
 * Export reward data as JSON
 * @param userId - Optional user ID to filter rewards
 * @returns JSON string of rewards
 */
export function exportRewardsAsJSON(userId?: string): string {
  const rewards = userId ? getUserRewards(userId) : getAllRewards()
  return JSON.stringify(rewards, null, 2)
}

/**
 * Export reward data as CSV
 * @param userId - Optional user ID to filter rewards
 * @returns CSV string of rewards
 */
export function exportRewardsAsCSV(userId?: string): string {
  const rewards = userId ? getUserRewards(userId) : getAllRewards()
  
  if (rewards.length === 0) {
    return 'No rewards to export'
  }
  
  // CSV header
  const header = 'userId,questId,badgeId,timestamp,fallbackUsed,txHash,chain\n'
  
  // CSV rows
  const rows = rewards.map(r => {
    const date = new Date(r.timestamp).toISOString()
    return `${r.userId},${r.questId},${r.badgeId},${date},${r.fallbackUsed},${r.txHash || ''},${r.chain || ''}`
  }).join('\n')
  
  return header + rows
}

/**
 * Get user-specific reward summary
 * @param userId - User ID
 * @returns User reward summary
 */
export function getUserRewardSummary(userId: string): {
  totalBadges: number
  primaryBadges: number
  fallbackBadges: number
  questsCompleted: string[]
  firstReward?: RewardRecord
  latestReward?: RewardRecord
} {
  const userRewards = getUserRewards(userId)
  const primaryBadges = userRewards.filter(r => !r.fallbackUsed).length
  const fallbackBadges = userRewards.filter(r => r.fallbackUsed).length
  const questsCompleted = [...new Set(userRewards.map(r => r.questId))]
  
  const sortedRewards = [...userRewards].sort((a, b) => a.timestamp - b.timestamp)
  
  return {
    totalBadges: userRewards.length,
    primaryBadges,
    fallbackBadges,
    questsCompleted,
    firstReward: sortedRewards[0],
    latestReward: sortedRewards[sortedRewards.length - 1]
  }
}

/**
 * Generate telemetry report for monitoring system health
 * @returns Telemetry report with system health metrics
 */
export function generateTelemetryReport(): {
  timestamp: Date
  statistics: RewardStatistics
  systemHealth: {
    fallbackRate: number
    healthStatus: 'healthy' | 'warning' | 'critical'
  }
} {
  const stats = getRewardStatistics()
  const fallbackRate = stats.fallbackPercentage
  
  let healthStatus: 'healthy' | 'warning' | 'critical' = 'healthy'
  if (fallbackRate > 50) {
    healthStatus = 'critical'
  } else if (fallbackRate > 20) {
    healthStatus = 'warning'
  }
  
  return {
    timestamp: new Date(),
    statistics: stats,
    systemHealth: {
      fallbackRate,
      healthStatus
    }
  }
}
