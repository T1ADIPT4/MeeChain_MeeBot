/**
 * Admin Actions for MeeChain
 * Functions for managing badges, quests, and manual interventions
 */

import { trackReward } from '../tracker/RewardTracker.js'
import { logEvent } from '../src/utils/logger.js'
import { AdminAction } from './AdminTypes.js'

// Track admin actions for audit purposes
const adminActions: AdminAction[] = []

/**
 * Trigger a manual badge grant for a user
 * Used for special cases like events, bug bounties, or admin overrides
 * @param userId - User ID to receive the badge
 * @param questId - Quest ID associated with the badge
 * @param triggeredBy - Admin user who triggered the action (default: 'admin')
 * @returns Badge ID that was created
 */
export function triggerManualBadge(
  userId: string,
  questId: string,
  triggeredBy: string = 'admin'
): string {
  const badgeId = `manual-${questId}-${Date.now()}`
  const timestamp = Date.now()

  // Track the reward
  trackReward({
    userId,
    questId,
    badgeId,
    timestamp,
    fallbackUsed: false,
  })

  // Log the admin action
  const action: AdminAction = {
    userId,
    questId,
    badgeId,
    triggeredBy,
    timestamp,
  }
  adminActions.push(action)

  logEvent('manual-badge-granted', {
    userId,
    questId,
    badgeId,
    triggeredBy,
  })

  console.log(`🎖️ Manual badge granted to ${userId} for ${questId} by ${triggeredBy}`)

  return badgeId
}

/**
 * Get all admin actions for audit trail
 * @returns Array of all admin actions
 */
export function getAllAdminActions(): AdminAction[] {
  return [...adminActions]
}

/**
 * Get admin actions for a specific user
 * @param userId - User ID to filter by
 * @returns Array of admin actions for the user
 */
export function getAdminActionsByUser(userId: string): AdminAction[] {
  return adminActions.filter((action) => action.userId === userId)
}

/**
 * Get admin actions by the admin who triggered them
 * @param triggeredBy - Admin user ID
 * @returns Array of admin actions triggered by the admin
 */
export function getAdminActionsByAdmin(triggeredBy: string): AdminAction[] {
  return adminActions.filter((action) => action.triggeredBy === triggeredBy)
}

/**
 * Get recent admin actions
 * @param limit - Maximum number of actions to return (default: 10)
 * @returns Array of recent admin actions
 */
export function getRecentAdminActions(limit: number = 10): AdminAction[] {
  return [...adminActions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

/**
 * Clear all admin actions (for testing purposes)
 */
export function clearAdminActions(): void {
  adminActions.length = 0
  logEvent('admin-actions-cleared', {}, 'debug')
}
