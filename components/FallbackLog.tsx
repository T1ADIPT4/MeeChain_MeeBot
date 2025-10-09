/**
 * FallbackLog Component
 * Displays fallback minting logs with chain provenance
 */

import React from 'react'
import { getContractAddress } from '../utils/registry'
import { getFallbackLogs } from '../utils/mockData'

export function FallbackLog() {
  const logs = getFallbackLogs()

  return (
    <div className="fallback-log">
      <h2>🔁 Fallback Log</h2>
      {logs.length === 0 ? (
        <p>No fallback minting events recorded.</p>
      ) : (
        <ul>
          {logs.map((log, i) => {
            const chain = log.chain || 'optimism'
            const fallbackContract = getContractAddress(chain, 'fallback')
            return (
              <li key={i} className="log-item">
                <div className="log-info">
                  <strong>{log.userId}</strong> – {log.questId}
                </div>
                <div className="log-details">
                  <span className="fallback-status">Fallback: ✅</span>
                  <span className="chain-label">Chain: {chain}</span>
                  <span className="contract-label">Contract: {fallbackContract}</span>
                  {log.txHash && <span className="tx-label">TX: {log.txHash}</span>}
                  <span className="timestamp-label">
                    Time: {log.timestamp.toLocaleString()}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
