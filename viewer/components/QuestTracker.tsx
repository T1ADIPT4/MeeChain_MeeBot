
import React, { useState, useEffect } from 'react';
import QuestBadgeViewer from './QuestBadgeViewer';
import { useMeeBot } from '../context/MeeBotContext';
import { fetchAvailableQuests } from '../services/blockchainService';

interface Quest {
  id: string;
  title: string;
  description: string;
}

interface QuestTrackerProps {
  userAddress: string;
}

export default function QuestTracker({ userAddress }: QuestTrackerProps) {
  const [quests, setQuests] = useState<Quest[] | null>(null);
  const { setMeeBot } = useMeeBot();

  useEffect(() => {
    fetchAvailableQuests()
      .then(setQuests)
      .catch(() => {
        setMeeBot('confused', 'ขออภัยครับ ไม่สามารถโหลดรายการภารกิจได้ (ข้อมูลจริง)');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (quests === null) {
    return <p>Loading quests...</p>;
  }

  return (
    <div className="quest-tracker-container">
      <h3>ภารกิจท้าทาย</h3>
      {quests.map(quest => (
        <div key={quest.id} className="quest-item">
          <h4>{quest.title}</h4>
          <p>{quest.description}</p>
          <QuestBadgeViewer userAddress={userAddress} questId={quest.id} />
        </div>
      ))}
    </div>
  );
}
