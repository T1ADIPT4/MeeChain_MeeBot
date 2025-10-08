// pages/Settings.tsx

import React from 'react'
import { useSettings } from '../hooks/useSettings'
import { SettingToggle } from '../components/SettingToggle'
import { MeeBot } from '../components/MeeBot'

export default function SettingsPage() {
  const { settings, updateSetting, loading } = useSettings()

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
        onChange={(val: boolean) => updateSetting('ttsEnabled', val)}
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
