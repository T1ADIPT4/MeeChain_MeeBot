import React from 'react'
import { useRouter } from 'next/router'

export default function TimelinePage() {
  const { query } = useRouter()
  const wallet = query.wallet as string

  return newFunction()

  function newFunction() {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-4">กิจกรรมของผู้ใช้</h1>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <p>Wallet: {wallet}</p>
          {/* TODO: fetch timeline from Firestore */}
          <ul className="space-y-2">
            <li>🟢 เคลม MEE แล้ว</li>
            <li>🏅 รับ Badge Contributor</li>
            <li>🗳️ โหวต Proposal #2</li>
          </ul>
        </div>
      </div>
    )
  }
}
