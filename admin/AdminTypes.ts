/**
 * Type definitions for Admin Panel
 */

export type AdminAction = {
  userId: string
  questId: string
  badgeId: string
  triggeredBy: string
  timestamp: number
}

export interface LeaderboardEntry {
  userId: string
  badgeCount: number
  rank: number
}

export interface AdminStats {
  totalBadges: number
  totalUsers: number
  totalQuests: number
  fallbackUsageRate: number
  recentActions: AdminAction[]
}
