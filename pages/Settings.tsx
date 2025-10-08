// pages/Settings.tsx

import React, { useCallback } from 'react'
import { useSettings } from '../hooks/useSettings'
import { SettingToggle } from '../components/SettingToggle'
import { MeeBot } from '../components/MeeBot'

// Import TTS quest functions for quest triggering
let handleQuestCompletion: any = null
let updateTTSProgress: any = null

// Lazy load quest modules to avoid circular dependencies
async function triggerTTSQuest(userId: string) {
  try {
    if (!handleQuestCompletion || !updateTTSProgress) {
      const QuestManager = await import('../src/QuestManager')
      const TTSQuestVerifier = await import('../src/verifiers/TTSQuestVerifier')
      handleQuestCompletion = QuestManager.handleQuestCompletion
      updateTTSProgress = TTSQuestVerifier.updateTTSProgress
    }

    // Update TTS progress
    updateTTSProgress(userId, 'tts-enabled', 1)

    // Try to complete the quest
    const result = await handleQuestCompletion(userId, 'quest-tts-001')

    if (result.success) {
      if (result.fallback) {
        MeeBot.setSprite('confused')
        MeeBot.speak('เควส TTS สำเร็จผ่านระบบ fallback!')
      } else {
        MeeBot.setSprite('happy')
        MeeBot.speak('ยินดีด้วย! คุณได้รับ badge สำหรับการเปิด TTS แล้ว!')
      }
    }
  } catch (error) {
    console.error('Error triggering TTS quest:', error)
  }
}

export default function SettingsPage() {
  const { settings, updateSetting, loading } = useSettings()

  const handleTTSChange = useCallback(async (val: boolean) => {
    updateSetting('ttsEnabled', val)
    
    // Trigger TTS quest when enabling TTS
    if (val) {
      // Get user ID from context or session (using mock for now)
      const userId = 'current-user-id'
      await triggerTTSQuest(userId)
      MeeBot.speak('เปิด TTS แล้วครับ! ตอนนี้ MeeBot สามารถพูดคุยกับคุณได้แล้ว')
    } else {
      MeeBot.speak('ปิด TTS แล้วครับ')
    }
  }, [updateSetting])

  if (loading) {
    MeeBot.setSprite('loading')
    return <p>กำลังโหลดการตั้งค่า...</p>
  }

  MeeBot.setSprite('neutral')
  MeeBot.speak('คุณสามารถปรับแต่งระบบ MeeChain ได้ที่นี่')

  return (
    <div>
      <h1>Settings</h1>
      <SettingToggle
        label="เปิดเสียง TTS"
        value={settings.ttsEnabled}
        onChange={handleTTSChange}
      />
      <SettingToggle
        label="โหมด Sprite MeeBot"
        value={settings.spriteMode === 'animated'}
        onChange={(val: boolean) => updateSetting('spriteMode', val ? 'animated' : 'default')}
      />
      <SettingToggle
        label="แจ้งเตือนเควสใหม่"
        value={settings.notifications}
        onChange={(val: boolean) => updateSetting('notifications', val)}
      />
    </div>
  )
}
