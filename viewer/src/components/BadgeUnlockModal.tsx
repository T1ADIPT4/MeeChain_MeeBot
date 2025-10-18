/**
 * Badge Unlock Modal Component
 * Celebration animation when new badges are unlocked
 */

import React, { useEffect, useState } from 'react';

interface BadgeMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  category: 'contributor' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Badge {
  id: number;
  metadata: BadgeMetadata;
  owned: boolean;
  unlocked: boolean;
}

interface BadgeUnlockModalProps {
  badges: Badge[];
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  badges,
  onClose,
}) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Auto-advance through badges
    if (currentBadgeIndex < badges.length - 1) {
      const timer = setTimeout(() => {
        setCurrentBadgeIndex(currentBadgeIndex + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentBadgeIndex, badges.length]);

  useEffect(() => {
    // Stop confetti after a few seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (badges.length === 0) {
    return null;
  }

  const currentBadge = badges[currentBadgeIndex];

  return (
    <div className="badge-unlock-modal-overlay">
      {showConfetti && <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#f59e0b', '#3b82f6', '#a855f7', '#ef4444'][i % 4],
            }}
          />
        ))}
      </div>}

      <div className="badge-unlock-modal">
        <div className="unlock-animation">
          <div className="unlock-glow"></div>
          <img
            src={currentBadge.metadata.image}
            alt={currentBadge.metadata.name}
            className="unlock-badge-image"
          />
        </div>

        <div className="unlock-content">
          <h1 className="unlock-title">🎉 Badge Unlocked!</h1>
          <h2 className="unlock-badge-name">{currentBadge.metadata.name}</h2>
          <p className="unlock-badge-rarity rarity-{currentBadge.metadata.rarity}">
            {currentBadge.metadata.rarity.toUpperCase()}
          </p>
          <p className="unlock-badge-description">{currentBadge.metadata.description}</p>

          {badges.length > 1 && (
            <div className="unlock-progress">
              <span>
                {currentBadgeIndex + 1} / {badges.length}
              </span>
            </div>
          )}
        </div>

        <div className="unlock-actions">
          {currentBadgeIndex < badges.length - 1 ? (
            <button
              className="unlock-next-button"
              onClick={() => setCurrentBadgeIndex(currentBadgeIndex + 1)}
            >
              Next Badge →
            </button>
          ) : (
            <button className="unlock-close-button" onClick={onClose}>
              View Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
