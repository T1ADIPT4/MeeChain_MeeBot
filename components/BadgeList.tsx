/**
 * BadgeList Component
 * Displays user badges with chain provenance information
 */

import React from 'react'
import { getContractAddress } from '../utils/registry'
import { getUserBadges } from '../utils/mockData'

interface BadgeListProps {
  userId: string
}

export function BadgeList({ userId }: BadgeListProps) {
  const badges = getUserBadges(userId)

  return (
    <div className="badge-list">
      <h2>🎖️ Badges</h2>
      {badges.length === 0 ? (
        <p>No badges yet. Complete quests to earn badges!</p>
      ) : (
        <ul>
          {badges.map((b, i) => {
            const chain = b.chain || 'ethereum'
            const contract = getContractAddress(chain, 'badge')
            return (
              <li key={i} className="badge-item">
                <div className="badge-info">
                  <strong>{b.badgeId}</strong> – {b.questId}
                </div>
                <div className="badge-provenance">
                  <span className="chain-label">Chain: {chain}</span>
                  <span className="contract-label">Contract: {contract}</span>
                  {b.txHash && <span className="tx-label">TX: {b.txHash}</span>}
                  {b.timestamp && (
                    <span className="timestamp-label">
                      Date: {b.timestamp.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
