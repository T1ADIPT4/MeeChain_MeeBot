import React from 'react'
import { useState } from 'react'

export default function ClaimPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleClaim = async () => {
    try {
      // TODO: connect wallet + call claim API
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">เคลม MEE ของคุณ</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <p>กดปุ่มด้านล่างเพื่อเคลม MEE ที่คุณมีสิทธิ์</p>
        <button
          onClick={handleClaim}
          className="bg-[#00E0CA] text-black px-4 py-2 rounded-lg shadow hover:scale-105 transition-all duration-200"
        >
          เคลมเลย
        </button>
        {status === 'success' && <p className="text-green-400">✅ เคลมสำเร็จ!</p>}
        {status === 'error' && <p className="text-red-400">❌ เกิดข้อผิดพลาด</p>}
      </div>
    </div>
  )
}
