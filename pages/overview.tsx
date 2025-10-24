import { useEffect, useState } from 'react'
import { fetchContributors } from '../utils/fetchContributors'
import ContributorCard from '../components/ContributorCard'
import Leaderboard from '../components/Leaderboard'

export default function OverviewPage() {
  const [contributors, setContributors] = useState([])

  useEffect(() => {
    fetchContributors().then(setContributors)
  }, [])

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🌐 Contributor Overview</h1>
      <Leaderboard contributors={contributors} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {contributors.map((c) => (
          <ContributorCard key={c.wallet} contributor={c} />
        ))}
      </div>
    </div>
  )
}
