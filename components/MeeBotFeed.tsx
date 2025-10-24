
import React, { useEffect, useState } from 'react'
import { db } from '../utils/firebase'
// If the file does not exist, create 'src/utils/firebase.ts' with your Firebase config and export 'db'
import { collection, onSnapshot } from 'firebase/firestore'
import { generateWeeklySummary } from '../utils/weeklySummary'
import { sendThanks } from '../utils/sendThanks'

function getIcon(type: string) {
  switch (type) {
    case 'claim': return '💸'
    case 'badge': return '🎖'
    case 'governance': return '🗳'
    case 'error': return '❌'
    default: return '📍'
  }
}

import type { DocumentData } from 'firebase/firestore'

type ActivityItem = {
  type: string
  timestamp: number
  message: string
  txHash?: string
}

type MeeBotFeedProps = {
  wallet: string
  reviewer?: string
}

export default function MeeBotFeed({ wallet, reviewer }: MeeBotFeedProps) {
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [summary, setSummary] = useState<string>('')
  const [thanksLoading, setThanksLoading] = useState<boolean>(false)
  const [thanksSent, setThanksSent] = useState<boolean>(false)

  useEffect(() => {
    const ref = collection(db, 'contributors', wallet, 'activity')
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map(doc => {
        const d = doc.data()
        return {
          type: d.type || 'unknown',
          timestamp: d.timestamp || 0,
          message: d.message || '',
          txHash: d.txHash,
        } as ActivityItem
      })
      setActivity(data.sort((a, b) => b.timestamp - a.timestamp))
    })
    return () => unsub()
  }, [wallet])

  useEffect(() => {
    generateWeeklySummary(wallet).then(setSummary)
  }, [wallet])

  const filteredActivity = activity.filter((a) =>
    filter === 'all' ? true : a.type === filter
  )

  const handleSendThanks = async () => {
    if (!reviewer) return
    setThanksLoading(true)
    await sendThanks(wallet, reviewer)
    setThanksLoading(false)
    setThanksSent(true)
    setTimeout(() => setThanksSent(false), 2000)
  }

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="md:w-48 w-full p-4 bg-gray-800 text-white rounded-xl shadow-lg mb-4 md:mb-0 md:mr-6">
        <h3 className="font-bold mb-4 text-[#00E0CA]">Filter</h3>
        {['all', 'claim', 'badge', 'governance', 'error'].map((type) => (
          <button
            key={type}
            className={`block mb-2 px-3 py-2 rounded transition-all duration-200 font-semibold ${filter === type ? 'bg-[#00E0CA] text-black shadow' : 'hover:bg-gray-700'}`}
            onClick={() => setFilter(type)}
          >
            {getIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-6">
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#00E0CA]">🤖 MeeBot Activity Feed</h2>
          {summary && (
            <div className="mb-4 p-4 bg-[#3B82F6] rounded text-white font-semibold shadow">
              {summary}
            </div>
          )}
          {reviewer && (
            <button
              className="bg-yellow-400 px-4 py-2 rounded-lg text-black mb-4 font-bold shadow hover:scale-105 transition-all duration-200"
              onClick={handleSendThanks}
              disabled={thanksLoading}
            >
              🙌 ส่งคำขอบคุณ
            </button>
          )}
          {thanksSent && (
            <div className="text-green-400 mb-2">ส่งคำขอบคุณสำเร็จ!</div>
          )}
          <ul className="space-y-4">
            {filteredActivity.map((a, i) => (
              <li key={i} className="bg-gray-800 p-4 rounded-xl shadow transition-all duration-200 hover:scale-105">
                <div className="text-sm text-gray-400">{new Date(a.timestamp).toLocaleString()}</div>
                <div className="text-lg flex items-center gap-2">
                  <span>{getIcon(a.type)}</span>
                  <span className="font-semibold text-[#00E0CA]">{a.message}</span>
                </div>
                {a.txHash && (
                  <a
                    href={`https://polygonscan.com/tx/${a.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline text-sm"
                  >
                    🔗 ดูธุรกรรม
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
