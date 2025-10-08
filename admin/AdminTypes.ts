/**
 * Admin Types for MeeChain
 * Type definitions for admin panel functionality
 */

export type AdminAction = {
  userId: string
  questId: string
  badgeId: string
  triggeredBy: string
  timestamp: number
}

export type LeaderboardEntry = {
  userId: string
  badgeCount: number
  rank: number
}

export type AdminStats = {
  totalBadges: number
  totalUsers: number
  fallbackUsageCount: number
  fallbackUsageRate: number
}
