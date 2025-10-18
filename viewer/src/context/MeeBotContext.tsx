
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TransactionStatus } from '../types/transaction';

export type MeeBotMood = 'neutral' | 'thinking' | 'celebrate' | 'confused' | 'warning' | 'success';

interface MeeBotState {
  mood: MeeBotMood;
  message: string;
  moodHistory: MeeBotMood[];
}

interface MeeBotContextType {
  meeBotState: MeeBotState;
  setMeeBot: (mood: MeeBotMood, message: string) => void;
  setReplayFeedback: (status: TransactionStatus) => void;
}

const MeeBotContext = createContext<MeeBotContextType | undefined>(undefined);

export const MeeBotProvider = ({ children }: { children: ReactNode }) => {
  const [meeBotState, setMeeBotState] = useState<MeeBotState>({
    mood: 'neutral',
    message: 'สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?',
    moodHistory: [],
  });

  const setMeeBot = (mood: MeeBotMood, message: string) => {
    setMeeBotState(prevState => ({
      ...prevState,
      mood: mood,
      message: message,
      moodHistory: [...prevState.moodHistory, mood],
    }));
  };

  const setReplayFeedback = (status: TransactionStatus) => {
    switch (status) {
      case 'replayed':
        setMeeBot('celebrate', '🎉 เหรียญของคุณพร้อมซัพพลายแล้ว! กดเลยเพื่อปล่อยพลัง MeeChain Singapore');
        break;
      case 'supplied':
        setMeeBot('success', '✅ ซัพพลายสำเร็จ! เหรียญถูกส่งไปยังปลายทางแล้ว');
        break;
      case 'failed':
        setMeeBot('confused', '😕 ดูเหมือน replay ยังไม่สำเร็จนะครับ รอ��ีกสักครู่หรือกด "ดึงเหรียญกลับ" ถ้าคุณมีสิทธิ์');
        break;
      case 'pending':
        setMeeBot('thinking', '⏳ กำลังตรวจสอบธุรกรรม กรุณารอสักครู่...');
        break;
      case 'refunded':
        setMeeBot('neutral', '↩️ เหรียญถูกดึงกลับแล้ว ตรวจสอบกระเป๋าของคุณนะครับ');
        break;
      default:
        setMeeBot('neutral', 'สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?');
    }
  };

  return (
    <MeeBotContext.Provider value={{ meeBotState, setMeeBot, setReplayFeedback }}>
      {children}
    </MeeBotContext.Provider>
  );
};

export const useMeeBot = () => {
  const context = useContext(MeeBotContext);
  if (context === undefined) {
    throw new Error('useMeeBot must be used within a MeeBotProvider');
  }
  return context;
};
