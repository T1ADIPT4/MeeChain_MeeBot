// tracker/RewardDashboard.tsx

import { getUserRewards } from './RewardTracker.js'
import { MeeBot } from '../components/MeeBot.js'

export function RewardDashboard({ userId }: { userId: string }) {
  const rewards = getUserRewards(userId)

  MeeBot.setSprite('proud')
  MeeBot.speak(`คุณได้รับทั้งหมด ${rewards.length} badge แล้วครับ เก่งมาก!`)

  return (
    <div>
      <h2>🎖️ Badge ที่คุณได้รับ</h2>
      <ul>
        {rewards.map((r, i) => (
          <li key={i}>
            เควส: {r.questId} | Badge: {r.badgeId} | เวลา: {new Date(r.timestamp).toLocaleString()} | 
            {r.fallbackUsed ? '✅ fallback' : '🚀 ปกติ'}
          </li>
        ))}
      </ul>
    </div>
  )
}
