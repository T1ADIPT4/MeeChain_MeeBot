/**
 * RefundLogTable Component
 * Displays refund logs in a table format
 */

import React from 'react'
import type { RefundLog } from '../src/types/auditor'

interface RefundLogTableProps {
  logs: RefundLog[]
  selectedLog: RefundLog | null
  onSelectLog: (log: RefundLog) => void
}

export function RefundLogTable({ logs, selectedLog, onSelectLog }: RefundLogTableProps) {
  const getStatusIcon = (status: RefundLog['status']) => {
    switch (status) {
      case 'success': return '✅'
      case 'failed': return '❌'
      case 'flagged': return '🚩'
      default: return '⏳'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="refund-log-table-container">
      <style>{`
        .refund-log-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .table-header {
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          color: #334155;
        }
        .table-wrapper {
          flex: 1;
          overflow-y: auto;
        }
        .refund-log-table {
          width: 100%;
          border-collapse: collapse;
        }
        .refund-log-table th {
          position: sticky;
          top: 0;
          background: #f8fafc;
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e2e8f0;
          z-index: 10;
        }
        .refund-log-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .refund-log-table tbody tr {
          cursor: pointer;
          transition: background 0.2s;
        }
        .refund-log-table tbody tr:hover {
          background: #f8fafc;
        }
        .refund-log-table tbody tr.selected {
          background: #ede9fe;
        }
        .status-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
        .address-cell {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          color: #6366f1;
        }
        .tx-cell {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          color: #0ea5e9;
        }
        .flag-indicator {
          font-size: 1.25rem;
        }
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: #94a3b8;
        }
      `}</style>

      <div className="table-header">
        📋 Refund Transaction Logs ({logs.length})
      </div>
      <div className="table-wrapper">
        {logs.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <div>No refund logs found</div>
          </div>
        ) : (
          <table className="refund-log-table">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Status</th>
                <th>Confirmation Time</th>
                <th>Refund Tx</th>
                <th>Amount</th>
                <th>Chain</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className={selectedLog?.id === log.id ? 'selected' : ''}
                >
                  <td className="address-cell">{formatAddress(log.requester)}</td>
                  <td>
                    <div className="status-cell">
                      <span>{getStatusIcon(log.status)}</span>
                      <span>{log.status}</span>
                    </div>
                  </td>
                  <td>{formatDate(log.confirmationTime)}</td>
                  <td className="tx-cell">{formatAddress(log.refundTx)}</td>
                  <td>{log.amount || '-'}</td>
                  <td>{log.chain || '-'}</td>
                  <td className="flag-indicator">
                    {log.flagged ? '🚩' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
