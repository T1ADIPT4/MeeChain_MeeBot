/**
 * LogDetailPanel Component
 * Shows detailed information about a selected refund log
 */

import React, { useState } from 'react'
import type { RefundLog } from '../src/types/auditor'
import { submitFlag, completeReview } from '../src/services/auditorService'

interface LogDetailPanelProps {
  log: RefundLog
  auditorAddress: string
  onClose: () => void
  onUpdate: () => void
}

export function LogDetailPanel({ log, auditorAddress, onClose, onUpdate }: LogDetailPanelProps) {
  const [showFlagForm, setShowFlagForm] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')

  const handleFlag = () => {
    if (flagReason.trim()) {
      submitFlag(log.id, auditorAddress, flagReason)
      setShowFlagForm(false)
      setFlagReason('')
      onUpdate()
    }
  }

  const handleReview = async () => {
    await completeReview(log.id, auditorAddress, reviewNotes)
    setReviewNotes('')
    onUpdate()
  }

  const viewOnExplorer = () => {
    const explorers = {
      ethereum: 'https://etherscan.io/tx/',
      polygon: 'https://polygonscan.com/tx/',
      arbitrum: 'https://arbiscan.io/tx/'
    }
    const baseUrl = explorers[log.chain as keyof typeof explorers] || 'https://bscscan.com/tx/'
    window.open(baseUrl + log.refundTx, '_blank')
  }

  return (
    <div className="log-detail-panel">
      <style>{`
        .log-detail-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 500px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 24px rgba(0,0,0,0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .panel-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .panel-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }
        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .info-section {
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .info-label {
          font-weight: 600;
          color: #475569;
        }
        .info-value {
          color: #1e293b;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .status-success {
          background: #dcfce7;
          color: #166534;
        }
        .status-failed {
          background: #fee2e2;
          color: #991b1b;
        }
        .status-flagged {
          background: #fef3c7;
          color: #92400e;
        }
        .panel-actions {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-flag {
          background: #fef3c7;
          color: #92400e;
        }
        .btn-flag:hover {
          background: #fde68a;
        }
        .btn-explorer {
          background: #dbeafe;
          color: #1e40af;
        }
        .btn-explorer:hover {
          background: #bfdbfe;
        }
        .btn-review {
          background: #dcfce7;
          color: #166534;
        }
        .btn-review:hover {
          background: #bbf7d0;
        }
        .flag-form {
          margin-top: 1rem;
          padding: 1rem;
          background: #fef3c7;
          border-radius: 8px;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          font-family: inherit;
          resize: vertical;
        }
        .form-actions {
          display: flex;
          gap: 0.75rem;
        }
        .btn-submit {
          flex: 1;
          background: #667eea;
          color: white;
        }
        .btn-submit:hover {
          background: #5568d3;
        }
        .btn-cancel {
          flex: 1;
          background: #e2e8f0;
          color: #475569;
        }
        .btn-cancel:hover {
          background: #cbd5e1;
        }
      `}</style>

      <div className="panel-header">
        <h3 className="panel-title">📋 Transaction Details</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="panel-content">
        <div className="info-section">
          <div className="section-title">Transaction Information</div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className={`status-badge status-${log.status}`}>
              {log.status === 'success' && '✅ Success'}
              {log.status === 'failed' && '❌ Failed'}
              {log.status === 'flagged' && '🚩 Flagged'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Requester</span>
            <span className="info-value">{log.requester}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Refund Tx</span>
            <span className="info-value">{log.refundTx}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Amount</span>
            <span className="info-value">{log.amount || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Chain</span>
            <span className="info-value">{log.chain || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Time</span>
            <span className="info-value">
              {new Date(log.confirmationTime).toLocaleString('th-TH')}
            </span>
          </div>
        </div>

        {log.flagged && (
          <div className="info-section">
            <div className="section-title">Flag Information</div>
            <div className="info-row">
              <span className="info-label">Flagged By</span>
              <span className="info-value">{log.flaggedBy}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Reason</span>
              <span className="info-value">{log.flagReason}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Flagged At</span>
              <span className="info-value">
                {log.flaggedAt && new Date(log.flaggedAt).toLocaleString('th-TH')}
              </span>
            </div>
          </div>
        )}

        {showFlagForm && (
          <div className="flag-form">
            <div className="section-title">Submit Flag</div>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Enter reason for flagging this transaction..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="form-actions">
              <button className="btn btn-submit" onClick={handleFlag}>
                Submit Flag
              </button>
              <button className="btn btn-cancel" onClick={() => setShowFlagForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="panel-actions">
        {!log.flagged && !showFlagForm && (
          <button className="btn btn-flag" onClick={() => setShowFlagForm(true)}>
            🚩 Flag Transaction
          </button>
        )}
        <button className="btn btn-explorer" onClick={viewOnExplorer}>
          🔍 View on Explorer
        </button>
        <button className="btn btn-review" onClick={handleReview}>
          ✓ Complete Review
        </button>
      </div>
    </div>
  )
}
