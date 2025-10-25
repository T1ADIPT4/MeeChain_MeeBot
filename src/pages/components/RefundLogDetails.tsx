/**
 * Refund Log Details Component
 * Displays detailed information about a selected refund log
 */

import React from 'react';
import { RefundLog } from '../../../server/types';
import './RefundLogDetails.css';

interface RefundLogDetailsProps {
  log: RefundLog;
  onFlag: (refundId: string) => void;
}

export default function RefundLogDetails({ log, onFlag }: RefundLogDetailsProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copied to clipboard!');
  };

  return (
    <div className="refund-log-details">
      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">Refund ID:</span>
          <span className="detail-value">
            {log.refundId}
            <button
              className="copy-button"
              onClick={() => copyToClipboard(log.refundId)}
              title="Copy to clipboard"
            >
              📋
            </button>
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">User Address:</span>
          <span className="detail-value">
            {log.userAddress}
            <button
              className="copy-button"
              onClick={() => copyToClipboard(log.userAddress)}
              title="Copy to clipboard"
            >
              📋
            </button>
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">TxHash:</span>
          <span className="detail-value">
            {log.txHash || 'N/A'}
            {log.txHash && (
              <button
                className="copy-button"
                onClick={() => copyToClipboard(log.txHash!)}
                title="Copy to clipboard"
              >
                📋
              </button>
            )}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Amount:</span>
          <span className="detail-value">{log.amount} BNB</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`detail-value status-${log.status}`}>
            {log.status === 'success' && '✅'}
            {log.status === 'failed' && '❌'}
            {log.status === 'pending' && '⏳'}
            {' '}
            {log.status.toUpperCase()}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Verified At:</span>
          <span className="detail-value">{new Date(log.verifiedAt).toLocaleString()}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Signature:</span>
          <span className="detail-value">
            {log.signatureValid ? '✅ Valid' : '❌ Invalid'}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Reason:</span>
          <span className="detail-value">{log.reason}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Executed By:</span>
          <span className="detail-value">{log.executedBy}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Notes:</span>
          <span className="detail-value">{log.notes}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">{new Date(log.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="flag-button" onClick={() => onFlag(log.refundId)}>
          🚨 Flag This Log
        </button>
      </div>
    </div>
  );
}
