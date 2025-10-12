
import React, { useState, useEffect } from 'react';
import { useMeeBot } from '../context/MeeBotContext';
import { fetchOwnedBadges } from '../services/blockchainService';

interface BadgeRegistryProps {
  userAddress: string;
}

export default function BadgeRegistry({ userAddress }: BadgeRegistryProps) {
  const [badges, setBadges] = useState<string[] | null>(null);
  const { setMeeBot } = useMeeBot();

  useEffect(() => {
    fetchOwnedBadges(userAddress)
      .then(ownedBadges => {
        setBadges(ownedBadges);
        if (ownedBadges.length === 0) {
          setMeeBot('neutral', 'ยังไม่มี Badge เลยนะ ไปลุยภารกิจกัน! (ข้อมูลจริง)');
        } else {
          setMeeBot('celebrate', `คุณมี ${ownedBadges.length} Badge แล้ว สุดยอด! (ข้อมูลจริง)`);
        }
      })
      .catch(() => {
        setBadges(null);
        setMeeBot('confused', 'ขออภัยครับ ไม่สามารถโหลดข้อมูล Badge ได้ (ข้อมูลจริง)');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return (
    <div className="badge-registry-container">
      <h3>คลัง Badge ของคุณ</h3>
      {badges === null && <p>Loading badges...</p>}
      {badges && badges.length > 0 && (
        <ul className="badge-list">
          {badges.map(badgeId => (
            <li key={badgeId} className="badge-item">🏅 {badgeId}</li>
          ))}
        </ul>
      )}
      {badges && badges.length === 0 && <p>ยังไม่มี Badge</p>}
    </div>
  );
}
