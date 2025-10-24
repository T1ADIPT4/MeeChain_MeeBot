import { useEffect, useState } from 'react'
import { generateWeeklySummary } from '../utils/weeklySummary'

export default function WeeklySummary({ wallet }) {
  const [summary, setSummary] = useState('')

  useEffect(() => {
    generateWeeklySummary(wallet).then(setSummary)
  }, [wallet])

  return summary ? (
    <div className="bg-gray-800 text-white p-4 rounded mb-4">{summary}</div>
  ) : null
}
