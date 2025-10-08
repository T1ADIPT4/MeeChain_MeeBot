// admin/Leaderboard.tsx

/**
 * Leaderboard component for MeeChain
 * Displays user rankings based on badge count
 */

import React from 'react'
import { getAllRewards } from '../tracker/RewardTracker'
import { LeaderboardEntry } from './AdminTypes'

export function Leaderboard() {
  const rewards = getAllRewards()
  
  // Calculate badge count per user
  const leaderboard = rewards.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sort by badge count descending
  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1])

  // Create leaderboard entries with ranks
  const entries: LeaderboardEntry[] = sorted.map(([userId, count], index) => ({
    userId,
    badgeCount: count,
    rank: index + 1,
  }))

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      <p className="subtitle">Top users by badge count</p>
      <ol className="leaderboard-list">
        {entries.map((entry, i) => (
          <li key={i} className={`leaderboard-item rank-${entry.rank <= 3 ? entry.rank : 'other'}`}>
            <span className="rank">#{entry.rank}</span>
            <span className="user-id">{entry.userId}</span>
            <span className="badge-count">{entry.badgeCount} badge{entry.badgeCount !== 1 ? 's' : ''}</span>
          </li>
        ))}
      </ol>
      {entries.length === 0 && (
        <p className="empty-state">No badges have been earned yet.</p>
      )}
    </div>
  )
}
