/**
 * Reputation Service
 * Manages contributor reputation scores and updates
 */

import type { Reputation, ReputationAction } from '../types/auditor.js'
import { logEvent } from '../utils/logger.js'

// In-memory store for demo (in production, this would be a database)
const reputationStore: Map<string, Reputation> = new Map()

/**
 * Points awarded for different actions
 */
const REPUTATION_POINTS: Record<ReputationAction, number> = {
  flag_validated: 10,
  review_completed: 5
}

/**
 * Get reputation for a user
 */
export function getReputation(userAddress: string): Reputation {
  if (!reputationStore.has(userAddress)) {
    const newReputation: Reputation = {
      user: userAddress,
      score: 0,
      flags: 0,
      reviews: 0,
      lastUpdated: new Date()
    }
    reputationStore.set(userAddress, newReputation)
  }
  return reputationStore.get(userAddress)!
}

/**
 * Update reputation based on action
 */
export async function updateReputation(
  userAddress: string, 
  action: ReputationAction
): Promise<Reputation> {
  const reputation = getReputation(userAddress)
  const points = REPUTATION_POINTS[action] || 0
  
  reputation.score += points
  reputation.lastUpdated = new Date()
  
  // Increment specific counters
  if (action === 'flag_validated') {
    reputation.flags += 1
  } else if (action === 'review_completed') {
    reputation.reviews += 1
  }
  
  reputationStore.set(userAddress, reputation)
  
  // Log the reputation update
  logEvent('reputation-updated', {
    user: userAddress,
    action,
    points,
    newScore: reputation.score
  })
  
  return reputation
}

/**
 * Get top contributors by reputation score
 */
export function getTopContributors(limit: number = 10): Reputation[] {
  return Array.from(reputationStore.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Reset reputation (for testing purposes)
 */
export function resetReputation(userAddress: string): void {
  reputationStore.delete(userAddress)
}

/**
 * Get all reputations (for admin/debug purposes)
 */
export function getAllReputations(): Reputation[] {
  return Array.from(reputationStore.values())
}
