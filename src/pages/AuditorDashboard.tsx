/**
 * Auditor Dashboard - Monitor and flag refund transactions
 */

import React, { useState, useEffect } from 'react';
import RefundLogsTable from './components/RefundLogsTable';
import RefundLogDetails from './components/RefundLogDetails';
import { RefundLog } from '../../server/types';
import './AuditorDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AuditorDashboard() {
  const [logs, setLogs] = useState<RefundLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RefundLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<RefundLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserAddress] = useState('0x1234567890abcdef1234567890abcdef12345678'); // Mock user address

  // Fetch all logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // Update filtered logs when logs or search criteria change
  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.userAddress.toLowerCase().includes(query) ||
          log.refundId.toLowerCase().includes(query) ||
          (log.txHash && log.txHash.toLowerCase().includes(query))
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate >= start && logDate <= end;
      });
    }

    setFilteredLogs(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleLogSelect = (log: RefundLog) => {
    setSelectedLog(log);
  };

  const handleFlagLog = async (refundId: string) => {
    const reason = prompt('กรุณาระบุเหตุผลที่ต้องการแจ้ง (Please specify the reason for flagging):');
    if (!reason) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundId,
          reason,
          flaggedBy: currentUserAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ แจ้งเตือนสำเร็จ! ทีมตรวจสอบจะดำเนินการต่อไป\n(Flag submitted successfully! The audit team will review it.)');
      } else {
        throw new Error(data.error || 'Failed to flag log');
      }
    } catch (err) {
      alert('❌ แจ้งเตือนล้มเหลว กรุณาลองใหม่\n(Failed to flag log. Please try again.)');
      console.error('Error flagging log:', err);
    }
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Refund ID',
      'User Address',
      'Status',
      'Amount (BNB)',
      'TxHash',
      'Reason',
      'Verified At',
      'Signature Valid',
      'Executed By',
      'Notes',
    ];

    const csvRows = filteredLogs.map(log => [
      log.refundId,
      log.userAddress,
      log.status,
      log.amount,
      log.txHash || '-',
      log.reason,
      log.verifiedAt,
      log.signatureValid ? 'Yes' : 'No',
      log.executedBy,
      log.notes,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `refund-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="auditor-dashboard">
      <div className="dashboard-header">
        <h1>🔍 MeeChain Auditor Dashboard</h1>
        <p>ตรวจสอบธุรกรรม refund ที่เกิดขึ้นอย่างโปร่งใสและปลอดภัย</p>
      </div>

      <div className="dashboard-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="🔍 Search by Address / TxHash / Refund ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="date-filter">
          <label>
            📅 Start Date:
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="date-input"
            />
          </label>
          <label>
            📅 End Date:
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>

        <button onClick={handleExportCSV} className="export-button" disabled={filteredLogs.length === 0}>
          📄 Export CSV
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="dashboard-content">
        <div className="logs-section">
          <h2>📋 Refund Logs Table</h2>
          <RefundLogsTable
            logs={filteredLogs}
            onLogSelect={handleLogSelect}
            selectedLogId={selectedLog?.refundId}
          />
        </div>

        {selectedLog && (
          <div className="details-section">
            <h2>📄 Selected Log Details</h2>
            <RefundLogDetails log={selectedLog} onFlag={handleFlagLog} />
          </div>
        )}
      </div>
    </div>
  );
}
