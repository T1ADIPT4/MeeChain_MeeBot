// tracker/RewardDashboard.tsx

import React from 'react'
import { getUserRewards } from './RewardTracker.js'
import { MeeBot } from '../components/MeeBot.js'

export interface RewardDashboardProps {
  userId: string
}

/**
 * RewardDashboard component - displays badges earned by a user
 * Integrates with MeeBot for emotional feedback
 */
export function RewardDashboard({ userId }: RewardDashboardProps) {
  const rewards = getUserRewards(userId)

  // MeeBot provides proud feedback when dashboard is shown
  React.useEffect(() => {
    MeeBot.setSprite('proud')
    MeeBot.speak(`คุณได้รับทั้งหมด ${rewards.length} badge แล้วครับ เก่งมาก!`)
  }, [rewards.length])

  return (
    <div className="reward-dashboard">
      <h2>🎖️ Badge ที่คุณได้รับ</h2>
      {rewards.length === 0 ? (
        <p>ยังไม่มี badge ลองทำเควสให้สำเร็จดูนะครับ!</p>
      ) : (
        <ul className="reward-list">
          {rewards.map((r, i) => (
            <li key={i} className="reward-entry">
              <span className="quest-id">เควส: {r.questId}</span>
              <span className="badge-id">Badge: {r.badgeId}</span>
              <span className="timestamp">เวลา: {new Date(r.timestamp).toLocaleString()}</span>
              <span className={`status ${r.fallbackUsed ? 'fallback' : 'normal'}`}>
                {r.fallbackUsed ? '✅ fallback' : '🚀 ปกติ'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
