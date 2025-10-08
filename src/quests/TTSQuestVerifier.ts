/**
 * TTS Quest Verifier for MeeChain
 * Verifies if user has enabled TTS to complete the quest
 */

import { logEvent } from '../utils/logger.js'

export interface UserSettings {
  ttsEnabled: boolean
}

/**
 * Verify if user has enabled TTS
 * @param settings - User settings object
 * @returns true if TTS is enabled, false otherwise
 */
export async function verifyTTSQuest(settings: UserSettings): Promise<boolean> {
  logEvent('tts-quest-verification', { ttsEnabled: settings.ttsEnabled }, 'debug')
  return settings.ttsEnabled === true
}
