/**
 * Admin Panel Component for MeeChain
 * Main admin interface for managing rewards and viewing leaderboard
 */

import React from 'react'
import { exportRewardLog } from '../tracker/RewardExporter'
import { Leaderboard } from './Leaderboard'
import { triggerManualBadge } from './AdminActions'
import { MeeBot } from '../components/MeeBot'

export function AdminPanel() {
  MeeBot.setSprite('admin')
  MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')

  return (
    <div>
      <h1>🛡️ Admin Panel</h1>

      <button onClick={() => exportRewardLog('./logs/reward-log.json')}>
        📤 Export Reward Log
      </button>

      <button onClick={() => triggerManualBadge('user123', 'special-quest')}>
        🎖️ ให้ badge พิเศษ
      </button>

      <Leaderboard />
    </div>
  )
}
