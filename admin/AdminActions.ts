/**
 * Admin Actions for MeeChain
 * Functions for managing badges and quests manually
 */

import { trackReward } from '../tracker/RewardTracker.js'
import { logEvent } from '../src/utils/logger.js'

/**
 * Manually grant a badge to a user (admin override)
 * @param userId - User ID to grant badge to
 * @param questId - Quest ID for the badge
 * @param triggeredBy - Admin user who triggered the action
 */
export function triggerManualBadge(
  userId: string,
  questId: string,
  triggeredBy: string = 'admin'
): void {
  const badgeId = `manual-${questId}-${Date.now()}`
  
  trackReward({
    userId,
    questId,
    badgeId,
    timestamp: Date.now(),
    fallbackUsed: false,
  })

  logEvent('manual-badge-granted', {
    userId,
    questId,
    badgeId,
    triggeredBy,
  })

  console.log(`🎖️ Manual badge granted to ${userId} for ${questId} by ${triggeredBy}`)
}

/**
 * Revoke a badge from a user (admin action)
 * Note: This is a placeholder for future implementation
 * @param userId - User ID
 * @param badgeId - Badge ID to revoke
 * @param triggeredBy - Admin user who triggered the action
 */
export function revokeBadge(
  userId: string,
  badgeId: string,
  triggeredBy: string = 'admin'
): void {
  logEvent('badge-revoked', {
    userId,
    badgeId,
    triggeredBy,
  })

  console.log(`⚠️ Badge ${badgeId} revoked from ${userId} by ${triggeredBy}`)
  // In production, this would remove the badge from the database
}

/**
 * Reset user progress for a quest (admin action)
 * Note: This is a placeholder for future implementation
 * @param userId - User ID
 * @param questId - Quest ID to reset
 * @param triggeredBy - Admin user who triggered the action
 */
export function resetQuestProgress(
  userId: string,
  questId: string,
  triggeredBy: string = 'admin'
): void {
  logEvent('quest-progress-reset', {
    userId,
    questId,
    triggeredBy,
  })

  console.log(`🔄 Quest progress reset for ${userId} on ${questId} by ${triggeredBy}`)
  // In production, this would clear the user's progress in the database
}
