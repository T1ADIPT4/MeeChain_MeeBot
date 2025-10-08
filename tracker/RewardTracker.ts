/**
 * Reward Tracker for MeeChain
 * Tracks all badge rewards issued to users
 */

export interface RewardRecord {
  userId: string
  questId: string
  badgeId: string
  timestamp: number
  fallbackUsed: boolean
}

// In-memory storage for reward records
const rewardDatabase: RewardRecord[] = []

/**
 * Track a reward that was issued to a user
 * @param reward - Reward record to track
 */
export function trackReward(reward: RewardRecord): void {
  rewardDatabase.push(reward)
  console.log(`📊 Reward tracked: ${reward.badgeId} for user ${reward.userId}`)
}

/**
 * Get all rewards
 * @returns Array of all reward records
 */
export function getAllRewards(): RewardRecord[] {
  return [...rewardDatabase]
}

/**
 * Get rewards for a specific user
 * @param userId - User ID to filter by
 * @returns Array of reward records for the user
 */
export function getUserRewards(userId: string): RewardRecord[] {
  return rewardDatabase.filter((r) => r.userId === userId)
}

/**
 * Get rewards for a specific quest
 * @param questId - Quest ID to filter by
 * @returns Array of reward records for the quest
 */
export function getQuestRewards(questId: string): RewardRecord[] {
  return rewardDatabase.filter((r) => r.questId === questId)
}

/**
 * Get count of rewards per user
 * @returns Record mapping userId to badge count
 */
export function getRewardCountByUser(): Record<string, number> {
  return rewardDatabase.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

/**
 * Clear all reward records (for testing)
 */
export function clearRewards(): void {
  rewardDatabase.length = 0
}
