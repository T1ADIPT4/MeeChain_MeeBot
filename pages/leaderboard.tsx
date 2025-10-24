import React from 'react'
import LeaderboardItem from '../components/LeaderboardItem'

const mockLeaders = [
  { rank: 1, name: 'Alice', score: 120 },
  { rank: 2, name: 'Bob', score: 100 },
]

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-4">
      <h1 className="text-xl font-bold">Contributor Leaderboard</h1>
      {mockLeaders.map((user, i) => (
        <LeaderboardItem key={i} {...user} />
      ))}
    </div>
  )
}
