import React, { useState, useEffect } from 'react';

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

interface RefundLogTableProps {
  statusFilter?: string;
  onSelectFlag?: (flag: RefundFlag) => void;
}

export default function RefundLogTable({ statusFilter, onSelectFlag }: RefundLogTableProps) {
  const [flags, setFlags] = useState<RefundFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, [statusFilter]);

  const loadFlags = () => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    if (statusFilter) {
      params.append('status', statusFilter);
    }
    
    fetch(`/api/logs?${params.toString()}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setFlags(result.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setFlags([]);
        setIsLoading(false);
      });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="refund-log-table">
        <h3>🔍 Refund Flags</h3>
        <p>Loading flags...</p>
      </div>
    );
  }

  return (
    <div className="refund-log-table">
      <h3>🔍 Refund Flags ({flags.length})</h3>
      
      {flags.length === 0 ? (
        <p>No flags found</p>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Refund ID</th>
              <th className="border p-2 text-left">Transaction</th>
              <th className="border p-2 text-left">Reason</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Flagged By</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((flag) => (
              <tr key={flag.refundId} className="hover:bg-gray-50">
                <td className="border p-2">
                  <code className="text-sm">{flag.refundId.slice(0, 8)}...</code>
                </td>
                <td className="border p-2">
                  <a 
                    href={`https://bscscan.com/tx/${flag.transaction}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {flag.transaction.slice(0, 8)}...
                  </a>
                  {flag.signatureVerified && <span className="ml-2">✅</span>}
                </td>
                <td className="border p-2 max-w-xs truncate">{flag.reason}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(flag.status)}`}>
                    {flag.status}
                  </span>
                </td>
                <td className="border p-2">
                  <code className="text-xs">{flag.flaggedBy.slice(0, 6)}...{flag.flaggedBy.slice(-4)}</code>
                </td>
                <td className="border p-2 text-sm">
                  {new Date(flag.flaggedAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => onSelectFlag?.(flag)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
