/**
 * Contributor Explorer Page
 * Displays all contributors in a leaderboard format
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllContributors, getLeaderboard } from '../api/contributors.js'
import type { ContributorProfile } from '../services/contributorReputationService.js'
import './ContributorExplorer.css'

export default function ContributorExplorer() {
  const [contributors, setContributors] = useState<ContributorProfile[]>([])
  const [view, setView] = useState<'leaderboard' | 'all'>('leaderboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContributors()
  }, [view])

  const loadContributors = () => {
    setLoading(true)
    const data = view === 'leaderboard' 
      ? getLeaderboard(10) 
      : getAllContributors()
    setContributors(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="loading">Loading contributors...</div>
  }

  return (
    <div className="contributor-explorer">
      <header className="explorer-header">
        <h1>👥 Contributor Explorer</h1>
        <p>Discover and recognize top contributors in the MeeChain ecosystem</p>
        
        <div className="view-toggle">
          <button 
            className={view === 'leaderboard' ? 'active' : ''}
            onClick={() => setView('leaderboard')}
          >
            🏆 Top 10
          </button>
          <button 
            className={view === 'all' ? 'active' : ''}
            onClick={() => setView('all')}
          >
            📊 All Contributors
          </button>
        </div>
      </header>

      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-value">{contributors.length}</div>
          <div className="stat-label">Total Contributors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {contributors.reduce((sum, c) => sum + c.badges.length, 0)}
          </div>
          <div className="stat-label">Total Badges Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {contributors.reduce((sum, c) => sum + c.score, 0)}
          </div>
          <div className="stat-label">Total Reputation Points</div>
        </div>
      </div>

      {contributors.length === 0 ? (
        <div className="empty-state">
          <p>No contributors yet. Be the first to contribute!</p>
        </div>
      ) : (
        <div className="contributors-grid">
          {contributors.map((contributor, index) => (
            <Link 
              to={`/contributor/${contributor.address}`}
              key={contributor.address}
              className="contributor-card"
            >
              <div className="card-header">
                {view === 'leaderboard' && (
                  <div className={`rank rank-${index + 1}`}>
                    {index + 1 <= 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                  </div>
                )}
                <div className="contributor-address">
                  {contributor.name || shortenAddress(contributor.address)}
                </div>
              </div>

              <div className="card-body">
                <div className="contributor-stats">
                  <div className="stat">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-number">{contributor.score}</span>
                    <span className="stat-text">Score</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🏅</span>
                    <span className="stat-number">{contributor.badges.length}</span>
                    <span className="stat-text">Badges</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">✅</span>
                    <span className="stat-number">{contributor.actions.length}</span>
                    <span className="stat-text">Actions</span>
                  </div>
                </div>

                {contributor.badges.length > 0 && (
                  <div className="contributor-badges">
                    <div className="badges-label">Badges:</div>
                    <div className="badges-icons">
                      {contributor.badges.slice(0, 5).map(badge => (
                        <span key={badge.id} className="badge-icon" title={badge.name}>
                          {badge.name.split(' ')[0]}
                        </span>
                      ))}
                      {contributor.badges.length > 5 && (
                        <span className="badge-more">+{contributor.badges.length - 5}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="joined-date">
                  Joined {contributor.joinedAt.toLocaleDateString()}
                </span>
                <span className="view-profile">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
