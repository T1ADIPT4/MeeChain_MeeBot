/**
 * Settings Page with Reward Tracker Integration
 * Example of how to integrate the Reward Tracker with the Settings page
 */

import React, { useCallback } from 'react'
import { useSettings } from '../hooks/useSettings'
import { SettingToggle } from '../components/SettingToggle'
import { MeeBot } from '../components/MeeBot'
import { RewardDashboard, RewardBadgeCount } from '../tracker/RewardDashboard'

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

export default function SettingsPageWithRewards() {
  const { settings, loading, updateSetting } = useSettings()
  
  // Get current user ID (in production, this would come from auth context)
  const userId = 'current-user-id'

  const handleTTSChange = useCallback(
    async (enabled: boolean) => {
      updateSetting('ttsEnabled', enabled)
      
      if (enabled) {
        // Trigger TTS quest when TTS is enabled
        await triggerTTSQuest(userId)
      } else {
        MeeBot.setSprite('neutral')
        MeeBot.speak('ปิด TTS แล้วครับ')
      }
    },
    [updateSetting, userId]
  )

  if (loading) {
    return <p>กำลังโหลดการตั้งค่า...</p>
  }

  MeeBot.setSprite('neutral')
  MeeBot.speak('คุณสามารถปรับแต่งระบบ MeeChain ได้ที่นี่')

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        {/* Display badge count in header */}
        <RewardBadgeCount userId={userId} />
      </div>

      {/* Settings Section */}
      <section className="settings-section">
        <h2>⚙️ การตั้งค่า</h2>
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
      </section>

      {/* Rewards Section */}
      <section className="rewards-section">
        <h2>🎖️ รางวัลของคุณ</h2>
        <RewardDashboard userId={userId} />
      </section>

      {/* MeeBot Tips Section */}
      <section className="tips-section">
        <h2>💡 เคล็ดลับจาก MeeBot</h2>
        <div className="tip-card">
          <p>💡 เปิด TTS เพื่อรับ badge พิเศษ!</p>
          <p>🎯 ทำเควสให้ครบเพื่อรับ badge เพิ่มเติม</p>
          <p>🔥 ตรวจสอบรางวัลของคุณได้ตลอดเวลา</p>
        </div>
      </section>
    </div>
  )
}
