
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  Heart,
  ArrowLeft,
  MessageCircle,
  X,
  Send,
  User,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

export default function MeeBotPage() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: number, sender: 'user' | 'meebot', message: string, time: string}>>([
    {
      id: 1,
      sender: 'meebot',
      message: 'สวัสดีครับ! ผมมีบอท พร้อมช่วยเหลือคุณแล้ว ✨',
      time: new Date().toLocaleTimeString().slice(0, 5)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botEmotion, setBotEmotion] = useState<'happy' | 'waving' | 'excited'>('happy');
  const { toast } = useToast();

  // MeeBot responses
  const botResponses = [
    "เยี่ยมเลย! มีอะไรให้ช่วยอีกไหมครับ? 🚀",
    "ผมพร้อมช่วยคุณทำภารกิจต่างๆ เลยนะครับ! 💪",
    "คุณสามารถถามเกี่ยวกับ Token, Swap, หรือ DeFi ได้เลยครับ 🌟",
    "มาลุยภารกิจกันเถอะ! คุณต้องการเริ่มจากไหนดี? ⚡",
    "ผมจะดูแลคุณตลอดการใช้งาน MeeChain นะครับ ❤️"
  ];

  const handleMeeBotClick = () => {
    // เล่นเสียงเอฟเฟกต์
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    setBotEmotion('excited');
    setShowChat(true);

    toast({
      title: "🎉 มีบอทพร้อมช่วยแล้ว!",
      description: "เริ่มแชทกับมีบอทได้เลย!",
    });

    // รีเซ็ต emotion หลัง 2 วินาที
    setTimeout(() => setBotEmotion('happy'), 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user' as const,
      message: newMessage,
      time: new Date().toLocaleTimeString().slice(0, 5)
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: chatMessages.length + 2,
        sender: 'meebot' as const,
        message: randomResponse,
        time: new Date().toLocaleTimeString().slice(0, 5)
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <nav className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-300"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          กลับ
        </Button>
        <h1 className="text-xl font-bold text-blue-300">🤖 MeeBot</h1>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </nav>

      <div className="px-6 py-8">
        {/* Main Container */}
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* MeeBot Intro Card */}
          <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30 overflow-hidden relative">
            <CardContent className="p-8 text-center">
              {/* MeeBot Avatar */}
              <div className="relative mb-6">
                <img 
                  src={logoUrl} 
                  alt="MeeBot" 
                  className={`w-24 h-24 mx-auto rounded-full transition-all duration-500 ${
                    botEmotion === 'excited' ? 'scale-125 animate-bounce' :
                    botEmotion === 'waving' ? 'animate-pulse scale-110' : 
                    'scale-100'
                  }`}
                  style={{
                    filter: botEmotion === 'excited' ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)',
                  }}
                />
                {botEmotion === 'excited' && (
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                  </div>
                )}
                <Heart className="absolute -top-1 -right-1 w-5 h-5 text-red-400 animate-pulse" />
              </div>

              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                สวัสดีครับ! ผมมีบอท
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                พร้อมช่วยเหลือคุณในทุกภารกิจ Web3 <br />
                ตั้งแต่การ Swap Token ไปจนถึงการทำ DeFi ต่างๆ
              </p>

              {/* Features Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  ตอบคำถามได้
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Bot className="w-3 h-3 mr-1" />
                  แนะนำภารกิจ
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  ช่วยทำงาน
                </Badge>
              </div>

              {/* Main MeeBot Button */}
              <Button
                onClick={handleMeeBotClick}
                className={`
                  h-20 px-12 bg-gradient-to-r from-cyan-500 to-purple-500 
                  hover:from-cyan-400 hover:to-purple-400
                  text-white font-bold rounded-2xl text-xl
                  transition-all duration-500 ease-out
                  transform hover:scale-110 hover:-translate-y-1
                  shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40
                  border-2 border-transparent hover:border-cyan-300/50
                  ${botEmotion === 'excited' ? 'animate-pulse scale-105' : ''}
                `}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="flex items-center gap-4">
                  <MessageCircle className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-bold text-xl">เริ่มแชทกับมีบอท!</div>
                    <div className="text-sm opacity-90">คลิกเพื่อเริ่มสนทนา</div>
                  </div>
                </div>
              </Button>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/15 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/15 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 h-20 text-slate-300"
              onClick={() => navigate('/missions')}
            >
              <div className="text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">ดูภารกิจ</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 h-20 text-slate-300"
              onClick={() => navigate('/dashboard')}
            >
              <div className="text-center">
                <Bot className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Dashboard</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md h-96 bg-slate-800 border-slate-600 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="MeeBot" className="w-8 h-8 rounded-full" />
                <div>
                  <h3 className="font-semibold text-white">มีบอท</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-300">ออนไลน์</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <div className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
