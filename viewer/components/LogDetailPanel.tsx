import React, { useState } from 'react';

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

interface LogDetailPanelProps {
  flag: RefundFlag | null;
  onClose: () => void;
  onConfirm?: (refundId: string, approved: boolean, notes: string) => void;
}

export default function LogDetailPanel({ flag, onClose, onConfirm }: LogDetailPanelProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!flag) {
    return null;
  }

  const handleConfirm = async (approved: boolean) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/logs/flag/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundId: flag.refundId,
          approved,
          confirmedBy: '0xDAOReviewer', // Should come from wallet context
          notes: notes || undefined
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        onConfirm?.(flag.refundId, approved, notes);
        onClose();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to confirm flag');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="log-detail-panel fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">🔍 Refund Flag Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Refund ID</label>
                <code className="block mt-1 text-sm bg-gray-100 p-2 rounded">{flag.refundId}</code>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block mt-1 px-3 py-1 rounded text-sm ${
                  flag.status === 'approved' ? 'bg-green-100 text-green-800' :
                  flag.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {flag.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Requester</label>
              <code className="block mt-1 text-sm bg-gray-100 p-2 rounded">{flag.requester}</code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction</label>
              <div className="flex items-center gap-2 mt-1">
                <a 
                  href={`https://bscscan.com/tx/${flag.transaction}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View on BscScan
                </a>
                {flag.signatureVerified && (
                  <span className="text-green-600 text-sm">✅ Signature Verified</span>
                )}
              </div>
              <code className="block mt-1 text-sm bg-gray-100 p-2 rounded break-all">{flag.transaction}</code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <p className="mt-1 text-sm bg-gray-100 p-2 rounded">{flag.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Flagged By</label>
                <code className="block mt-1 text-sm bg-gray-100 p-2 rounded">{flag.flaggedBy}</code>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Flagged At</label>
                <p className="mt-1 text-sm bg-gray-100 p-2 rounded">
                  {new Date(flag.flaggedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {flag.confirmedBy && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmed By</label>
                    <code className="block mt-1 text-sm bg-gray-100 p-2 rounded">{flag.confirmedBy}</code>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmed At</label>
                    <p className="mt-1 text-sm bg-gray-100 p-2 rounded">
                      {flag.confirmedAt && new Date(flag.confirmedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {flag.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                    <p className="mt-1 text-sm bg-gray-100 p-2 rounded">{flag.notes}</p>
                  </div>
                )}
              </>
            )}

            {flag.status === 'pending' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    className="mt-1 w-full p-2 border rounded text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleConfirm(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => handleConfirm(true)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    ✅ Approve
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
