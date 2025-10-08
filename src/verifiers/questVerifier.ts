/**
 * Quest Verifier for MeeChain
 * Verifies if a user has met all conditions for completing a quest
 */

import { logEvent } from '../utils/logger.js'

export interface QuestCondition {
  type: string
  required: number
  completed: number
}

export interface Quest {
  id: string
  name: string
  conditions: QuestCondition[]
}

// Mock quest database (replace with actual database in production)
const questDatabase: Record<string, Quest> = {
  'quest-001': {
    id: 'quest-001',
    name: 'First Steps',
    conditions: [
      { type: 'login', required: 1, completed: 0 },
      { type: 'profile-setup', required: 1, completed: 0 },
    ],
  },
  'quest-002': {
    id: 'quest-002',
    name: 'NFT Collector',
    conditions: [
      { type: 'nft-minted', required: 3, completed: 0 },
      { type: 'nft-traded', required: 1, completed: 0 },
    ],
  },
}

// Mock user progress database (replace with actual database in production)
const userProgressDatabase: Record<string, Record<string, number>> = {}

/**
 * Verify if a user has met all quest conditions
 * @param userId - User ID to verify
 * @param questId - Quest ID to check
 * @returns true if all conditions are met, false otherwise
 */
export async function verifyQuestConditions(
  userId: string,
  questId: string
): Promise<boolean> {
  try {
    logEvent('quest-verification-start', { userId, questId }, 'debug')

    // Get quest definition
    const quest = questDatabase[questId]
    if (!quest) {
      logEvent(
        'quest-not-found',
        { userId, questId },
        'warn'
      )
      return false
    }

    // Get user progress
    const userProgress = userProgressDatabase[`${userId}-${questId}`] || {}

    // Check all conditions
    let allConditionsMet = true
    for (const condition of quest.conditions) {
      const userCompleted = userProgress[condition.type] || 0

      if (userCompleted < condition.required) {
        allConditionsMet = false
        logEvent(
          'quest-condition-not-met',
          {
            userId,
            questId,
            conditionType: condition.type,
            required: condition.required,
            completed: userCompleted,
          },
          'debug'
        )
      }
    }

    if (allConditionsMet) {
      logEvent('quest-verification-success', { userId, questId })
    } else {
      logEvent('quest-verification-failed', { userId, questId })
    }

    return allConditionsMet
  } catch (error) {
    logEvent(
      'quest-verification-error',
      { userId, questId, error: String(error) },
      'error'
    )
    return false
  }
}

/**
 * Update user progress for a quest condition
 * @param userId - User ID
 * @param questId - Quest ID
 * @param conditionType - Type of condition being updated
 * @param increment - Amount to increment (defaults to 1)
 */
export function updateUserProgress(
  userId: string,
  questId: string,
  conditionType: string,
  increment: number = 1
): void {
  const key = `${userId}-${questId}`
  if (!userProgressDatabase[key]) {
    userProgressDatabase[key] = {}
  }

  const currentProgress = userProgressDatabase[key][conditionType] || 0
  userProgressDatabase[key][conditionType] = currentProgress + increment

  logEvent('user-progress-updated', {
    userId,
    questId,
    conditionType,
    newValue: userProgressDatabase[key][conditionType],
  })
}

/**
 * Get user's current progress for a quest
 * @param userId - User ID
 * @param questId - Quest ID
 * @returns User's progress record
 */
export function getUserProgress(
  userId: string,
  questId: string
): Record<string, number> {
  const key = `${userId}-${questId}`
  return userProgressDatabase[key] || {}
}
