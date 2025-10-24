import React from 'react'
export default function LeaderboardItem({ rank, name, score }: { rank: number; name: string; score: number }) {
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 shadow text-white">
      <span className="font-bold text-lg">#{rank}</span>
      <span>{name}</span>
      <span className="text-[#00E0CA] font-semibold">{score} pts</span>
    </div>
  )
}
