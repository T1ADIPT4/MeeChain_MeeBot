// admin/AdminPanel.tsx

/**
 * Admin Panel Component for MeeChain
 * Dashboard for system administrators to manage badges and view statistics
 */

import React from 'react'
import { exportRewardLog } from '../tracker/RewardExporter'
import { getAllRewards, getFallbackRewards } from '../tracker/RewardTracker'
import { Leaderboard } from './Leaderboard'
import { MeeBot } from '../components/MeeBot'
import { triggerManualBadge } from './AdminActions'
import type { AdminStats } from './AdminTypes'

export function AdminPanel() {
  // Set MeeBot to admin mode
  MeeBot.setSprite('admin')
  MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')

  // Calculate statistics
  const allRewards = getAllRewards()
  const fallbackRewards = getFallbackRewards()
  const uniqueUsers = new Set(allRewards.map((r) => r.userId)).size

  const stats: AdminStats = {
    totalBadges: allRewards.length,
    totalUsers: uniqueUsers,
    fallbackUsageCount: fallbackRewards.length,
    fallbackUsageRate: allRewards.length > 0 
      ? (fallbackRewards.length / allRewards.length) * 100 
      : 0,
  }

  const handleExportLog = () => {
    const result = exportRewardLog('./logs/reward-log.json')
    alert(result)
    MeeBot.speak('ส่งออกข้อมูลสำเร็จแล้วครับ')
  }

  const handleGrantBadge = () => {
    const userId = prompt('กรอก User ID:')
    const questId = prompt('กรอก Quest ID:')
    
    if (userId && questId) {
      triggerManualBadge(userId, questId, 'admin-panel')
      alert(`ให้ badge สำหรับ ${questId} แก่ ${userId} สำเร็จ`)
      MeeBot.speak(`ให้ badge สำเร็จแล้วครับ`)
    }
  }

  return (
    <div>
      <h1>🛡️ Admin Panel</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>📊 System Statistics</h3>
        <ul>
          <li>Total Badges: {stats.totalBadges}</li>
          <li>Total Users: {stats.totalUsers}</li>
          <li>Fallback Usage: {stats.fallbackUsageCount} ({stats.fallbackUsageRate.toFixed(1)}%)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>⚙️ Actions</h3>
        <button onClick={handleExportLog} style={{ marginRight: '10px' }}>
          📤 Export Reward Log
        </button>
        <button onClick={handleGrantBadge}>
          🎖️ ให้ badge พิเศษ
        </button>
      </div>

      <Leaderboard />

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h4>🤖 MeeBot Status</h4>
        <p>Sprite: {MeeBot.getCurrentSprite()}</p>
        <p>Last Message: {MeeBot.getLastMessage()}</p>
      </div>
    </div>
  )
}
