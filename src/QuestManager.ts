/**
 * Quest Manager for MeeChain
 * Main orchestrator for quest verification and badge minting with fallback support
 */

import { verifyQuestConditions } from './verifiers/questVerifier.js'
import { verifyTTSQuestConditions } from './verifiers/TTSQuestVerifier.js'
import { mintBadge, fallbackMintBadge, BadgeTransaction } from './minting/badgeMinter.js'
import { logEvent } from './utils/logger.js'
import { trackReward } from '../tracker/RewardTracker.js'

export interface QuestCompletionResult {
  success: boolean
  reason?: string
  tx?: BadgeTransaction
  fallback?: boolean
}

/**
 * Handle quest completion for a user
 * Verifies quest conditions, mints badge with fallback support
 * @param userId - User ID completing the quest
 * @param questId - Quest ID being completed
 * @returns Quest completion result with transaction details
 */
export async function handleQuestCompletion(
  userId: string,
  questId: string
): Promise<QuestCompletionResult> {
  try {
    logEvent('quest-completion-start', { userId, questId })

    // Step 1: Verify quest conditions (support both regular and TTS quests)
    let verified = false
    if (questId === 'quest-tts-001') {
      verified = await verifyTTSQuestConditions(userId)
    } else {
      verified = await verifyQuestConditions(userId, questId)
    }

    if (!verified) {
      logEvent('quest-verification-failed', { userId, questId })
      return { success: false, reason: 'Quest conditions not met' }
    }

    // Step 2: Attempt primary badge minting
    try {
      const badgeTx = await mintBadge(userId, questId)
      logEvent('badge-minted', { userId, questId, tx: badgeTx.txHash })
      
      // Track reward
      trackReward({
        userId,
        questId,
        badgeId: badgeTx.badgeId,
        timestamp: badgeTx.timestamp.getTime(),
        fallbackUsed: false
      })
      
      return { success: true, tx: badgeTx }
    } catch (mintError) {
      logEvent('badge-mint-failed', { 
        userId, 
        questId, 
        error: mintError instanceof Error ? mintError.message : String(mintError)
      }, 'warn')

      // Step 3: Fallback minting logic
      try {
        const fallbackTx = await fallbackMintBadge(userId, questId)
        logEvent('badge-fallback-minted', { userId, questId, tx: fallbackTx.txHash })
        
        // Track reward with fallback flag
        trackReward({
          userId,
          questId,
          badgeId: fallbackTx.badgeId,
          timestamp: fallbackTx.timestamp.getTime(),
          fallbackUsed: true
        })
        
        return { success: true, tx: fallbackTx, fallback: true }
      } catch (fallbackError) {
        logEvent('badge-fallback-failed', {
          userId,
          questId,
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        }, 'error')
        return { 
          success: false, 
          reason: 'Both primary and fallback minting failed' 
        }
      }
    }
  } catch (error) {
    logEvent('quest-completion-error', { 
      userId, 
      questId, 
      error: error instanceof Error ? error.message : String(error)
    }, 'error')
    return { success: false, reason: 'Unexpected error' }
  }
}

/**
 * Get quest completion status
 * @param userId - User ID to check
 * @param questId - Quest ID to check
 * @returns Completion status message
 */
export async function getQuestStatus(
  userId: string,
  questId: string
): Promise<string> {
  let verified = false
  if (questId === 'quest-tts-001') {
    verified = await verifyTTSQuestConditions(userId)
  } else {
    verified = await verifyQuestConditions(userId, questId)
  }
  
  return verified 
    ? 'Quest conditions met - ready to complete' 
    : 'Quest conditions not yet met'
}
