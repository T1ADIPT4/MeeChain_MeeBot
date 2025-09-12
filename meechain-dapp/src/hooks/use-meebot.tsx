
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MeeBotMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface MeeBotContextType {
  isActive: boolean;
  messages: MeeBotMessage[];
  sendMessage: (content: string) => void;
  clearChat: () => void;
  toggleBot: () => void;
}

const MeeBotContext = createContext<MeeBotContextType | undefined>(undefined);

export function MeeBotProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(true);
  const [messages, setMessages] = useState<MeeBotMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'สวัสดี! ผมคือ MeeBot ผู้ช่วยของคุณใน MeeChain 🤖✨ มีอะไรให้ช่วยไหม?',
      timestamp: new Date(),
    }
  ]);

  const sendMessage = (content: string) => {
    const userMessage: MeeBotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: MeeBotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('เหรียญ') || input.includes('token') || input.includes('mee')) {
      return 'เหรียญ MEE คือสกุลเงินหลักของ MeeChain! คุณสามารถได้รับ MEE จากการทำภารกิจต่างๆ 💰';
    }
    
    if (input.includes('nft') || input.includes('badge')) {
      return 'Badge NFT เป็นสัญลักษณ์แห่งความสำเร็จของคุณ! ทำภารกิจเพื่อปลดล็อก Badge ใหม่ๆ 🏆';
    }
    
    if (input.includes('ภารกิจ') || input.includes('quest') || input.includes('mission')) {
      return 'ภารกิจใน MeeChain มีหลากหลาย! เริ่มจากการเชื่อมต่อ wallet ไปจนถึงการใช้ DeFi 🎯';
    }
    
    if (input.includes('ช่วย') || input.includes('help')) {
      return 'ผมพร้อมช่วยคุณตลอดเวลา! ลองถามเกี่ยวกับ Token, NFT, หรือการใช้งาน MeeChain ดู 😊';
    }
    
    return 'น่าสนใจเลย! มีอะไรอื่นที่อยากรู้เกี่ยวกับ MeeChain อีกไหม? 🤔';
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: 'สวัสดี! ผมคือ MeeBot ผู้ช่วยของคุณใน MeeChain 🤖✨ มีอะไรให้ช่วยไหม?',
      timestamp: new Date(),
    }]);
  };

  const toggleBot = () => {
    setIsActive(prev => !prev);
  };

  return (
    <MeeBotContext.Provider value={{
      isActive,
      messages,
      sendMessage,
      clearChat,
      toggleBot,
    }}>
      {children}
    </MeeBotContext.Provider>
  );
}

export function useMeebot() {
  const context = useContext(MeeBotContext);
  if (context === undefined) {
    throw new Error('useMeebot must be used within a MeeBotProvider');
  }
  return context;
}
