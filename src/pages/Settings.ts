/**
 * Settings Page Component for MeeChain
 * Demonstrates TTS quest integration with user settings
 */

import { verifyTTSQuest, UserSettings } from '../quests/TTSQuestVerifier.js'
import { mintBadge, fallbackMintBadge } from '../minting/badgeMinter.js'
import { MeeBot } from '../components/MeeBot.js'
import { updateUserProgress } from '../verifiers/questVerifier.js'
import { logEvent } from '../utils/logger.js'

/**
 * Handle TTS quest verification and badge minting
 * @param userId - User ID
 * @param settings - User settings object
 */
export async function handleTTSQuest(userId: string, settings: UserSettings): Promise<void> {
  const verified = await verifyTTSQuest(settings)

  if (!verified) {
    MeeBot.setSprite('neutral')
    MeeBot.speak('เปิด TTS ก่อนนะครับ ถึงจะรับ badge ได้')
    return
  }

  // Update user progress for the quest
  updateUserProgress(userId, 'tts-quest', 'tts-enabled', 1)

  try {
    const tx = await mintBadge(userId, 'tts-quest')
    MeeBot.setSprite('celebrate')
    MeeBot.speak('เยี่ยมมาก! คุณได้รับ badge สำหรับการเปิด TTS แล้ว')
    logEvent('tts-quest-completed', { userId, tx: tx.txHash }, 'info')
  } catch (error) {
    try {
      const fallbackTx = await fallbackMintBadge(userId, 'tts-quest')
      MeeBot.setSprite('confused')
      MeeBot.speak('ระบบ fallback ทำงานแล้วครับ คุณยังได้รับ badge อยู่นะ')
      logEvent('tts-quest-completed-fallback', { userId, tx: fallbackTx.txHash }, 'warn')
    } catch (fallbackError) {
      MeeBot.setSprite('sad')
      MeeBot.speak('ขออภัยครับ มีปัญหาในการมอบ badge')
      logEvent('tts-quest-failed', { 
        userId, 
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError) 
      }, 'error')
    }
  }
}

/**
 * Mock Settings component with TTS toggle
 * This demonstrates how to integrate TTS quest into a Settings page
 */
export async function updateTTSSetting(
  userId: string, 
  currentSettings: UserSettings,
  newValue: boolean
): Promise<void> {
  // Update the setting
  const updatedSettings: UserSettings = {
    ...currentSettings,
    ttsEnabled: newValue,
  }

  // Log the settings change
  logEvent('settings-updated', { userId, ttsEnabled: newValue }, 'info')

  // Trigger TTS quest check if TTS was just enabled
  if (newValue && !currentSettings.ttsEnabled) {
    await handleTTSQuest(userId, updatedSettings)
  }
}
