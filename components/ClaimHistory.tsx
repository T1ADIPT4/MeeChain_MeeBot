import { useEffect, useState } from 'react'
import { db } from '../utils/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

export default function ClaimHistory({ wallet }) {
  const [claims, setClaims] = useState([])

  useEffect(() => {
    const ref = collection(db, 'contributors', wallet, 'claims')
    onSnapshot(ref, (snap) => {
      const data = snap.docs.map(doc => doc.data())
      setClaims(data.sort((a, b) => b.timestamp - a.timestamp))
    })
  }, [wallet])

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">📜 Claim History</h2>
      <ul className="space-y-2">
        {claims.map((c, i) => (
          <li key={i}>
            {c.amount} MEE —{' '}
            <a
              href={`https://polygonscan.com/tx/${c.txHash}`}
              target="_blank"
              className="text-blue-400 underline"
            >
              ดูธุรกรรม
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
