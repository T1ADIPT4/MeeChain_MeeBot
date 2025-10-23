/**
 * Contributor Profile Page
 * Displays comprehensive contributor information including badges, SBTs, and activity
 */

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getContributor } from '../api/contributors.js'
import type { ContributorProfile as ContributorProfileType } from '../services/contributorReputationService.js'
import './ContributorProfile.css'

export default function ContributorProfile() {
  const { address } = useParams<{ address: string }>()
  const [data, setData] = useState<ContributorProfileType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address) {
      // In production, this would be an API call
      const profile = getContributor(address)
      setData(profile)
      setLoading(false)
    }
  }, [address])

  if (loading) {
    return <div className="loading">Loading contributor profile...</div>
  }

  if (!data) {
    return <div className="error">Contributor not found</div>
  }

  return (
    <div className="contributor-profile">
      <div className="profile-header">
        <h1>👤 Contributor Profile</h1>
        <div className="profile-address">
          {data.name || address}
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Reputation Score</span>
            <span className="stat-value">⭐ {data.score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Badges Earned</span>
            <span className="stat-value">🏅 {data.badges.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Actions Completed</span>
            <span className="stat-value">✅ {data.actions.length}</span>
          </div>
        </div>
      </div>

      <section className="badges-section">
        <h2>🏅 Badges</h2>
        {data.badges.length === 0 ? (
          <p className="empty-state">No badges earned yet. Complete actions to unlock badges!</p>
        ) : (
          <div className="badges-grid">
            {data.badges.map((badge) => (
              <div key={badge.id} className="badge-card">
                <div className="badge-icon">{badge.name}</div>
                <div className="badge-info">
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                  <div className="badge-requirement">
                    Required: {badge.requirement.type} × {badge.requirement.count}
                  </div>
                  {badge.mintedAt && (
                    <div className="badge-minted">
                      Minted: {badge.mintedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sbt-section">
        <h2>📜 Soulbound Tokens</h2>
        {data.sbtTokens.length === 0 ? (
          <p className="empty-state">No SBT tokens minted yet.</p>
        ) : (
          <ul className="sbt-list">
            {data.sbtTokens.map((token) => (
              <li key={token.tokenId} className="sbt-item">
                <div className="sbt-info">
                  <span className="sbt-name">{token.name}</span>
                  <span className="sbt-id">Token ID: {token.tokenId}</span>
                </div>
                <div className="sbt-links">
                  <a 
                    href={`https://bscscan.com/token/${token.contractAddress}?a=${token.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sbt-link"
                  >
                    View on BSCScan →
                  </a>
                  {token.metadataURI && (
                    <a 
                      href={`https://ipfs.io/ipfs/${token.metadataURI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sbt-link"
                    >
                      View Metadata →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="audit-section">
        <h2>🧾 Audit History</h2>
        {data.auditLogs.length === 0 ? (
          <p className="empty-state">No audit logs yet.</p>
        ) : (
          <div className="audit-list">
            {data.auditLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="audit-item">
                <div className="audit-header">
                  <span className="audit-refund-id">{log.refundId}</span>
                  <span className={`audit-status status-${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </div>
                <div className="audit-details">
                  <span className="audit-action">{log.action}</span>
                  <span className="audit-timestamp">
                    {log.timestamp.toLocaleString()}
                  </span>
                </div>
                <a href={`/logs/${log.refundId}`} className="audit-link">
                  View Details →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="actions-section">
        <h2>📊 Recent Actions</h2>
        {data.actions.length === 0 ? (
          <p className="empty-state">No actions recorded yet.</p>
        ) : (
          <div className="actions-list">
            {data.actions.slice(-10).reverse().map((action, index) => (
              <div key={index} className="action-item">
                <div className="action-type">{action.type.replace('_', ' ')}</div>
                <div className="action-details">
                  {action.refundId && <span>Refund: {action.refundId}</span>}
                  {action.proposalId && <span>Proposal: {action.proposalId}</span>}
                  <span className={action.valid ? 'valid' : 'invalid'}>
                    {action.valid ? '✅ Valid' : '❌ Invalid'}
                  </span>
                </div>
                <div className="action-timestamp">
                  {action.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dao-section">
        <h2>🏛️ DAO Participation</h2>
        <div className="dao-actions">
          <button className="dao-button primary">
            📝 Create New Proposal
          </button>
          <button className="dao-button secondary">
            📊 View My Proposals
          </button>
          <button className="dao-button secondary">
            🗳️ View My Votes
          </button>
        </div>
      </section>
    </div>
  )
}
