import React, { useState, useEffect } from 'react';
import { Transaction, UserRole, getUserPermissions } from '../src/types/transaction';
import { 
  replayTransaction, 
  supplyCoins, 
  refundCoins, 
  getTransactionStatus 
} from '../services/blockchainService';
import { useMeeBot } from '../context/MeeBotContext';
import MeeBotSprite from './MeeBotSprite';
import './CoinStatus.css';

interface CoinStatusProps {
  txHash: string;
  userRole?: UserRole;
}

export default function CoinStatus({ txHash, userRole = 'User' }: CoinStatusProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { meeBotState, setReplayFeedback } = useMeeBot();
  
  const permissions = getUserPermissions(userRole);

  // Fetch initial transaction status
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const tx = await getTransactionStatus(txHash);
        setTransaction(tx);
        setReplayFeedback(tx.status);
      } catch (err) {
        setError('Failed to fetch transaction status');
        console.error(err);
      }
    };
    
    fetchTransaction();
  }, [txHash]);

  const handleReplay = async () => {
    if (!transaction) return;
    
    setLoading(true);
    setError(null);
    setReplayFeedback('pending');
    
    try {
      const updatedTx = await replayTransaction(transaction.txHash || txHash);
      setTransaction(updatedTx);
      setReplayFeedback(updatedTx.status);
    } catch (err) {
      setError('Replay failed. Please try again.');
      console.error(err);
      setReplayFeedback('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSupply = async () => {
    if (!transaction) return;
    
    setLoading(true);
    setError(null);
    setReplayFeedback('pending');
    
    try {
      const updatedTx = await supplyCoins(transaction);
      setTransaction(updatedTx);
      setReplayFeedback(updatedTx.status);
    } catch (err) {
      setError('Supply failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!transaction) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedTx = await refundCoins(transaction);
      setTransaction(updatedTx);
      setReplayFeedback(updatedTx.status);
    } catch (err) {
      setError('Refund failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) {
    return (
      <div className="coin-status-container">
        <div className="loading">กำลังโหลดข้อมูลธุรกรรม...</div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const statusMap = {
      pending: { icon: '⏳', text: 'รอการยืนยัน', className: 'status-pending' },
      replayed: { icon: '✅', text: 'สำเร็จ', className: 'status-success' },
      supplied: { icon: '🎉', text: 'ซัพพลายสำเร็จ', className: 'status-supplied' },
      failed: { icon: '❌', text: 'ล้มเหลว', className: 'status-failed' },
      refunded: { icon: '↩️', text: 'คืนเงินแล้ว', className: 'status-refunded' },
    };
    
    const status = statusMap[transaction.status];
    return (
      <span className={`status-badge ${status.className}`}>
        {status.icon} {status.text}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="coin-status-container">
      <div className="coin-status-header">
        <h2>🔐 สถานะเหรียญ</h2>
        <div className="user-role-badge">Role: {userRole}</div>
      </div>

      <div className="meebot-section">
        <MeeBotSprite mood={meeBotState.mood} message={meeBotState.message} />
      </div>

      <div className="transaction-details">
        <table className="details-table">
          <tbody>
            <tr>
              <td className="label">Address</td>
              <td className="value">{transaction.address}</td>
            </tr>
            <tr>
              <td className="label">สถานะ Replay</td>
              <td className="value">{getStatusBadge()}</td>
            </tr>
            <tr>
              <td className="label">เวลาที่ได้รับ</td>
              <td className="value">{formatDate(transaction.timestamp)}</td>
            </tr>
            <tr>
              <td className="label">ปริมาณ</td>
              <td className="value">{transaction.amount} {transaction.token}</td>
            </tr>
            <tr>
              <td className="label">ปลายทาง Supply</td>
              <td className="value">{transaction.supplyDestination || 'N/A'}</td>
            </tr>
            <tr>
              <td className="label">Trigger โดย</td>
              <td className="value">{transaction.triggerBy || 'ยังไม่ trigger'}</td>
            </tr>
            {transaction.txHash && (
              <tr>
                <td className="label">Transaction Hash</td>
                <td className="value hash">{transaction.txHash}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="action-buttons">
        {transaction.status === 'pending' && (
          <button
            onClick={handleReplay}
            disabled={loading || !permissions.canTriggerActions}
            className="btn btn-primary"
          >
            {loading ? '⏳ กำลังดำเนินการ...' : '🔄 Replay Transaction'}
          </button>
        )}

        {transaction.status === 'replayed' && permissions.canSupply && (
          <button
            onClick={handleSupply}
            disabled={loading}
            className="btn btn-success"
          >
            {loading ? '⏳ กำลังดำเนินการ...' : '🚀 ซัพพลายเหรียญ'}
          </button>
        )}

        {transaction.status === 'failed' && permissions.canRefund && (
          <button
            onClick={handleRefund}
            disabled={loading}
            className="btn btn-warning"
          >
            {loading ? '⏳ กำลังดำเนินการ...' : '↩️ ดึงเหรียญกลับ'}
          </button>
        )}

        {transaction.status === 'supplied' && (
          <div className="success-message">
            ✅ เหรียญถูกซัพพลายสำเร็จแล้ว!
          </div>
        )}

        {transaction.status === 'refunded' && (
          <div className="info-message">
            ↩️ เหรียญถูกคืนกลับไปยังผู้ใช้แล้ว
          </div>
        )}
      </div>

      {permissions.canViewLogs && (
        <div className="audit-section">
          <h3>📊 Audit Log</h3>
          <div className="audit-info">
            <p>Replay Attempts: {transaction.replayAttempts}</p>
            <p>Status: {transaction.status}</p>
            {transaction.error && <p className="error-text">Error: {transaction.error}</p>}
          </div>
        </div>
      )}

      <div className="permissions-info">
        <h4>สิทธิ์ของคุณ:</h4>
        <ul>
          <li>{permissions.canSupply ? '✅' : '❌'} ซัพพลายเหรียญ</li>
          <li>{permissions.canRefund ? '✅' : '❌'} ดึงเหรียญกลับ</li>
          <li>{permissions.canViewLogs ? '✅' : '❌'} ดู Audit Logs</li>
          <li>{permissions.canTriggerActions ? '✅' : '❌'} Trigger Actions</li>
        </ul>
      </div>
    </div>
  );
}
