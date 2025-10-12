
import React, { useEffect } from 'react'; // เพิ่ม useEffect
import TierStatus from './TierStatus';
import BadgeRegistry from './BadgeRegistry';
import QuestTracker from './QuestTracker';
import MeeBotSprite from './MeeBotSprite';
import AutomatedTierUpgrader from './AutomatedTierUpgrader';
import MeeBotMoodTracker from './MeeBotMoodTracker';
import QuestTimeline from './QuestTimeline';
import { useMeeBot } from '../context/MeeBotContext';
import './ProfileViewer.css';

interface ProfileViewerProps {
  userAddress: string | null;
  viewerEmail: string | null; // รับ viewerEmail เข้ามา
}

export default function ProfileViewer({ userAddress, viewerEmail }: ProfileViewerProps) {
  const { meeBotState, setMeeBot } = useMeeBot(); // ดึง setMeeBot มาใช้

  // ตรวจสอบอีเมลเมื่อ Component โหลดเสร็จ
  useEffect(() => {
    if (viewerEmail === 'pouri199028@gmail.com') {
      // ถ้าเป็นผู้ใช้คนพิเศษ ให้ MeeBot กล่าวต้อนรับ!
      setMeeBot('celebrate', `ยินดีต้อนรับกลับมาครับ, คุณครู!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerEmail]);

  if (!userAddress) {
    return (
      <div className="profile-viewer-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <MeeBotSprite mood="confused" message="กรุณาเชื่อมต่อ Wallet ก่อนนะครับ" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-viewer-container">
      <div className="profile-header">
        <h2>👤 โปรไฟล์ของฉัน</h2>
        <p>Address: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
        {viewerEmail && <p>Viewer: {viewerEmail}</p>} {/* แสดงอีเมลที่ login อยู่ */}
      </div>

      <div className="meebot-main-display">
        <MeeBotSprite mood={meeBotState.mood} message={meeBotState.message} />
      </div>

      <AutomatedTierUpgrader userAddress={userAddress} />

      <div className="main-dashboard-grid">
        <TierStatus userAddress={userAddress} />
        <BadgeRegistry userAddress={userAddress} />
        <QuestTracker userAddress={userAddress} />
        <MeeBotMoodTracker />
        <QuestTimeline userAddress={userAddress} />
      </div>
    </div>
  );
}
