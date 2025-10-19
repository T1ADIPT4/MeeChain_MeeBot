
import React from 'react';
import './MeeBot.css'; // Import สไตล์ใหม่

export type MeeBotMood = 'neutral' | 'thinking' | 'celebrate' | 'confused' | 'warning' | 'success';

interface MeeBotSpriteProps {
  mood: MeeBotMood;
  message: string;
}

const moodEmojis: Record<MeeBotMood, string> = {
  neutral: '🤖',
  thinking: '🤔',
  celebrate: '🎉',
  confused: '😟',
  warning: '⚠️',
  success: '✅',
};

export default function MeeBotSprite({ mood, message }: MeeBotSpriteProps) {
  return (
    // เพิ่ม class ตาม mood เพื่อให้ CSS ทำงานได้
    <div className={`meebot-sprite-container mood-${mood}`}>
      <div className="meebot-sprite">{moodEmojis[mood]}</div>
      {message && <div className="meebot-message-bubble">{message}</div>}
    </div>
  );
}
