
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type MeeBotMood = 'neutral' | 'thinking' | 'celebrate' | 'confused';

interface MeeBotState {
  mood: MeeBotMood;
  message: string;
  moodHistory: MeeBotMood[];
}

interface MeeBotContextType {
  meeBotState: MeeBotState;
  setMeeBot: (mood: MeeBotMood, message: string) => void;
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

  return (
    <MeeBotContext.Provider value={{ meeBotState, setMeeBot }}>
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
