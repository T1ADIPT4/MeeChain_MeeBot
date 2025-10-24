import React from 'react'
import StatusPanel from '../components/StatusPanel'

export default function StatusPage() {
  const status = 'online'
  const version = 'v1.2.3'

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <StatusPanel status={status} version={version} />
    </div>
  )
}
