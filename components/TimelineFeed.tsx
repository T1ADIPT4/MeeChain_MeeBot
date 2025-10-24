import { useEffect, useState } from 'react'
import { db } from '../utils/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

export default function TimelineFeed({ wallet }) {
  const [activity, setActivity] = useState([])

  useEffect(() => {
    const ref = collection(db, 'contributors', wallet, 'activity')
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map(doc => doc.data())
      setActivity(data.sort((a, b) => b.timestamp - a.timestamp))
    })
    return () => unsub()
  }, [wallet])

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">🤖 MeeBot Activity Feed</h2>
      <ul className="space-y-3">
        {activity.map((a, i) => (
          <li key={i} className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">{new Date(a.timestamp).toLocaleString()}</div>
            <div className="text-white font-semibold">{a.message}</div>
            {a.txHash && (
              <a
                href={`https://polygonscan.com/tx/${a.txHash}`}
                target="_blank"
                className="text-blue-400 underline text-sm"
              >
                🔗 ดูธุรกรรม
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
