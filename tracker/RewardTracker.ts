/**
 * Reward Tracker for MeeChain
 * Tracks all badge rewards and provides analytics for the leaderboard
 */

import { BadgeTransaction } from '../src/minting/badgeMinter.js'
import { logEvent } from '../src/utils/logger.js'

export interface RewardRecord {
  userId: string
  questId: string
  badgeId: string
  timestamp: number
  fallbackUsed: boolean
  txHash?: string
  chain?: 'primary' | 'fallback'
}

// In-memory reward storage (can be replaced with database in production)
const rewards: RewardRecord[] = []

/**
 * Track a reward when a badge is minted
 * @param reward - Reward record to track
 */
export function trackReward(reward: RewardRecord): void {
  rewards.push(reward)
  logEvent('reward-tracked', {
    userId: reward.userId,
    questId: reward.questId,
    badgeId: reward.badgeId,
    fallbackUsed: reward.fallbackUsed,
  })
}

/**
 * Track a reward from a badge transaction
 * @param tx - Badge transaction details
 */
export function trackRewardFromTransaction(tx: BadgeTransaction): void {
  const reward: RewardRecord = {
    userId: tx.userId,
    questId: tx.questId,
    badgeId: tx.badgeId,
    timestamp: tx.timestamp.getTime(),
    fallbackUsed: tx.chain === 'fallback',
    txHash: tx.txHash,
    chain: tx.chain,
  }
  trackReward(reward)
}

/**
 * Get all tracked rewards
 * @returns Array of all reward records
 */
export function getAllRewards(): RewardRecord[] {
  return [...rewards]
}

/**
 * Get rewards for a specific user
 * @param userId - User ID to filter by
 * @returns Array of reward records for the user
 */
export function getRewardsByUser(userId: string): RewardRecord[] {
  return rewards.filter((r) => r.userId === userId)
}

/**
 * Get rewards for a specific quest
 * @param questId - Quest ID to filter by
 * @returns Array of reward records for the quest
 */
export function getRewardsByQuest(questId: string): RewardRecord[] {
  return rewards.filter((r) => r.questId === questId)
}

/**
 * Get rewards that used fallback minting
 * @returns Array of reward records that used fallback
 */
export function getFallbackRewards(): RewardRecord[] {
  return rewards.filter((r) => r.fallbackUsed)
}

/**
 * Get badge count per user for leaderboard
 * @returns Record of userId to badge count
 */
export function getBadgeCountByUser(): Record<string, number> {
  return rewards.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

/**
 * Get top users by badge count
 * @param limit - Maximum number of users to return (default: 10)
 * @returns Array of [userId, badgeCount] sorted by count descending
 */
export function getTopUsers(limit: number = 10): Array<[string, number]> {
  const badgeCounts = getBadgeCountByUser()
  return Object.entries(badgeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
}

/**
 * Get statistics about rewards
 * @returns Statistics object with various metrics
 */
export function getRewardStats(): {
  totalRewards: number
  uniqueUsers: number
  uniqueQuests: number
  fallbackUsageRate: number
} {
  const uniqueUsers = new Set(rewards.map((r) => r.userId)).size
  const uniqueQuests = new Set(rewards.map((r) => r.questId)).size
  const fallbackCount = rewards.filter((r) => r.fallbackUsed).length
  const fallbackUsageRate = rewards.length > 0 ? fallbackCount / rewards.length : 0

  return {
    totalRewards: rewards.length,
    uniqueUsers,
    uniqueQuests,
    fallbackUsageRate,
  }
}

/**
 * Clear all reward records (for testing purposes)
 */
export function clearRewards(): void {
  rewards.length = 0
  logEvent('rewards-cleared', {}, 'debug')
}
