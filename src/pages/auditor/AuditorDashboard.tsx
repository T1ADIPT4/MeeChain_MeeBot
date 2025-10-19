/**
 * Auditor Dashboard for MeeChain Singapore
 * DAO Governance Integration - Refund Log Management
 */

import React, { useState, useEffect } from 'react'

interface RefundLog {
  refundId: string
  userAddress: string
  txHash: string
  amount: string
  status: 'pending' | 'verified' | 'refunded' | 'failed'
  verifiedAt?: string
  refundTxHash?: string
  reason?: string
  executedBy?: string
  createdAt: string
  updatedAt: string
}

interface RefundFlag {
  refundId: string
  reason: string
  flaggedBy: string
  flaggedAt: string
  status: 'open' | 'resolved' | 'dismissed'
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

export const AuditorDashboard: React.FC = () => {
  const [logs, setLogs] = useState<RefundLog[]>([])
  const [flags, setFlags] = useState<RefundFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<string | null>(null)
  const [flagReason, setFlagReason] = useState('')
  const [flaggedBy, setFlaggedBy] = useState('')
  const [showFlagModal, setShowFlagModal] = useState(false)

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs()
    fetchFlags()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/logs`)
      if (!response.ok) throw new Error('Failed to fetch logs')
      const data = await response.json()
      setLogs(data.data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchFlags = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/flags/all`)
      if (!response.ok) throw new Error('Failed to fetch flags')
      const data = await response.json()
      setFlags(data.data || [])
    } catch (err) {
      console.error('Failed to fetch flags:', err)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/export-csv`)
      if (!response.ok) throw new Error('Failed to export CSV')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'meechain_refund_logs.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export CSV')
    }
  }

  const handleFlagLog = async (refundId: string) => {
    setSelectedLog(refundId)
    setShowFlagModal(true)
  }

  const submitFlag = async () => {
    if (!selectedLog || !flagReason || !flaggedBy) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundId: selectedLog,
          reason: flagReason,
          flaggedBy
        })
      })

      if (!response.ok) throw new Error('Failed to flag log')

      alert('Log flagged successfully')
      setShowFlagModal(false)
      setFlagReason('')
      setFlaggedBy('')
      fetchFlags()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to flag log')
    }
  }

  const createProposal = (log: RefundLog) => {
    const proposalText = `### Refund Audit Proposal

**ผู้ขอ:** ${log.userAddress}
**ธุรกรรม:** [ดูบน BscScan](https://bscscan.com/tx/${log.txHash})
**เหตุผล:** ${log.reason || 'N/A'}
**สถานะ:** ${log.status}
${log.verifiedAt ? `**เวลายืนยัน:** ${new Date(log.verifiedAt).toLocaleString('th-TH')}` : ''}
${log.refundTxHash ? `**ธุรกรรม refund:** [${log.refundTxHash}](https://bscscan.com/tx/${log.refundTxHash})` : ''}
**Log:** [ดาวน์โหลด CSV](${API_BASE_URL}/api/logs/export-csv)

ขอให้ DAO รับรองการคืนเหรียญและบันทึกในระบบ governance`

    // Copy to clipboard
    navigator.clipboard.writeText(proposalText).then(() => {
      alert('Proposal text copied to clipboard! You can now paste it into Snapshot or your DAO platform.')
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10b981'
      case 'refunded': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'failed': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'verified': return '✅'
      case 'refunded': return '💰'
      case 'pending': return '⏳'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  const getFlagsForLog = (refundId: string) => {
    return flags.filter(flag => flag.refundId === refundId && flag.status === 'open')
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px' }}>⏳ Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
        <div style={{ fontSize: '24px' }}>❌ Error</div>
        <div style={{ marginTop: '10px' }}>{error}</div>
        <button 
          onClick={fetchLogs}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔍 MeeChain Auditor Dashboard
          </h1>
          <p style={{ margin: '0', color: '#6b7280', fontSize: '16px' }}>
            DAO Governance Integration - Refund Log Management System
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleExportCSV}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📥 Export CSV
            </button>
            <button 
              onClick={fetchLogs}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Refunds</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{logs.length}</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Pending</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {logs.filter(l => l.status === 'pending').length}
            </div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Verified</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {logs.filter(l => l.status === 'verified').length}
            </div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Flagged</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
              {flags.filter(f => f.status === 'open').length}
            </div>
          </div>
        </div>

        {/* Refund Logs Table */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#1f2937' }}>
            Refund Logs
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Refund ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>User Address</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Reason</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Verified At</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const logFlags = getFlagsForLog(log.refundId)
                  const hasFlagWarning = logFlags.length > 0

                  return (
                    <tr key={log.refundId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '24px',
                            filter: hasFlagWarning ? 'brightness(0.7)' : 'none'
                          }}>
                            {getStatusEmoji(log.status)}
                          </span>
                          {hasFlagWarning && <span style={{ fontSize: '20px' }}>🚩</span>}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px' }}>
                        {log.refundId}
                      </td>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px' }}>
                        {log.userAddress.substring(0, 10)}...
                      </td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>
                        {log.amount} MEE
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {log.reason || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {log.verifiedAt ? new Date(log.verifiedAt).toLocaleDateString('th-TH') : '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => createProposal(log)}
                            style={{
                              padding: '8px 16px',
                              background: '#8b5cf6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            📝 Proposal
                          </button>
                          <button
                            onClick={() => handleFlagLog(log.refundId)}
                            style={{
                              padding: '8px 16px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            🚩 Flag
                          </button>
                          {log.txHash && (
                            <a
                              href={`https://bscscan.com/tx/${log.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '8px 16px',
                                background: '#6b7280',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              🔗 View TX
                            </a>
                          )}
                        </div>
                        {hasFlagWarning && (
                          <div style={{ 
                            marginTop: '8px', 
                            fontSize: '12px', 
                            color: '#ef4444',
                            background: '#fee2e2',
                            padding: '6px 10px',
                            borderRadius: '4px'
                          }}>
                            ⚠️ {logFlags.length} flag(s): {logFlags[0].reason}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flag Modal */}
        {showFlagModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>🚩 Flag Refund Log</h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Refund ID
                </label>
                <input
                  type="text"
                  value={selectedLog || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: '#f9fafb'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Your Address
                </label>
                <input
                  type="text"
                  value={flaggedBy}
                  onChange={(e) => setFlaggedBy(e.target.value)}
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Reason
                </label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={submitFlag}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Submit Flag
                </button>
                <button
                  onClick={() => {
                    setShowFlagModal(false)
                    setFlagReason('')
                    setFlaggedBy('')
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditorDashboard
