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
    </div>
  );
}
