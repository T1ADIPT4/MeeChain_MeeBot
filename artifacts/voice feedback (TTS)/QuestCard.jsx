import { useState } from 'react';

export default function QuestCard({ questId, status, onComplete }) {
  const [loading, setLoading] = useState(false);
  const questManagerUrl = process.env.NEXT_PUBLIC_QUEST_MANAGER_URL;

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${questManagerUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId })
      });
      const result = await res.json();
      if (result.success) {
        onComplete(result.status);
      }
    } catch (err) {
      console.error('Quest verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      background: '#f9f9f9'
    }}>
      <h3>Quest: {questId}</h3>
      <p>Status: <strong>{status}</strong></p>
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Checking...' : 'Verify Quest'}
      </button>
    </div>
  );
}
