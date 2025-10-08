// admin/Leaderboard.tsx

/**
 * Leaderboard Component for MeeChain
 * Displays user rankings based on badge count
 */

import React from 'react'
import { getAllRewards } from '../tracker/RewardTracker'
import type { LeaderboardEntry } from './AdminTypes'

export function Leaderboard() {
  const rewards = getAllRewards()
  
  // Count badges per user
  const leaderboard = rewards.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sort by badge count (descending)
  const sorted: LeaderboardEntry[] = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .map(([userId, badgeCount], index) => ({
      userId,
      badgeCount,
      rank: index + 1,
    }))

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      {sorted.length === 0 ? (
        <p>ยังไม่มีผู้ใช้ที่ได้รับ badge</p>
      ) : (
        <ol>
          {sorted.map((entry) => (
            <li key={entry.userId}>
              <strong>#{entry.rank}</strong> {entry.userId} – {entry.badgeCount} badge
              {entry.badgeCount > 1 ? 's' : ''}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
