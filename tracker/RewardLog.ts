// tracker/RewardLog.ts

/**
 * Type definitions for Reward Log entries
 */

export type RewardEntry = {
  userId: string
  questId: string
  badgeId: string
  timestamp: number
  fallbackUsed: boolean
}
