/**
 * Reward Tracker for MeeChain
 * Tracks badge rewards with fallback status for analytics and user dashboard
 */

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

// In-memory storage for reward records (can be replaced with database)
const rewardDatabase: RewardRecord[] = []

/**
 * Track a reward when a user receives a badge
 * @param reward - Reward record to track
 */
export function trackReward(reward: RewardRecord): void {
  rewardDatabase.push(reward)
  
  logEvent('reward-tracked', {
    userId: reward.userId,
    questId: reward.questId,
    badgeId: reward.badgeId,
    fallbackUsed: reward.fallbackUsed,
    chain: reward.chain
  })
}

/**
 * Get all rewards for a specific user
 * @param userId - User ID to retrieve rewards for
 * @returns Array of reward records for the user
 */
export function getUserRewards(userId: string): RewardRecord[] {
  return rewardDatabase.filter(reward => reward.userId === userId)
}

/**
 * Get all rewards in the system
 * @returns Array of all reward records
 */
export function getAllRewards(): RewardRecord[] {
  return [...rewardDatabase]
}

/**
 * Get rewards filtered by quest ID
 * @param questId - Quest ID to filter by
 * @returns Array of reward records for the quest
 */
export function getRewardsByQuest(questId: string): RewardRecord[] {
  return rewardDatabase.filter(reward => reward.questId === questId)
}

/**
 * Get count of rewards using fallback
 * @returns Count of fallback rewards
 */
export function getFallbackRewardsCount(): number {
  return rewardDatabase.filter(reward => reward.fallbackUsed).length
}

/**
 * Get count of normal (primary) rewards
 * @returns Count of primary rewards
 */
export function getPrimaryRewardsCount(): number {
  return rewardDatabase.filter(reward => !reward.fallbackUsed).length
}

/**
 * Clear all reward records (for testing)
 */
export function clearRewards(): void {
  rewardDatabase.length = 0
  logEvent('rewards-cleared', {}, 'debug')
}

/**
 * Get total reward count for a user
 * @param userId - User ID
 * @returns Total number of rewards for the user
 */
export function getUserRewardCount(userId: string): number {
  return getUserRewards(userId).length
}
