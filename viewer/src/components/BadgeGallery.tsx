/**
 * Badge Gallery Component
 * Displays all badges with unlock status and animations
 */

import React, { useState, useEffect } from 'react';
import { BadgeCard } from './BadgeCard';
import { BadgeUnlockModal } from './BadgeUnlockModal';

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

interface BadgeGalleryProps {
  userId: string;
  walletAddress?: string;
  badges: Badge[];
  newlyMinted?: number[];
  onRefresh?: () => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({
  userId,
  walletAddress,
  badges,
  newlyMinted = [],
  onRefresh,
}) => {
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  // Show unlock modal when new badges are minted
  useEffect(() => {
    if (newlyMinted.length > 0) {
      setShowUnlockModal(true);
    }
  }, [newlyMinted]);

  // Filter badges based on selected filters
  const filteredBadges = badges.filter((badge) => {
    const categoryMatch = filterCategory === 'all' || badge.metadata.category === filterCategory;
    const rarityMatch = filterRarity === 'all' || badge.metadata.rarity === filterRarity;
    return categoryMatch && rarityMatch;
  });

  // Group badges by ownership
  const ownedBadges = filteredBadges.filter((b) => b.owned);
  const unlockedNotOwned = filteredBadges.filter((b) => !b.owned && b.unlocked);
  const lockedBadges = filteredBadges.filter((b) => !b.owned && !b.unlocked);

  return (
    <div className="badge-gallery">
      {/* Header */}
      <div className="badge-gallery-header">
        <h2>🏆 Badge Collection</h2>
        <div className="badge-stats">
          <span className="badge-count">{ownedBadges.length} / {badges.length} Badges</span>
          {walletAddress && (
            <span className="wallet-address">
              Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="badge-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="contributor">Contributor</option>
            <option value="achievement">Achievement</option>
            <option value="special">Special</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Rarity:</label>
          <select 
            value={filterRarity} 
            onChange={(e) => setFilterRarity(e.target.value)}
          >
            <option value="all">All</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        {onRefresh && (
          <button className="refresh-button" onClick={onRefresh}>
            🔄 Refresh
          </button>
        )}
      </div>

      {/* Owned Badges */}
      {ownedBadges.length > 0 && (
        <div className="badge-section">
          <h3>✨ Owned Badges</h3>
          <div className="badge-grid">
            {ownedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isNewlyMinted={newlyMinted.includes(badge.id)}
                onClick={() => setSelectedBadge(badge)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unlocked but not owned */}
      {unlockedNotOwned.length > 0 && (
        <div className="badge-section">
          <h3>🎯 Ready to Mint</h3>
          <div className="badge-grid">
            {unlockedNotOwned.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onClick={() => setSelectedBadge(badge)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="badge-section">
          <h3>🔒 Locked Badges</h3>
          <div className="badge-grid">
            {lockedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onClick={() => setSelectedBadge(badge)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBadge(null)}>×</button>
            <div className="badge-detail">
              <img 
                src={selectedBadge.metadata.image} 
                alt={selectedBadge.metadata.name}
                className={selectedBadge.owned ? 'owned' : 'locked'}
              />
              <h2>{selectedBadge.metadata.name}</h2>
              <p className="badge-rarity">{selectedBadge.metadata.rarity.toUpperCase()}</p>
              <p className="badge-category">{selectedBadge.metadata.category}</p>
              <p className="badge-description">{selectedBadge.metadata.description}</p>
              <div className="badge-status">
                {selectedBadge.owned && <span className="status-owned">✅ Owned</span>}
                {!selectedBadge.owned && selectedBadge.unlocked && (
                  <span className="status-unlocked">🎯 Unlocked (Ready to Mint)</span>
                )}
                {!selectedBadge.owned && !selectedBadge.unlocked && (
                  <span className="status-locked">🔒 Locked</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Celebration Modal */}
      {showUnlockModal && newlyMinted.length > 0 && (
        <BadgeUnlockModal
          badges={badges.filter((b) => newlyMinted.includes(b.id))}
          onClose={() => setShowUnlockModal(false)}
        />
      )}
    </div>
  );
};
