/**
 * Leaderboard Component for MeeChain
 * Displays user rankings based on badge count
 */

import React from 'react'
import { getAllRewards } from '../tracker/RewardTracker'

export function Leaderboard() {
  const rewards = getAllRewards()

  const leaderboard = rewards.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      <ol>
        {sorted.map(([userId, count], i) => (
          <li key={i}>
            {i + 1}. {userId} – {count} badge
          </li>
        ))}
      </ol>
    </div>
  )
}
