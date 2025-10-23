import React, { useState } from 'react';
import RefundLogTable from './RefundLogTable';
import LogDetailPanel from './LogDetailPanel';
import ContributorPanel from './ContributorPanel';
import './AuditorDashboard.css';

interface RefundFlag {
  refundId: string;
  requester: string;
  transaction: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  flaggedBy: string;
  flaggedAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  notes?: string;
  signatureVerified: boolean;
}

export default function AuditorDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedFlag, setSelectedFlag] = useState<RefundFlag | null>(null);
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);

  const handleSelectFlag = (flag: RefundFlag) => {
    setSelectedFlag(flag);
    setSelectedContributor(flag.flaggedBy);
  };

  const handleCloseDetail = () => {
    setSelectedFlag(null);
  };

  const handleConfirm = () => {
    // Refresh the table after confirmation
    setSelectedFlag(null);
    // Force refresh by changing filter momentarily
    const currentFilter = statusFilter;
    setStatusFilter('');
    setTimeout(() => setStatusFilter(currentFilter), 100);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/logs/export-csv');
      const csv = await response.text();
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `refund-audit-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="auditor-dashboard">
      <div className="dashboard-header">
        <h2>🛡️ Auditor Dashboard</h2>
        <p className="text-gray-600">DAO Governance & Contributor Reputation System</p>
      </div>

      <div className="filter-bar bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex-grow"></div>
          
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="dashboard-content grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <RefundLogTable 
              statusFilter={statusFilter}
              onSelectFlag={handleSelectFlag}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <ContributorPanel address={selectedContributor} />
          </div>
        </div>
      </div>

      {selectedFlag && (
        <LogDetailPanel
          flag={selectedFlag}
          onClose={handleCloseDetail}
          onConfirm={handleConfirm}
        />
      )}

      <div className="dashboard-footer mt-4 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">📎 Snapshot Integration</h3>
        <p className="text-sm text-gray-600 mb-2">
          Use the exported CSV file in your Snapshot proposals for transparent governance decisions.
        </p>
        <div className="bg-gray-100 p-3 rounded text-xs">
          <pre className="whitespace-pre-wrap">
{`### Refund Audit Proposal

**ผู้ขอ:** [Requester Address]
**ธุรกรรม:** [View on BscScan](https://bscscan.com/tx/...)
**เหตุผล:** [Reason for flag]
**ลายเซ็น:** ✅ ตรวจสอบแล้ว
**Log CSV:** [ดาวน์โหลด](https://meechain.xyz/api/logs/export-csv)`}
          </pre>
        </div>
      </div>
    </div>
  );
}
