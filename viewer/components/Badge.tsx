import React from 'react';
import { BadgeMetadata } from '../../src/config/badgeCatalog';

interface BadgeProps {
  badge: BadgeMetadata;
  isUnlocked: boolean;
  showAnimation?: boolean;
  onClick?: () => void;
}

/**
 * Badge component - displays a single badge with locked/unlocked states
 */
export default function Badge({ badge, isUnlocked, showAnimation = false, onClick }: BadgeProps) {
  const rarityColors = {
    common: 'border-gray-400 bg-gray-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-yellow-400 bg-yellow-50'
  };

  const rarityGlow = {
    common: 'shadow-gray-200',
    rare: 'shadow-blue-200',
    epic: 'shadow-purple-200',
    legendary: 'shadow-yellow-200'
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
        ${isUnlocked ? rarityColors[badge.rarity] : 'border-gray-300 bg-gray-100'}
        ${isUnlocked ? `hover:shadow-lg ${rarityGlow[badge.rarity]}` : 'hover:shadow-md'}
        ${showAnimation ? 'animate-badge-unlock' : ''}
      `}
      onClick={onClick}
      title={badge.description}
    >
      {/* Badge Icon/Image */}
      <div className={`
        text-4xl mb-2 flex items-center justify-center h-16
        ${!isUnlocked ? 'grayscale opacity-40' : ''}
      `}>
        {badge.imageURI ? (
          <img 
            src={badge.imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
            alt={badge.name}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <span className="text-5xl">🏅</span>
        )}
      </div>

      {/* Badge Name */}
      <div className={`
        font-bold text-center mb-1
        ${!isUnlocked ? 'text-gray-400' : 'text-gray-800'}
      `}>
        {badge.name}
      </div>

      {/* Badge Rarity */}
      <div className={`
        text-xs text-center uppercase font-semibold
        ${!isUnlocked ? 'text-gray-300' : getRarityTextColor(badge.rarity)}
      `}>
        {badge.rarity}
      </div>

      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      {/* New Badge Indicator */}
      {showAnimation && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          NEW
        </div>
      )}
    </div>
  );
}

function getRarityTextColor(rarity: BadgeMetadata['rarity']): string {
  switch (rarity) {
    case 'common': return 'text-gray-600';
    case 'rare': return 'text-blue-600';
    case 'epic': return 'text-purple-600';
    case 'legendary': return 'text-yellow-600';
  }
}
