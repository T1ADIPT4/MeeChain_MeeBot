
import React, { useState, useEffect } from 'react';
import { useMeeBot } from '../context/MeeBotContext';
import { fetchTimelineEvents, TimelineEvent } from '../services/blockchainService';
import './QuestTimeline.css';

interface QuestTimelineProps {
  userAddress: string;
}

export default function QuestTimeline({ userAddress }: QuestTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[] | null>(null);
  const { setMeeBot } = useMeeBot();

  useEffect(() => {
    fetchTimelineEvents(userAddress)
      .then(setEvents)
      .catch(() => {
        setMeeBot('confused', 'ขออภัย, ไม่สามารถโหลดข้อมูลไทม์ไลน์ได้ครับ (ข้อมูลจริง)');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  if (events === null) {
    return <p>กำลังโหลดไทม์ไลน์...</p>;
  }

  return (
    <div className="quest-timeline-container">
      <h3>เส้นทางความสำเร็จของคุณ</h3>
      <div className="timeline">
        {events.map(event => (
          <div key={event.id} className="timeline-item" data-type={event.type}>
            <div className="timeline-icon">{event.icon}</div>
            <div className="timeline-content">
              <p>{event.description}</p>
              <time>{new Date(event.timestamp).toLocaleString()}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
