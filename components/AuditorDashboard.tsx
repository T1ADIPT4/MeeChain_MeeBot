/**
 * Auditor Dashboard Component
 * Main dashboard for auditors to view and manage refund logs
 */

import React, { useState, useEffect } from 'react'
import { FilterBar } from './FilterBar'
import { RefundLogTable } from './RefundLogTable'
import { LogDetailPanel } from './LogDetailPanel'
import { ContributorPanel } from './ContributorPanel'
import type { RefundLog } from '../src/types/auditor'
import { getRefundLogs } from '../src/services/auditorService'

interface AuditorDashboardProps {
  auditorAddress: string
}

export function AuditorDashboard({ auditorAddress }: AuditorDashboardProps) {
  const [logs, setLogs] = useState<RefundLog[]>([])
  const [selectedLog, setSelectedLog] = useState<RefundLog | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: undefined as RefundLog['status'] | undefined,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  })

  // Load refund logs
  useEffect(() => {
    loadLogs()
  }, [filters])

  const loadLogs = () => {
    const filteredLogs = getRefundLogs({
      status: filters.status,
      requester: filters.search || undefined,
      startDate: filters.startDate,
      endDate: filters.endDate
    })
    setLogs(filteredLogs)
  }

  const handleExportCSV = () => {
    const csv = [
      ['Requester', 'Status', 'Confirmation Time', 'Refund Tx', 'Amount', 'Chain', 'Flagged'],
      ...logs.map(log => [
        log.requester,
        log.status,
        log.confirmationTime.toISOString(),
        log.refundTx,
        log.amount || '',
        log.chain || '',
        log.flagged ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `refund-logs-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="auditor-dashboard">
      <style>{`
        .auditor-dashboard {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dashboard-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .btn {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary {
          background: white;
          color: #667eea;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,255,255,0.3);
        }
        .dashboard-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 1.5rem;
          gap: 1.5rem;
        }
        .sidebar {
          width: 320px;
          background: white;
          border-left: 1px solid #e2e8f0;
          overflow-y: auto;
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">
          🛡️ Auditor Dashboard
        </h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            📊 Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => {
            window.location.href = '/badges'
          }}>
            🏅 View Badges
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
          />
          <RefundLogTable
            logs={logs}
            selectedLog={selectedLog}
            onSelectLog={setSelectedLog}
          />
          {selectedLog && (
            <LogDetailPanel
              log={selectedLog}
              auditorAddress={auditorAddress}
              onClose={() => setSelectedLog(null)}
              onUpdate={loadLogs}
            />
          )}
        </div>
        <div className="sidebar">
          <ContributorPanel auditorAddress={auditorAddress} />
        </div>
      </div>
    </div>
  )
}
