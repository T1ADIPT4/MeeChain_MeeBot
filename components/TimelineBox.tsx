import React from 'react'
export default function TimelineBox({ icon, description, timestamp }: { icon: string; description: string; timestamp: string }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 text-white space-y-1">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <p>{description}</p>
      </div>
      <p className="text-xs text-gray-400">{timestamp}</p>
    </div>
  )
}
