// tracker/RewardTracker.ts

import type { RewardEntry } from './RewardLog.js'

const rewardLog: RewardEntry[] = []

/**
 * Track a reward entry when a user completes a quest and receives a badge
 * @param entry - Reward entry to track
 */
export function trackReward(entry: RewardEntry): void {
  rewardLog.push(entry)
  console.log('🎖️ Reward tracked:', entry)
}

/**
 * Get all rewards for a specific user
 * @param userId - User ID to get rewards for
 * @returns Array of reward entries for the user
 */
export function getUserRewards(userId: string): RewardEntry[] {
  return rewardLog.filter(r => r.userId === userId)
}

/**
 * Get all tracked rewards
 * @returns Array of all reward entries
 */
export function getAllRewards(): RewardEntry[] {
  return [...rewardLog]
}

/**
 * Clear all tracked rewards (useful for testing)
 */
export function clearRewards(): void {
  rewardLog.length = 0
}
