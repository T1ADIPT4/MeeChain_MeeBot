import React, { useState, useEffect } from 'react';
import type { ContributorStats, Badge } from '../../src/services/contributorReputationService';

interface ContributorPanelProps {
  address: string | null;
}

export default function ContributorPanel({ address }: ContributorPanelProps) {
  const [data, setData] = useState<ContributorStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setData(null);
      return;
    }

    setIsLoading(true);
    
    // Mock API call - replace with actual fetch when backend is ready
    fetch(`/api/contributors/${address}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setData(null);
        setIsLoading(false);
      });

    // Fetch badge definitions
    fetch('/api/badges')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setBadges(result.data);
        }
      })
      .catch(() => {});
  }, [address]);

  if (!address) {
    return (
      <div className="contributor-panel">
        <h3>👤 Contributor Profile</h3>
        <p>Select a contributor to view their stats</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="contributor-panel">
        <h3>👤 Contributor Profile</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="contributor-panel">
        <h3>👤 Contributor Profile</h3>
        <p>Contributor not found</p>
      </div>
    );
  }

  const getBadgeInfo = (badgeId: string) => {
    return badges.find(b => b.id === badgeId);
  };

  const validationRate = data.totalFlags > 0 
    ? ((data.validatedFlags / data.totalFlags) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="contributor-panel">
      <h3>👤 Contributor Profile</h3>
      <div className="contributor-info">
        <div className="info-row">
          <strong>Address:</strong>
          <span className="address-short">{data.address.slice(0, 6)}...{data.address.slice(-4)}</span>
        </div>
        {data.name && (
          <div className="info-row">
            <strong>Name:</strong>
            <span>{data.name}</span>
          </div>
        )}
        <div className="info-row">
          <strong>Reputation Score:</strong>
          <span className="score">{data.score}</span>
        </div>
      </div>

      <div className="contributor-stats">
        <h4>📊 Statistics</h4>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-label">Total Flags</span>
            <span className="stat-value">{data.totalFlags}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Validated</span>
            <span className="stat-value success">{data.validatedFlags}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Rejected</span>
            <span className="stat-value error">{data.rejectedFlags}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">{validationRate}%</span>
          </div>
        </div>
      </div>

      <div className="contributor-badges">
        <h4>🏅 Badges</h4>
        {data.badges.length === 0 ? (
          <p>No badges yet</p>
        ) : (
          <ul className="badge-list">
            {data.badges.map((badgeId) => {
              const badge = getBadgeInfo(badgeId);
              return (
                <li key={badgeId} className="badge-item">
                  <span className="badge-icon">{badge?.icon || '🏅'}</span>
                  <div className="badge-info">
                    <strong>{badge?.name || badgeId}</strong>
                    <p>{badge?.description || ''}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="contributor-actions">
        <h4>📝 Recent Actions</h4>
        {data.actions.length === 0 ? (
          <p>No actions yet</p>
        ) : (
          <ul className="action-list">
            {data.actions.slice(-5).reverse().map((action, idx) => (
              <li key={idx} className="action-item">
                <span className="action-timestamp">
                  {new Date(action.timestamp).toLocaleDateString()}
                </span>
                <span className="action-type">{action.actionType}</span>
                <span className={`action-score ${action.scoreImpact > 0 ? 'positive' : 'negative'}`}>
                  {action.scoreImpact > 0 ? '+' : ''}{action.scoreImpact}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
