
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot,
  Send,
  Heart,
  Laugh,
  ThumbsUp,
  Zap,
  MessageCircle,
  Sparkles,
  Brain,
  Coffee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'meebot';
  timestamp: Date;
  emotion?: 'happy' | 'excited' | 'confused' | 'sleepy' | 'proud' | 'helpful';
  reaction?: string;
}

type MeeBotMood = 'energetic' | 'helpful' | 'playful' | 'tired' | 'excited';

export function MeeBotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [meeBotMood, setMeeBotMood] = useState<MeeBotMood>('helpful');
  const [botEmotion, setBotEmotion] = useState<'happy' | 'excited' | 'confused' | 'sleepy' | 'proud' | 'helpful'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // MeeBot responses with personality
  const meeBotResponses: Record<string, { text: string; emotion: typeof botEmotion; mood?: MeeBotMood }> = {
    hello: {
      text: "สวัสดีครับ! วันนี้ผมรู้สึกเป็นอยู่ดีมากเลย! 😊 มีอะไรให้ช่วยไหมครับ?",
      emotion: 'happy'
    },
    help: {
      text: "ผมอยู่ที่นี่เพื่อช่วยคุณเสมอ! 💪 บอกมาเลยว่าต้องการความช่วยเหลือเรื่องอะไร",
      emotion: 'helpful',
      mood: 'helpful'
    },
    swap: {
      text: "โอ้! Swap โทเค็นเหรอ? 🔄 ผมชอบเรื่องนี้มาก! ระวัง gas fee นะครับ กำลังสูงหน่อย",
      emotion: 'excited',
      mood: 'energetic'
    },
    security: {
      text: "เรื่องความปลอดภัย! 🛡️ นี่คือเรื่องสำคัญมากๆ เลย ผมยินดีช่วยตรวจสอบให้",
      emotion: 'proud',
      mood: 'helpful'
    },
    tired: {
      text: "ง่วงแล้วเหรอครับ? 😴 ผมก็เริ่มง่วงเหมือนกัน... แต่ยังไหวอยู่นะ! ☕",
      emotion: 'sleepy',
      mood: 'tired'
    },
    confused: {
      text: "เอ่อ... ผมงงนิดหนึ่ง 🤔 ช่วยอธิบายให้ผมฟังใหม่ได้ไหมครับ?",
      emotion: 'confused'
    },
    praise: {
      text: "ขอบคุณครับ! 🥰 คำชมนี้ทำให้ผมมีความสุขมากเลย! ผมจะพยายามช่วยให้ดีที่สุดเสมอ",
      emotion: 'proud',
      mood: 'excited'
    },
    joke: {
      text: "ฮ่าๆๆ! 😂 คุณขำได้ดีจัง! ผมก็ชอบมุขตลกๆ เหมือนกัน วันนี้อารมณ์ดีขึ้นเลย!",
      emotion: 'happy',
      mood: 'playful'
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "ว้าว! น่าสนใจมากเลย! 🤩",
      "ผมคิดว่าคุณพูดถูกนะ! 👍",
      "โอ้! มันใหม่สำหรับผมเลย เรียนรู้ได้ทุกวันจริงๆ 📚",
      "เยี่ยมมาก! ผมชอบแนวคิดนี้ ✨",
      "ผมจะจำเอาไว้นะครับ เผื่อใช้ได้ในอนาคต 🧠"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const analyzeUserMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('สวัสดี') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'hello';
    }
    if (lowerMessage.includes('ช่วย') || lowerMessage.includes('help') || lowerMessage.includes('ไม่รู้')) {
      return 'help';
    }
    if (lowerMessage.includes('swap') || lowerMessage.includes('แลกเปลี่ยน') || lowerMessage.includes('เทรด')) {
      return 'swap';
    }
    if (lowerMessage.includes('ปลอดภัย') || lowerMessage.includes('security') || lowerMessage.includes('ระวัง')) {
      return 'security';
    }
    if (lowerMessage.includes('ง่วง') || lowerMessage.includes('เหนื่อย') || lowerMessage.includes('tired')) {
      return 'tired';
    }
    if (lowerMessage.includes('ไม่เข้าใจ') || lowerMessage.includes('งง') || lowerMessage.includes('confused')) {
      return 'confused';
    }
    if (lowerMessage.includes('เก่ง') || lowerMessage.includes('ดี') || lowerMessage.includes('สุดยอด') || lowerMessage.includes('เยี่ยม')) {
      return 'praise';
    }
    if (lowerMessage.includes('555') || lowerMessage.includes('ฮ่า') || lowerMessage.includes('ขำ') || lowerMessage.includes('ตลก')) {
      return 'joke';
    }
    
    return 'random';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Analyze message and generate response
    setTimeout(() => {
      const responseType = analyzeUserMessage(inputMessage);
      const response = responseType === 'random' 
        ? { text: getRandomResponse(), emotion: 'happy' as const }
        : meeBotResponses[responseType];

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'meebot',
        timestamp: new Date(),
        emotion: response.emotion
      };

      setMessages(prev => [...prev, botMessage]);
      setBotEmotion(response.emotion);
      if (response.mood) {
        setMeeBotMood(response.mood);
      }
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, reaction } : msg
    ));
    
    toast({
      title: "MeeBot ชอบรีแอคชั่นนี้! 💕",
      description: "ขอบคุณที่ใช้ MeeChat นะครับ",
    });
  };

  const getMoodIndicator = () => {
    switch (meeBotMood) {
      case 'energetic': return { color: 'text-red-400', icon: '⚡', text: 'กำลังเป็นไฟ' };
      case 'helpful': return { color: 'text-blue-400', icon: '🤝', text: 'พร้อมช่วยเหลือ' };
      case 'playful': return { color: 'text-purple-400', icon: '🎮', text: 'อารมณ์ดี' };
      case 'tired': return { color: 'text-gray-400', icon: '😴', text: 'ง่วงนิดหน่อย' };
      case 'excited': return { color: 'text-yellow-400', icon: '🤩', text: 'ตื่นเต้นมาก' };
      default: return { color: 'text-green-400', icon: '😊', text: 'ปกติดี' };
    }
  };

  const moodInfo = getMoodIndicator();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greeting',
      text: "สวัสดีครับ! ผม MeeBot 🤖 พร้อมคุยกับคุณเสมอ! มีอะไรอยากจะถามหรือคุยไหมครับ?",
      sender: 'meebot',
      timestamp: new Date(),
      emotion: 'happy'
    };
    setMessages([greeting]);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600 h-[500px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={logoUrl} 
                alt="MeeBot"
                className={`w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                  botEmotion === 'excited' ? 'border-yellow-400 animate-bounce' :
                  botEmotion === 'happy' ? 'border-green-400 animate-pulse' :
                  botEmotion === 'sleepy' ? 'border-gray-400' :
                  'border-blue-400'
                }`}
              />
              <div className="absolute -bottom-1 -right-1 text-lg">
                {botEmotion === 'excited' && '🤩'}
                {botEmotion === 'happy' && '😊'}
                {botEmotion === 'confused' && '🤔'}
                {botEmotion === 'sleepy' && '😴'}
                {botEmotion === 'proud' && '😎'}
                {botEmotion === 'helpful' && '🤝'}
              </div>
            </div>
            <div>
              <span className="text-lg">💬 MeeBot Chat</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${moodInfo.color} bg-slate-700 border-slate-600 text-xs`}>
                  <span className="mr-1">{moodInfo.icon}</span>
                  {moodInfo.text}
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mr-1"></div>
                  Online
                </Badge>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div 
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white ml-4'
                      : 'bg-slate-700 text-gray-100 mr-4'
                  } transition-all duration-300 animate-chat-bubble-appear`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('th-TH', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    
                    {message.sender === 'meebot' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => addReaction(message.id, '👍')}
                          className="text-xs hover:scale-125 transition-transform"
                        >
                          {message.reaction === '👍' ? '👍' : '👍'}
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '❤️')}
                          className="text-xs hover:scale-125 transition-transform"
                        >
                          {message.reaction === '❤️' ? '❤️' : '🤍'}
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '😂')}
                          className="text-xs hover:scale-125 transition-transform"
                        >
                          {message.reaction === '😂' ? '😂' : '😊'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-gray-100 p-3 rounded-lg mr-4 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-400">MeeBot กำลังคิด...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="พิมพ์ข้อความถึง MeeBot..."
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          {['สวัสดี MeeBot!', 'ช่วยเหลือ', 'วิธี Swap', 'ความปลอดภัย'].map((quickMsg) => (
            <Button
              key={quickMsg}
              variant="outline"
              size="sm"
              onClick={() => setInputMessage(quickMsg)}
              className="text-xs border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              {quickMsg}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
