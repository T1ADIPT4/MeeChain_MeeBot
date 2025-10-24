export default function Leaderboard({ contributors }) {
  const sorted = [...contributors].sort((a, b) => b.totalMEE - a.totalMEE)

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-2">🏆 Leaderboard</h2>
      <ul>
        {sorted.slice(0, 5).map((c, i) => (
          <li key={i}>
            #{i + 1} {c.wallet.slice(0, 6)}… — {c.totalMEE.toFixed(2)} MEE
          </li>
        ))}
      </ul>
    </div>
  )
}
