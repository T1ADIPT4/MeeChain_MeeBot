
import React, { useState, useEffect } from 'react';
import { useMeeBot } from '../context/MeeBotContext';
import { checkQuestStatus, mintBadge } from '../services/blockchainService';

interface QuestBadgeViewerProps {
  userAddress: string;
  questId: string;
}

export default function QuestBadgeViewer({ userAddress, questId }: QuestBadgeViewerProps) {
  const [status, setStatus] = useState<'loading' | 'completed' | 'inprogress' | 'minted' | 'error'>('loading');
  const { setMeeBot } = useMeeBot();

  useEffect(() => {
    checkQuestStatus(userAddress, questId)
      .then(questState => {
        if (questState === 'completed') {
          setStatus('completed');
          setMeeBot('neutral', `ภารกิจ ${questId} สำเร็จแล้ว พร้อม Mint Badge ครับ! (ข้อมูลจริง)`);
        } else {
          setStatus('inprogress');
        }
      })
      .catch(() => setStatus('error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, questId]);

  const handleMint = async () => {
    setStatus('loading');
    setMeeBot('thinking', `กำลัง Mint Badge สำหรับภารกิจ ${questId} (ข้อมูลจริง)...`);
    const result = await mintBadge(userAddress, questId);
    if (result.success) {
      setStatus('minted');
      setMeeBot('celebrate', 'เยี่ยม! คุณได้รับ Badge แล้วครับ! (ข้อมูลจริง)');
    } else {
      setStatus('error');
      setMeeBot('confused', 'โอ๊ะ! การ Mint Badge ล้มเหลวครับ (ข้อมูลจริง)');
    }
  };

  return (
    <div className="quest-badge-viewer">
      <h4>ภารกิจ: {questId}</h4>
      <button onClick={handleMint} disabled={status !== 'completed' && status !== 'error'}>
        {status === 'loading' ? 'โปรดรอ...' : 'Mint Badge'}
      </button>
    </div>
  );
}
