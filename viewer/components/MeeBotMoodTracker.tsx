
import React from 'react';
import { useMeeBot } from '../context/MeeBotContext';
import { MeeBotMood } from './MeeBotSprite';

export default function MeeBotMoodTracker() {
  const { meeBotState } = useMeeBot();
  const { moodHistory } = meeBotState;

  const moodCounts = moodHistory.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<MeeBotMood, number>);

  return (
    <div className="meebot-mood-tracker-container">
      <h3>📊 สถิติอารมณ์ MeeBot ของคุณ</h3>
      {moodHistory.length === 0 ? (
        <p>ยังไม่มีข้อมูลอารมณ์เลยนะ ลองทำภารกิจดูสิ!</p>
      ) : (
        <ul className="mood-stats-list">
          {Object.entries(moodCounts).map(([mood, count]) => (
            <li key={mood}>
              <span className={`mood-emoji mood-${mood}`}>{getMoodEmoji(mood as MeeBotMood)}</span>
              <span className="mood-name">{mood}:</span>
              <span className="mood-count">{count} ครั้ง</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getMoodEmoji(mood: MeeBotMood): string {
  switch (mood) {
    case 'celebrate': return '🎉';
    case 'confused': return '🤔';
    case 'thinking': return '🧠';
    case 'neutral': return '🙂';
    default: return '❓';
  }
}
