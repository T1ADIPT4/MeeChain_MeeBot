/**
 * TTS Quest Verifier for MeeChain
 * Verifies if a user has completed the TTS enabling quest
 */

import { logEvent } from '../utils/logger.js'

export interface TTSQuestCondition {
  type: 'tts-enabled' | 'tts-used'
  required: number
  completed: number
}

export interface TTSQuest {
  id: string
  name: string
  conditions: TTSQuestCondition[]
}

// TTS Quest definition
const ttsQuest: TTSQuest = {
  id: 'quest-tts-001',
  name: 'Enable TTS',
  conditions: [
    { type: 'tts-enabled', required: 1, completed: 0 },
  ],
}

// User progress for TTS quest
const ttsProgressDatabase: Record<string, Record<string, number>> = {}

/**
 * Verify if a user has met TTS quest conditions
 * @param userId - User ID to verify
 * @returns true if all conditions are met, false otherwise
 */
export async function verifyTTSQuestConditions(
  userId: string
): Promise<boolean> {
  try {
    const questId = ttsQuest.id
    logEvent('tts-quest-verification-start', { userId, questId }, 'debug')

    // Get user progress
    const userProgress = ttsProgressDatabase[userId] || {}

    // Check all conditions
    let allConditionsMet = true
    for (const condition of ttsQuest.conditions) {
      const userCompleted = userProgress[condition.type] || 0

      if (userCompleted < condition.required) {
        allConditionsMet = false
        logEvent(
          'tts-quest-condition-not-met',
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
      logEvent('tts-quest-verification-success', { userId, questId })
    } else {
      logEvent('tts-quest-verification-failed', { userId, questId })
    }

    return allConditionsMet
  } catch (error) {
    logEvent(
      'tts-quest-verification-error',
      { userId, error: String(error) },
      'error'
    )
    return false
  }
}

/**
 * Update user progress for TTS quest
 * @param userId - User ID
 * @param conditionType - Type of condition being updated ('tts-enabled' or 'tts-used')
 * @param increment - Amount to increment (defaults to 1)
 */
export function updateTTSProgress(
  userId: string,
  conditionType: 'tts-enabled' | 'tts-used',
  increment: number = 1
): void {
  if (!ttsProgressDatabase[userId]) {
    ttsProgressDatabase[userId] = {}
  }

  const currentProgress = ttsProgressDatabase[userId][conditionType] || 0
  ttsProgressDatabase[userId][conditionType] = currentProgress + increment

  logEvent('tts-progress-updated', {
    userId,
    conditionType,
    newValue: ttsProgressDatabase[userId][conditionType],
  })
}

/**
 * Get user's current progress for TTS quest
 * @param userId - User ID
 * @returns User's progress record
 */
export function getTTSProgress(userId: string): Record<string, number> {
  return ttsProgressDatabase[userId] || {}
}

/**
 * Get TTS quest definition
 * @returns TTS quest object
 */
export function getTTSQuest(): TTSQuest {
  return ttsQuest
}
