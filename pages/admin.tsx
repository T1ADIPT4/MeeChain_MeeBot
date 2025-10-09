/**
 * Admin Page
 * Admin interface for manual badge minting with network and contract selection
 */

import React, { useState } from 'react'
import { getContractAddress } from '../utils/registry'
import { mintBadge } from '../utils/mockData'
import { getAvailableNetworks } from '../src/config/registryLoader'

/**
 * Trigger manual badge minting override
 * @param userId - User ID to mint badge for
 * @param questId - Quest ID for the badge
 * @param chain - Network chain to use
 */
function triggerOverrideBadge(userId: string, questId: string, chain: string) {
  const badgeContract = getContractAddress(chain, 'badge')
  mintBadge(userId, questId, badgeContract)
}

export function Admin() {
  const [userId, setUserId] = useState('')
  const [questId, setQuestId] = useState('')
  const [selectedChain, setSelectedChain] = useState('polygon')
  const [mintStatus, setMintStatus] = useState<string | null>(null)

  const availableNetworks = getAvailableNetworks()

  const handleMint = () => {
    if (!userId || !questId) {
      setMintStatus('❌ Please fill in all fields')
      return
    }

    try {
      triggerOverrideBadge(userId, questId, selectedChain)
      const contract = getContractAddress(selectedChain, 'badge')
      setMintStatus(`✅ Badge minted for ${userId} on ${selectedChain} (${contract})`)
      
      // Clear form
      setUserId('')
      setQuestId('')
    } catch (error) {
      setMintStatus(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="admin-page">
      <h1>🛡️ Admin Panel</h1>
      
      <div className="admin-content">
        <section className="override-section">
          <h2>Manual Badge Minting Override</h2>
          <p>Override badge minting with manual network and contract selection</p>
          
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., user-001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="questId">Quest ID:</label>
            <input
              id="questId"
              type="text"
              value={questId}
              onChange={(e) => setQuestId(e.target.value)}
              placeholder="e.g., quest-001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="chain">Network Chain:</label>
            <select
              id="chain"
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
            >
              {availableNetworks.map((network) => (
                <option key={network} value={network}>
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="contract-info">
            <h3>Selected Contract Information</h3>
            <div className="contract-details">
              <div className="detail-row">
                <span className="label">Badge Contract:</span>
                <span className="value">{getContractAddress(selectedChain, 'badge')}</span>
              </div>
              <div className="detail-row">
                <span className="label">Quest Contract:</span>
                <span className="value">{getContractAddress(selectedChain, 'quest')}</span>
              </div>
              <div className="detail-row">
                <span className="label">Fallback Contract:</span>
                <span className="value">{getContractAddress(selectedChain, 'fallback')}</span>
              </div>
            </div>
          </div>

          <button onClick={handleMint} className="mint-button">
            Mint Badge
          </button>

          {mintStatus && (
            <div className={`status-message ${mintStatus.startsWith('✅') ? 'success' : 'error'}`}>
              {mintStatus}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .admin-page {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .admin-page h1 {
          margin-bottom: 30px;
        }

        .override-section {
          background: #f5f5f5;
          padding: 25px;
          border-radius: 8px;
        }

        .override-section h2 {
          margin-top: 0;
          margin-bottom: 10px;
        }

        .override-section p {
          color: #666;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .contract-info {
          background: white;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }

        .contract-info h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .contract-details {
          font-family: monospace;
          font-size: 13px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row .label {
          color: #666;
        }

        .detail-row .value {
          color: #059669;
        }

        .mint-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
        }

        .mint-button:hover {
          background: #1d4ed8;
        }

        .status-message {
          margin-top: 15px;
          padding: 12px;
          border-radius: 6px;
          font-weight: 500;
        }

        .status-message.success {
          background: #d1fae5;
          color: #065f46;
        }

        .status-message.error {
          background: #fee2e2;
          color: #991b1b;
        }
      `}</style>
    </div>
  )
}
