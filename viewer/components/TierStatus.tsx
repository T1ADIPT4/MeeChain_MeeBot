
import React, { useState, useEffect } from 'react';
import { useMeeBot } from '../context/MeeBotContext';
// เปลี่ยนมา import ฟังก์ชันจาก service กลาง
import { fetchUserTier, upgradeTier } from '../services/blockchainService';

interface TierStatusProps {
  userAddress: string;
}

export default function TierStatus({ userAddress }: TierStatusProps) {
  const [tier, setTier] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setMeeBot } = useMeeBot();

  useEffect(() => {
    setIsLoading(true);
    fetchUserTier(userAddress)
      .then(currentTier => {
        setTier(currentTier);
        setIsLoading(false);
        setMeeBot('neutral', `ปัจจุบันคุณอยู่ Tier ${currentTier} (ข้อมูลจริง)`);
      })
      .catch(() => {
        setTier(null);
        setIsLoading(false);
        setMeeBot('confused', 'ขออภัยครับ ไม่สามารถโหลดข้อมูล Tier (จริง) ได้');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setMeeBot('thinking', 'กำลังส่งคำขอ Upgrade Tier (ข้อมูลจริง)...');
    const result = await upgradeTier(userAddress);
    if (result.success) {
      const newTier = (tier || 0) + 1;
      setTier(newTier);
      setMeeBot('celebrate', 'อัปเกรด Tier สำเร็จแล้วครับ! (ข้อมูลจริง)');
    } else {
      setMeeBot('confused', 'การอัปเกรดล้มเหลวครับ ลองตรวจสอบเงื่อนไขอีกครั้งนะ (ข้อมูลจริง)');
    }
    setIsLoading(false);
  };

  return (
    <div className="tier-status-container">
      <h3>ระดับ Tier ของคุณ</h3>
      {isLoading && tier === null ? (
        <p>Loading...</p>
      ) : (
        <p className="tier-display">Tier: {tier ?? 'N/A'}</p>
      )}
      <button onClick={handleUpgrade} disabled={isLoading || tier === null || tier >= 3}>
        {isLoading ? 'กำลังดำเนินการ...' : 'Upgrade Tier'}
      </button>
    </div>
  );
}
