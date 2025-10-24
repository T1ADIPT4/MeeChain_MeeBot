import React, { useState } from "react";

export function ClaimMEEModal({ open, onClose, point, meeAmount, onClaim }: {
  open: boolean;
  onClose: () => void;
  point: number;
  meeAmount: number;
  onClaim: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      await onClaim();
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Claim MEE</h2>
        <p>Point: <b>{point}</b></p>
        <p>MEE ที่จะได้รับ: <b>{meeAmount}</b></p>
        <button onClick={handleClaim} disabled={loading || success}>
          {loading ? "กำลังเคลม..." : success ? "🎉 เคลมสำเร็จ!" : "ยืนยันการเคลม"}
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">🎉 MeeBot: คุณได้รับ MEE แล้ว!</div>}
      </div>
      <style>{`
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:1000; }
        .modal-content { background:#fff; padding:2rem; border-radius:1rem; min-width:320px; position:relative; box-shadow:0 4px 32px #0002; }
        .modal-close { position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.5rem; cursor:pointer; }
        .error { color: red; margin-top: 1rem; }
        .success { color: green; margin-top: 1rem; font-weight: bold; }
      `}</style>
    </div>
  );
}
