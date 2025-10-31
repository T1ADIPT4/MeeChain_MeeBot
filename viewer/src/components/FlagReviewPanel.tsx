import { useState, useEffect } from 'react';
import { recordAction } from '../services/contributorReputationService';

interface FlagReviewPanelProps {
  refundId: string;
  currentUserAddress?: string;
  onReviewComplete?: (approved: boolean) => void;
}

export default function FlagReviewPanel({
  refundId,
  currentUserAddress = '0x0000000000000000',
  onReviewComplete
}: FlagReviewPanelProps) {
  const [reason, setReason] = useState('');
  const [approved, setApproved] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading for skeleton
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  async function submitReview() {
    if (approved === null) {
      alert('⚠️ กรุณาเลือกอนุมัติหรือปฏิเสธ');
      return;
    }

    if (!reason.trim()) {
      alert('⚠️ กรุณาระบุเหตุผลหรือหมายเหตุ');
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, this would be an actual API call
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Record the action in reputation system
      recordAction(
        currentUserAddress,
        approved ? 'flag_confirm' : 'flag_reject',
        refundId
      );

      // Simulate API call to backend
      console.log('Submitting review:', {
        refundId,
        approved,
        confirmedBy: currentUserAddress,
        notes: reason,
      });

      setSubmitted(true);

      if (onReviewComplete) {
        onReviewComplete(approved);
      }

      // Show success message
      setTimeout(() => {
        alert('✅ การตรวจสอบสำเร็จ');
      }, 100);

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('❌ เกิดข้อผิดพลาดในการส่งผลการตรวจสอบ');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    // Skeleton UI
    return (
      <div style={{
        background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minHeight: 320, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center',
      }}>
        <div style={{ height: 32, width: 180, background: '#e2e8f0', borderRadius: 8, marginBottom: 12, animation: 'pulse 1.2s infinite' }} />
        <div style={{ height: 24, width: 120, background: '#e2e8f0', borderRadius: 8, marginBottom: 8, animation: 'pulse 1.2s infinite' }} />
        <div style={{ height: 80, width: '100%', background: '#e2e8f0', borderRadius: 12, marginBottom: 16, animation: 'pulse 1.2s infinite' }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, height: 40, background: '#e2e8f0', borderRadius: 8, animation: 'pulse 1.2s infinite' }} />
          <div style={{ flex: 1, height: 40, background: '#e2e8f0', borderRadius: 8, animation: 'pulse 1.2s infinite' }} />
        </div>
        <div style={{ height: 40, width: '100%', background: '#e2e8f0', borderRadius: 8, marginTop: 16, animation: 'pulse 1.2s infinite' }} />
      </div>
    );
  }

  // Empty state: no flag to review (simulate with refundId === '')
  if (!refundId) {
    return (
      <div style={{
        background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🕊️</div>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
          ยังไม่มีรายการที่ต้องตรวจสอบในขณะนี้
        </div>
        <div style={{ fontSize: '0.95rem', color: '#a0aec0' }}>
          ระบบจะแจ้งเตือนเมื่อมี Flag ใหม่เข้ามา<br />
          ขอบคุณที่ช่วยดูแลความโปร่งใสของ MeeChain!
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          ✅
        </div>
        <h3 style={{ fontSize: '1.5rem', color: '#48bb78', marginBottom: '0.5rem' }}>
          ส่งผลการตรวจสอบสำเร็จ
        </h3>
        <p style={{ color: '#718096' }}>
          Flag ID: {refundId}
        </p>
      </div>
    );
  }

  return (
    <div className="flag-review-panel" style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#1a202c',
      }}>
        🔍 ตรวจสอบการแจ้ง Flag
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
          Flag ID
        </p>
        <p style={{
          padding: '0.75rem',
          background: '#f7fafc',
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
          {refundId}
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: '#2d3748',
        }}>
          เหตุผลหรือหมายเหตุ
        </label>
        <textarea
          placeholder="กรุณาระบุเหตุผลในการอนุมัติหรือปฏิเสธ..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.75rem',
            border: '2px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
          disabled={isSubmitting}
        />
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <button
          onClick={() => setApproved(true)}
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: '1rem',
            background: approved === true ? '#48bb78' : '#f7fafc',
            color: approved === true ? 'white' : '#2d3748',
            border: '2px solid',
            borderColor: approved === true ? '#48bb78' : '#e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          ✅ อนุมัติ
        </button>
        <button
          onClick={() => setApproved(false)}
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: '1rem',
            background: approved === false ? '#f56565' : '#f7fafc',
            color: approved === false ? 'white' : '#2d3748',
            border: '2px solid',
            borderColor: approved === false ? '#f56565' : '#e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          ❌ ปฏิเสธ
        </button>
      </div>

      <button
        onClick={submitReview}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {isSubmitting ? '⏳ กำลังส่ง...' : '📤 ส่งผลการตรวจสอบ'}
      </button>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#edf2f7',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#4a5568',
      }}>
        <p style={{ marginBottom: '0.5rem' }}>
          💡 <strong>เคล็ดลับ:</strong> การตรวจสอบที่ถูกต้องจะได้รับคะแนน reputation
        </p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>อนุมัติ: +5 คะแนน</li>
          <li>ปฏิเสธ: +1 คะแนน</li>
        </ul>
      </div>
    </div>
  );
}
