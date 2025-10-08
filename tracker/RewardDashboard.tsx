/**
 * Reward Dashboard Component for MeeChain
 * Displays user's badges with MeeBot feedback
 */

import React from 'react'
import { getUserRewards } from './RewardTracker'
import { MeeBot } from '../components/MeeBot'

export interface RewardDashboardProps {
  userId: string
}

/**
 * RewardDashboard component - displays all badges earned by a user
 * Integrates with MeeBot for emotional feedback
 */
export function RewardDashboard({ userId }: RewardDashboardProps) {
  const rewards = getUserRewards(userId)
  
  // MeeBot provides encouraging feedback based on reward count
  if (rewards.length === 0) {
    MeeBot.setSprite('encouraging')
    MeeBot.speak('ยังไม่มี badge เลยครับ ลองทำเควสดูนะ!')
  } else if (rewards.length < 5) {
    MeeBot.setSprite('proud')
    MeeBot.speak(`คุณได้รับ ${rewards.length} badge แล้วครับ เก่งมาก!`)
  } else {
    MeeBot.setSprite('celebrate')
    MeeBot.speak(`ว้าว! คุณได้รับทั้งหมด ${rewards.length} badge แล้ว สุดยอดเลยครับ!`)
  }

  return (
    <div className="reward-dashboard">
      <h2>🎖️ Badge ที่คุณได้รับ</h2>
      {rewards.length === 0 ? (
        <p>คุณยังไม่ได้รับ badge เลย ลองทำเควสให้สำเร็จดูนะ!</p>
      ) : (
        <ul className="reward-list">
          {rewards.map((r, i) => (
            <li key={i} className="reward-item">
              <div className="reward-info">
                <strong>เควส:</strong> {r.questId}
              </div>
              <div className="reward-info">
                <strong>Badge:</strong> {r.badgeId}
              </div>
              <div className="reward-info">
                <strong>เวลา:</strong> {new Date(r.timestamp).toLocaleString('th-TH')}
              </div>
              <div className="reward-status">
                {r.fallbackUsed ? (
                  <span className="fallback-badge">✅ ได้จากระบบ fallback</span>
                ) : (
                  <span className="primary-badge">🚀 ได้จากระบบปกติ</span>
                )}
              </div>
              {r.txHash && (
                <div className="reward-tx">
                  <small>TX: {r.txHash.slice(0, 10)}...</small>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Compact version of reward display for smaller UI areas
 */
export function RewardBadgeCount({ userId }: { userId: string }) {
  const rewards = getUserRewards(userId)
  const primaryCount = rewards.filter(r => !r.fallbackUsed).length
  const fallbackCount = rewards.filter(r => r.fallbackUsed).length
  
  return (
    <div className="reward-badge-count">
      <span className="total-badges">
        🎖️ {rewards.length} badge{rewards.length !== 1 ? 's' : ''}
      </span>
      {rewards.length > 0 && (
        <small className="badge-breakdown">
          ({primaryCount} ปกติ, {fallbackCount} fallback)
        </small>
      )}
    </div>
  )
}
