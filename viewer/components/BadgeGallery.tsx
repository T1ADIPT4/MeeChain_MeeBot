import React, { useState, useEffect } from 'react';
import { getAllBadges, getBadgeById, BadgeMetadata } from '../../src/config/badgeCatalog';
import Badge from './Badge';

interface BadgeGalleryProps {
  ownedBadgeIds: number[];
  newlyMintedBadges?: number[];
  onBadgeClick?: (badge: BadgeMetadata) => void;
}

/**
 * BadgeGallery component - displays all available badges with locked/unlocked states
 */
export default function BadgeGallery({ 
  ownedBadgeIds, 
  newlyMintedBadges = [],
  onBadgeClick 
}: BadgeGalleryProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeMetadata | null>(null);
  const [showAnimation, setShowAnimation] = useState<Set<number>>(new Set(newlyMintedBadges));
  const allBadges = getAllBadges();

  useEffect(() => {
    // Show animation for newly minted badges for 3 seconds
    if (newlyMintedBadges.length > 0) {
      setShowAnimation(new Set(newlyMintedBadges));
      const timer = setTimeout(() => {
        setShowAnimation(new Set());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newlyMintedBadges]);

  const handleBadgeClick = (badge: BadgeMetadata) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  const unlockedCount = ownedBadgeIds.length;
  const totalCount = allBadges.length;

  return (
    <div className="badge-gallery">
      {/* Gallery Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🏆 Badge Gallery
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Unlocked: <span className="font-bold text-blue-600">{unlockedCount}</span> / {totalCount}
          </p>
          <div className="text-sm text-gray-500">
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {allBadges.map(badge => {
          const isUnlocked = ownedBadgeIds.includes(badge.id);
          const isNew = showAnimation.has(badge.id);
          
          return (
            <Badge
              key={badge.id}
              badge={badge}
              isUnlocked={isUnlocked}
              showAnimation={isNew}
              onClick={() => handleBadgeClick(badge)}
            />
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedBadge.name}</h3>
              <button 
                onClick={() => setSelectedBadge(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">
                {selectedBadge.imageURI ? (
                  <img 
                    src={selectedBadge.imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                    alt={selectedBadge.name}
                    className="w-24 h-24 mx-auto object-contain"
                  />
                ) : (
                  <span>🏅</span>
                )}
              </div>
              <span className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase
                ${getRarityBadgeClass(selectedBadge.rarity)}
              `}>
                {selectedBadge.rarity}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="capitalize">Category: {selectedBadge.category}</span>
              <span className={ownedBadgeIds.includes(selectedBadge.id) ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                {ownedBadgeIds.includes(selectedBadge.id) ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes badge-unlock {
          0% {
            transform: scale(0.8) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        .animate-badge-unlock {
          animation: badge-unlock 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

function getRarityBadgeClass(rarity: BadgeMetadata['rarity']): string {
  switch (rarity) {
    case 'common': return 'bg-gray-200 text-gray-700';
    case 'rare': return 'bg-blue-200 text-blue-700';
    case 'epic': return 'bg-purple-200 text-purple-700';
    case 'legendary': return 'bg-yellow-200 text-yellow-700';
  }
}
