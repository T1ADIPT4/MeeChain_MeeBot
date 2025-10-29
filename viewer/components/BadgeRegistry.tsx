
import React, { useState, useEffect } from 'react';
import { useMeeBot } from '../context/MeeBotContext';
import { fetchOwnedBadges } from '../services/blockchainService';
import BadgeGallery from './BadgeGallery';
import BadgeUnlockNotification from './BadgeUnlockNotification';
import { BadgeMetadata } from '../../src/config/badgeCatalog';

interface BadgeRegistryProps {
  userAddress: string;
  newlyMintedBadges?: number[];
}

export default function BadgeRegistry({ userAddress, newlyMintedBadges = [] }: BadgeRegistryProps) {
  const [badgeIds, setBadgeIds] = useState<number[] | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { setMeeBot } = useMeeBot();

  useEffect(() => {
    fetchOwnedBadges(userAddress)
      .then(ownedBadges => {
        setBadgeIds(ownedBadges);
        if (ownedBadges.length === 0) {
          setMeeBot('neutral', 'ยังไม่มี Badge เลยนะ ไปลุยภารกิจกัน! (ข้อมูลจริง)');
        } else {
          setMeeBot('celebrate', `คุณมี ${ownedBadges.length} Badge แล้ว สุดยอด! (ข้อมูลจริง)`);
        }
      })
      .catch(() => {
        setBadgeIds(null);
        setMeeBot('confused', 'ขออภัยครับ ไม่สามารถโหลดข้อมูล Badge ได้ (ข้อมูลจริง)');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  useEffect(() => {
    if (newlyMintedBadges.length > 0) {
      setShowNotification(true);
    }
  }, [newlyMintedBadges]);

  const handleBadgeClick = (badge: BadgeMetadata) => {
    console.log('Badge clicked:', badge);
  };

  return (
    <div className="badge-registry-container p-4">
      {badgeIds === null && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading badges...</p>
        </div>
      )}
      
      {badgeIds && (
        <BadgeGallery 
          ownedBadgeIds={badgeIds}
          newlyMintedBadges={newlyMintedBadges}
          onBadgeClick={handleBadgeClick}
        />
      )}

      {showNotification && newlyMintedBadges.length > 0 && (
        <BadgeUnlockNotification
          badgeIds={newlyMintedBadges}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
