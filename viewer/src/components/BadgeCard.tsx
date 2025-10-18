/**
 * Badge Card Component
 * Individual badge display with animations
 */

import React from 'react';

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

interface BadgeCardProps {
  badge: Badge;
  isNewlyMinted?: boolean;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isNewlyMinted = false,
  onClick,
}) => {
  const rarityColors = {
    common: '#94a3b8',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
  };

  const rarityColor = rarityColors[badge.metadata.rarity];

  return (
    <div
      className={`badge-card ${badge.owned ? 'owned' : 'locked'} ${
        isNewlyMinted ? 'newly-minted' : ''
      } rarity-${badge.metadata.rarity}`}
      onClick={onClick}
      style={{ borderColor: rarityColor }}
    >
      {isNewlyMinted && (
        <div className="badge-new-indicator">
          <span className="new-badge-text">NEW!</span>
        </div>
      )}

      <div className="badge-image-container">
        <img
          src={badge.metadata.image}
          alt={badge.metadata.name}
          className={`badge-image ${badge.owned ? 'owned' : 'locked'}`}
        />
        {!badge.owned && (
          <div className="badge-lock-overlay">
            <span className="lock-icon">🔒</span>
          </div>
        )}
      </div>

      <div className="badge-info">
        <h3 className="badge-name">{badge.metadata.name}</h3>
        <p className="badge-rarity" style={{ color: rarityColor }}>
          {badge.metadata.rarity.charAt(0).toUpperCase() + badge.metadata.rarity.slice(1)}
        </p>
      </div>

      {badge.owned && !isNewlyMinted && (
        <div className="badge-owned-indicator">
          <span className="check-icon">✓</span>
        </div>
      )}

      {!badge.owned && badge.unlocked && (
        <div className="badge-unlocked-indicator">
          <span className="unlock-icon">🎯</span>
        </div>
      )}
    </div>
  );
};
