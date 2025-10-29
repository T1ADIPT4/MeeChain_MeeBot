/**
 * Badge Service
 * Manages auditor badges and unlocking logic
 */

import type { Badge, BadgeRule, Reputation } from '../types/auditor.js'
import { logEvent } from '../utils/logger.js'

/**
 * Badge rules that define when badges are unlocked
 */
export const BADGE_RULES: BadgeRule[] = [
  {
    id: 'watchdog',
    name: '🛡️ Watchdog',
    icon: '🛡️',
    description: 'Successfully flagged 5 or more suspicious transactions',
    condition: (r: Reputation) => r.flags >= 5
  },
  {
    id: 'truth-seeker',
    name: '🔍 Truth Seeker',
    icon: '🔍',
    description: 'Completed 10 or more reviews',
    condition: (r: Reputation) => r.reviews >= 10
  },
  {
    id: 'auditor-og',
    name: '📜 Auditor OG',
    icon: '📜',
    description: 'Reached 100+ reputation score',
    condition: (r: Reputation) => r.score >= 100
  },
  {
    id: 'eagle-eye',
    name: '👁️ Eagle Eye',
    icon: '👁️',
    description: 'Successfully flagged 20 or more suspicious transactions',
    condition: (r: Reputation) => r.flags >= 20
  },
  {
    id: 'master-auditor',
    name: '⭐ Master Auditor',
    icon: '⭐',
    description: 'Completed 50 or more reviews',
    condition: (r: Reputation) => r.reviews >= 50
  },
  {
    id: 'legend',
    name: '🏆 Legend',
    icon: '🏆',
    description: 'Reached 500+ reputation score',
    condition: (r: Reputation) => r.score >= 500
  }
]

// In-memory store for user badges (in production, this would be a database)
const userBadgesStore: Map<string, Badge[]> = new Map()

/**
 * Get badges for a user
 */
export function getUserBadges(userAddress: string): Badge[] {
  return userBadgesStore.get(userAddress) || []
}

/**
 * Check and unlock new badges for a user based on their reputation
 */
export function checkAndUnlockBadges(
  userAddress: string,
  reputation: Reputation
): Badge[] {
  const currentBadges = getUserBadges(userAddress)
  const currentBadgeIds = new Set(currentBadges.map(b => b.id))
  const newBadges: Badge[] = []
  
  for (const rule of BADGE_RULES) {
    // Check if badge is not already unlocked and condition is met
    if (!currentBadgeIds.has(rule.id) && rule.condition(reputation)) {
      const badge: Badge = {
        id: rule.id,
        name: rule.name,
        icon: rule.icon,
        description: rule.description,
        unlockedAt: new Date()
      }
      
      newBadges.push(badge)
      currentBadges.push(badge)
      
      // Log badge unlock
      logEvent('badge-unlocked', {
        user: userAddress,
        badgeId: rule.id,
        badgeName: rule.name,
        reputation: reputation.score
      })
    }
  }
  
  if (newBadges.length > 0) {
    userBadgesStore.set(userAddress, currentBadges)
  }
  
  return newBadges
}

/**
 * Get all available badge rules
 */
export function getBadgeRules(): BadgeRule[] {
  return BADGE_RULES
}

/**
 * Check if user has a specific badge
 */
export function hasBadge(userAddress: string, badgeId: string): boolean {
  const badges = getUserBadges(userAddress)
  return badges.some(b => b.id === badgeId)
}

/**
 * Get badge progress for a user (how close they are to unlocking each badge)
 */
export function getBadgeProgress(
  userAddress: string,
  reputation: Reputation
): Array<{ rule: BadgeRule; unlocked: boolean; progress: string }> {
  const badges = getUserBadges(userAddress)
  const unlockedIds = new Set(badges.map(b => b.id))
  
  return BADGE_RULES.map(rule => {
    const unlocked = unlockedIds.has(rule.id)
    let progress = ''
    
    if (!unlocked) {
      // Calculate progress based on badge type
      if (rule.id === 'watchdog' || rule.id === 'eagle-eye') {
        const required = rule.id === 'watchdog' ? 5 : 20
        progress = `${reputation.flags}/${required} flags`
      } else if (rule.id === 'truth-seeker' || rule.id === 'master-auditor') {
        const required = rule.id === 'truth-seeker' ? 10 : 50
        progress = `${reputation.reviews}/${required} reviews`
      } else if (rule.id === 'auditor-og' || rule.id === 'legend') {
        const required = rule.id === 'auditor-og' ? 100 : 500
        progress = `${reputation.score}/${required} points`
      }
    } else {
      progress = 'Unlocked ✓'
    }
    
    return { rule, unlocked, progress }
  })
}

/**
 * Reset badges for a user (for testing purposes)
 */
export function resetBadges(userAddress: string): void {
  userBadgesStore.delete(userAddress)
}
