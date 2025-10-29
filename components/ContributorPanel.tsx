/**
 * ContributorPanel Component
 * Displays auditor reputation, badges, and statistics
 */

import React, { useState, useEffect } from 'react'
import type { Reputation, Badge } from '../src/types/auditor'
import { getReputation } from '../src/services/reputationService'
import { getUserBadges, getBadgeProgress } from '../src/services/badgeService'

interface ContributorPanelProps {
  auditorAddress: string
}

export function ContributorPanel({ auditorAddress }: ContributorPanelProps) {
  const [reputation, setReputation] = useState<Reputation | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [badgeProgress, setBadgeProgress] = useState<any[]>([])

  useEffect(() => {
    loadData()
    // Refresh every 5 seconds to show updates
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [auditorAddress])

  const loadData = () => {
    const rep = getReputation(auditorAddress)
    setReputation(rep)
    setBadges(getUserBadges(auditorAddress))
    setBadgeProgress(getBadgeProgress(auditorAddress, rep))
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="contributor-panel">
      <style>{`
        .contributor-panel {
          padding: 1.5rem;
          background: white;
        }
        .panel-header {
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
          margin-bottom: 1.5rem;
        }
        .panel-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }
        .auditor-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .auditor-details {
          flex: 1;
        }
        .auditor-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
        }
        .auditor-role {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stats-section {
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .reputation-score {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          margin-bottom: 1rem;
        }
        .score-label {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }
        .score-value {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .stat-card {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.25rem;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badges-section {
          margin-bottom: 1.5rem;
        }
        .badges-grid {
          display: grid;
          gap: 0.75rem;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .badge-item:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }
        .badge-icon {
          font-size: 1.5rem;
        }
        .badge-info {
          flex: 1;
        }
        .badge-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
          margin-bottom: 0.125rem;
        }
        .badge-desc {
          font-size: 0.75rem;
          color: #64748b;
        }
        .empty-badges {
          text-align: center;
          padding: 2rem 1rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .progress-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .progress-item {
          margin-bottom: 0.75rem;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.375rem;
        }
        .progress-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }
        .progress-value {
          font-size: 0.75rem;
          color: #64748b;
        }
        .progress-bar {
          height: 4px;
          background: #f1f5f9;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }
        .action-btn {
          width: 100%;
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: #5568d3;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="panel-header">
        <h3 className="panel-title">👤 Auditor Profile</h3>
        <div className="auditor-info">
          <div className="avatar">🛡️</div>
          <div className="auditor-details">
            <div className="auditor-name">{formatAddress(auditorAddress)}</div>
            <div className="auditor-role">Auditor</div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="section-title">🏆 Reputation</div>
        {reputation && (
          <>
            <div className="reputation-score">
              <div className="score-label">Total Score</div>
              <div className="score-value">{reputation.score}</div>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{reputation.flags}</div>
                <div className="stat-label">Flags</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reputation.reviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="badges-section">
        <div className="section-title">🏅 Badges ({badges.length})</div>
        {badges.length > 0 ? (
          <div className="badges-grid">
            {badges.map((badge) => (
              <div key={badge.id} className="badge-item">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-desc">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-badges">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎖️</div>
            <div>Complete audits to earn badges</div>
          </div>
        )}
      </div>

      {reputation && badgeProgress.length > 0 && (
        <div className="progress-section">
          <div className="section-title">📊 Badge Progress</div>
          {badgeProgress.filter(p => !p.unlocked).slice(0, 3).map((progress, idx) => {
            const progressPercent = (() => {
              if (progress.rule.id === 'watchdog') return (reputation.flags / 5) * 100
              if (progress.rule.id === 'eagle-eye') return (reputation.flags / 20) * 100
              if (progress.rule.id === 'truth-seeker') return (reputation.reviews / 10) * 100
              if (progress.rule.id === 'master-auditor') return (reputation.reviews / 50) * 100
              if (progress.rule.id === 'auditor-og') return (reputation.score / 100) * 100
              if (progress.rule.id === 'legend') return (reputation.score / 500) * 100
              return 0
            })()

            return (
              <div key={idx} className="progress-item">
                <div className="progress-header">
                  <span className="progress-name">{progress.rule.name}</span>
                  <span className="progress-value">{progress.progress}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button 
          className="action-btn"
          onClick={() => window.location.href = '/auditor/history'}
        >
          📜 View Audit History
        </button>
      </div>
    </div>
  )
}
