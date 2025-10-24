/**
 * Refund Logs Table Component
 * Displays a table of refund transactions with status indicators
 */

import React from 'react';
import { RefundLog } from '../../../server/types';
import './RefundLogsTable.css';

interface RefundLogsTableProps {
  logs: RefundLog[];
  onLogSelect: (log: RefundLog) => void;
  selectedLogId?: string;
}

export default function RefundLogsTable({
  logs,
  onLogSelect,
  selectedLogId,
}: RefundLogsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const truncateHash = (hash: string | null) => {
    if (!hash) return '-';
    return `${hash.slice(0, 8)}...`;
  };

  return (
    <div className="refund-logs-table-container">
      {logs.length === 0 ? (
        <div className="no-logs">No refund logs found</div>
      ) : (
        <table className="refund-logs-table">
          <thead>
            <tr>
              <th>User Address</th>
              <th>Refund ID</th>
              <th>Status</th>
              <th>Amount (BNB)</th>
              <th>Refund Tx</th>
              <th>Reason</th>
              <th>Verified At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr
                key={log.refundId}
                onClick={() => onLogSelect(log)}
                className={selectedLogId === log.refundId ? 'selected' : ''}
              >
                <td title={log.userAddress}>{truncateAddress(log.userAddress)}</td>
                <td>{log.refundId}</td>
                <td>
                  <span className={`status-badge status-${log.status}`}>
                    {getStatusIcon(log.status)} {log.status}
                  </span>
                </td>
                <td>{log.amount}</td>
                <td title={log.txHash || 'N/A'}>{truncateHash(log.txHash)}</td>
                <td>{log.reason}</td>
                <td>{new Date(log.verifiedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
