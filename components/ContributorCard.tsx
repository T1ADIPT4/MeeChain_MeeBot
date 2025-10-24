import Link from 'next/link'

export default function ContributorCard({ contributor }) {
  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <h3 className="font-bold text-lg">{contributor.wallet.slice(0, 10)}…</h3>
      <p>🎯 Tasks: {contributor.taskCount}</p>
      <p>💸 MEE: {contributor.totalMEE.toFixed(2)}</p>
      <Link
        href={`/contributor/${contributor.wallet}`}
        className="text-blue-400 underline text-sm mt-2 block"
      >
        ดู Timeline
      </Link>
    </div>
  )
}
