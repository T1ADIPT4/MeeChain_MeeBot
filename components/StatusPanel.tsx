import React from 'react'
export default function StatusPanel({ status, version }: { status: 'online' | 'offline'; version: string }) {
  const color = status === 'online' ? 'text-green-400' : 'text-red-400'

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 text-white space-y-2">
      <h2 className="text-lg font-bold">สถานะระบบ</h2>
      <p className={color}>● {status === 'online' ? 'ออนไลน์' : 'ออฟไลน์'}</p>
      <p className="text-sm text-gray-400">เวอร์ชัน: {version}</p>
    </div>
  )
}
