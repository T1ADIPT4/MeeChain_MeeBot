import React from 'react'
import { useRouter } from 'next/router'
import TimelineBox from '../../components/TimelineBox'

const mockTimeline = [
  { icon: '🟢', description: 'เคลม MEE แล้ว', timestamp: '2025-10-24 18:00' },
  { icon: '🏅', description: 'รับ Badge Contributor', timestamp: '2025-10-23 20:00' },
]

export default function ContributorTimeline() {
  const { query } = useRouter()
  const wallet = query.wallet as string

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-4">
      <h1 className="text-xl font-bold">กิจกรรมของ {wallet}</h1>
      {mockTimeline.map((item, i) => (
        <TimelineBox key={i} {...item} />
      ))}
    </div>
  )
}
