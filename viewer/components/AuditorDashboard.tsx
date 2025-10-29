import { useState } from 'react';
import ContributorLeaderboard from './ContributorLeaderboard';
import FlagReviewPanel from './FlagReviewPanel';
import BadgeUnlockAnimation from './BadgeUnlockAnimation';

export default function AuditorDashboard() {
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState('');
  const [currentUserAddress] = useState('0x1234567890abcdef');

  const handleReviewComplete = (approved: boolean) => {
    console.log('Review completed:', approved);
    // Simulate badge unlock
    setNewBadgeName('Watchdog');
    setShowBadgeAnimation(true);
  };

  const handleBadgeAnimationComplete = () => {
    setTimeout(() => {
      setShowBadgeAnimation(false);
    }, 2000);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      background: '#f7fafc',
      minHeight: '100vh',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#1a202c',
      }}>
        🛡️ Auditor Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '2rem',
      }}>
        {/* Flag Review Section */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#2d3748',
          }}>
            📋 Pending Reviews
          </h2>
          <FlagReviewPanel
            refundId="REFUND-2024-001"
            currentUserAddress={currentUserAddress}
            onReviewComplete={handleReviewComplete}
          />
        </div>

        {/* Contributor Leaderboard */}
        <div>
          <ContributorLeaderboard />
        </div>
      </div>

      {/* Demo Button to trigger badge animation */}
      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#2d3748',
        }}>
          🎮 Demo Controls
        </h3>
        <button
          onClick={() => {
            setNewBadgeName('Champion');
            setShowBadgeAnimation(true);
          }}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🎉 Trigger Badge Animation
        </button>
      </div>

      {/* Badge Unlock Animation Overlay */}
      {showBadgeAnimation && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setShowBadgeAnimation(false)}
          />
          <BadgeUnlockAnimation
            badgeName={newBadgeName}
            onComplete={handleBadgeAnimationComplete}
          />
        </>
      )}
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
