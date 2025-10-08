// admin/AdminPanel.tsx

/**
 * Admin Panel component for MeeChain
 * Dashboard for administrators to manage the system
 */

import React from 'react'
import { exportRewardLog, exportRewardLogCSV } from '../tracker/RewardExporter'
import { Leaderboard } from './Leaderboard'
import { MeeBot } from '../components/MeeBot'
import { triggerManualBadge, getRecentAdminActions } from './AdminActions'
import { getRewardStats } from '../tracker/RewardTracker'

export function AdminPanel() {
  // Set MeeBot to admin mode
  MeeBot.setSprite('admin')
  MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')

  // Get statistics
  const stats = getRewardStats()
  const recentActions = getRecentAdminActions(5)

  // Handler functions
  const handleExportJSON = async () => {
    try {
      await exportRewardLog('./logs/reward-log.json')
      MeeBot.setSprite('happy')
      MeeBot.speak('ส่งออกข้อมูลสำเร็จแล้วครับ')
    } catch (error) {
      MeeBot.setSprite('sad')
      MeeBot.speak('เกิดข้อผิดพลาดในการส่งออกข้อมูล')
      console.error('Export error:', error)
    }
  }

  const handleExportCSV = async () => {
    try {
      await exportRewardLogCSV('./logs/reward-log.csv')
      MeeBot.setSprite('happy')
      MeeBot.speak('ส่งออกข้อมูล CSV สำเร็จแล้วครับ')
    } catch (error) {
      MeeBot.setSprite('sad')
      MeeBot.speak('เกิดข้อผิดพลาดในการส่งออกข้อมูล CSV')
      console.error('Export CSV error:', error)
    }
  }

  const handleManualBadge = () => {
    const userId = prompt('Enter User ID:')
    const questId = prompt('Enter Quest ID:')
    
    if (userId && questId) {
      try {
        const badgeId = triggerManualBadge(userId, questId, 'admin')
        MeeBot.setSprite('happy')
        MeeBot.speak(`ให้ badge สำเร็จแล้วครับ: ${badgeId}`)
        alert(`Badge granted successfully: ${badgeId}`)
      } catch (error) {
        MeeBot.setSprite('sad')
        MeeBot.speak('เกิดข้อผิดพลาดในการให้ badge')
        console.error('Manual badge error:', error)
      }
    }
  }

  return (
    <div className="admin-panel">
      <h1>🛡️ Admin Panel</h1>
      
      <section className="stats-section">
        <h2>📊 Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalRewards}</div>
            <div className="stat-label">Total Badges</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.uniqueUsers}</div>
            <div className="stat-label">Unique Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.uniqueQuests}</div>
            <div className="stat-label">Unique Quests</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(stats.fallbackUsageRate * 100).toFixed(1)}%</div>
            <div className="stat-label">Fallback Usage</div>
          </div>
        </div>
      </section>

      <section className="actions-section">
        <h2>⚙️ Actions</h2>
        <div className="action-buttons">
          <button onClick={handleExportJSON} className="btn btn-primary">
            📤 Export Reward Log (JSON)
          </button>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            📤 Export Reward Log (CSV)
          </button>
          <button onClick={handleManualBadge} className="btn btn-special">
            🎖️ Grant Manual Badge
          </button>
        </div>
      </section>

      <section className="recent-actions-section">
        <h2>📝 Recent Admin Actions</h2>
        {recentActions.length > 0 ? (
          <ul className="recent-actions-list">
            {recentActions.map((action, i) => (
              <li key={i}>
                <strong>{action.triggeredBy}</strong> granted badge <code>{action.badgeId}</code> to{' '}
                <strong>{action.userId}</strong> for quest <code>{action.questId}</code>
                <br />
                <small>{new Date(action.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No admin actions yet.</p>
        )}
      </section>

      <section className="leaderboard-section">
        <Leaderboard />
      </section>
    </div>
  )
}
