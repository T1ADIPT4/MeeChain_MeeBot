
import React, { useEffect } from 'react';
import { upgradeTier } from '../utils/contracts';
import { useMeeBot } from '../context/MeeBotContext'; // เปลี่ยนมาใช้ useMeeBot

// ... (ส่วนของ Mock Functions และเงื่อนไขยังเหมือนเดิม) ...
async function fetchUserTier(userAddress: string): Promise<number> {
  console.log(`Fetching tier for ${userAddress}`);
  return Promise.resolve(1);
}

async function fetchOwnedBadges(userAddress: string): Promise<string[]> {
  console.log(`Fetching badges for ${userAddress}`);
  return Promise.resolve(['quest-001', 'quest-002', 'quest-003']);
}

const TIER_UPGRADE_REQUIREMENTS: { [key: number]: number } = {
  2: 3,
  3: 5,
};

interface AutomatedTierUpgraderProps {
  userAddress: string;
}

export default function AutomatedTierUpgrader({ userAddress }: AutomatedTierUpgraderProps) {
  const { setMeeBot } = useMeeBot(); // ดึง setMeeBot มาจาก Context

  useEffect(() => {
    const checkAndUpgrade = async () => {
      try {
        const [currentTier, ownedBadges] = await Promise.all([
          fetchUserTier(userAddress),
          fetchOwnedBadges(userAddress),
        ]);

        const nextTier = currentTier + 1;
        const requiredBadges = TIER_UPGRADE_REQUIREMENTS[nextTier];

        if (requiredBadges && ownedBadges.length >= requiredBadges) {
          setMeeBot('thinking', `คุณมี Badges ครบแล้ว! กำลังอัปเกรดเป็น Tier ${nextTier}...`);
          
          const success = await upgradeTier(userAddress);

          if (success) {
            setMeeBot('celebrate', `ยินดีด้วย! คุณได้รับการอัปเกรดเป็น Tier ${nextTier} โดยอัตโนมัติ!`);
          } else {
            setMeeBot('confused', 'การอัปเกรดอัตโนมัติล้มเหลว โปรดลองอีกครั้งผ่านปุ่ม Upgrade ครับ');
          }
        }
        // ถ้เงื่อนไขไม่ครบ ก็ไม่ต้องทำอะไร ไม่ต้อง setMeeBot

      } catch (error) {
        console.error("Automated tier upgrade check failed:", error);
        setMeeBot('confused', 'ไม่สามารถตรวจสอบการอัปเกรดอัตโนมัติได้ครับ');
      }
    };

    checkAndUpgrade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  // Component นี้ไม่ต้อง render อะไรแล้ว เพราะการแสดงผลจะถูกจัดการที่ ProfileViewer
  return null;
}
