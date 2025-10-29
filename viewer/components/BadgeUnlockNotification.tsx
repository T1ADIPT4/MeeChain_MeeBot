import React, { useEffect, useState } from 'react';
import { getBadgeById, BadgeMetadata } from '../../src/config/badgeCatalog';

interface BadgeUnlockNotificationProps {
  badgeIds: number[];
  onClose: () => void;
  autoCloseDelay?: number;
}

/**
 * BadgeUnlockNotification - Shows a celebration popup when new badges are unlocked
 */
export default function BadgeUnlockNotification({ 
  badgeIds, 
  onClose,
  autoCloseDelay = 5000
}: BadgeUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const badges = badgeIds.map(id => getBadgeById(id)).filter(Boolean) as BadgeMetadata[];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose]);

  if (!isVisible || badges.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Confetti effect */}
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5]
            }}
          />
        ))}
      </div>

      {/* Notification card */}
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full
          pointer-events-auto transform transition-all duration-300
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-2 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {badges.length === 1 ? 'Badge Unlocked!' : 'Badges Unlocked!'}
          </h2>
          <p className="text-gray-600">คุณปลดล็อก Badge ใหม่!</p>
        </div>

        {/* Badge(s) display */}
        <div className="space-y-3 mb-4">
          {badges.map((badge, index) => (
            <div 
              key={badge.id}
              className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mr-3">
                {badge.imageURI ? (
                  <img 
                    src={badge.imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                    alt={badge.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span>🏅</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{badge.name}</div>
                <div className="text-sm text-gray-600">{badge.description}</div>
                <span className={`
                  inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold uppercase
                  ${getRarityBadgeClass(badge.rarity)}
                `}>
                  {badge.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          เยี่ยมเลย! ✨
        </button>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confetti-fall 3s linear forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
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
