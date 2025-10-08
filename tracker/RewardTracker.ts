/**
 * Reward Tracker for MeeChain
 * Tracks badge rewards granted to users for quest completion
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
 * Track a reward granted to a user
 * @param reward - Reward record to track
 */
export function trackReward(reward: RewardRecord): void {
  rewardDatabase.push(reward)
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
export function getRewardsByUser(userId: string): RewardRecord[] {
  return rewardDatabase.filter((r) => r.userId === userId)
}

/**
 * Get rewards for a specific quest
 * @param questId - Quest ID to filter by
 * @returns Array of reward records for the quest
 */
export function getRewardsByQuest(questId: string): RewardRecord[] {
  return rewardDatabase.filter((r) => r.questId === questId)
}

/**
 * Get rewards that used fallback minting
 * @returns Array of reward records that used fallback
 */
export function getFallbackRewards(): RewardRecord[] {
  return rewardDatabase.filter((r) => r.fallbackUsed)
}

/**
 * Get badge count for a user
 * @param userId - User ID to count badges for
 * @returns Number of badges earned by user
 */
export function getBadgeCount(userId: string): number {
  return rewardDatabase.filter((r) => r.userId === userId).length
}

/**
 * Clear all reward records (for testing)
 */
export function clearRewards(): void {
  rewardDatabase.length = 0
}
