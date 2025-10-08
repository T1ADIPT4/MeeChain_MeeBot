/**
 * Admin Actions for MeeChain
 * Provides manual badge granting and administrative functions
 */

import { trackReward } from '../tracker/RewardTracker.js'

/**
 * Trigger a manual badge grant for a user
 * @param userId - User ID to grant badge to
 * @param questId - Quest ID associated with the badge
 */
export function triggerManualBadge(userId: string, questId: string): void {
  const badgeId = `manual-${questId}-${Date.now()}`
  trackReward({
    userId,
    questId,
    badgeId,
    timestamp: Date.now(),
    fallbackUsed: false
  })
  console.log(`🎖️ Manual badge granted to ${userId} for ${questId}`)
}
