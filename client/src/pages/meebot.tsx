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
  Zap,
  Rocket,
  Star,
  RefreshCw,
  CheckCircle,
  Clock,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';
import { DailyQuests } from '@/components/meebot/daily-quests';
import { LevelUpNotification } from '@/components/meebot/level-up-notification';
import { MeeBotOnboardingModal } from '@/components/meebot/meebot-onboarding-modal';



export default function MeeBotPage() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false); // State for onboarding modal
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [chatMessages, setChatMessages] = useState<Array<{id: number, sender: 'user' | 'meebot', message: string, time: string}>>([
    {
      id: 1,
      sender: 'meebot',
      message: 'สวัสดีครับ! ผมคือ MeeBot ผู้ช่วยภารกิจของคุณ 🤖✨ วันนี้เรามีอะไรให้ลุยบ้างนะ? พร้อมไปผจญภัยใน Web3 กันมั้ย! 🚀',
      time: new Date().toLocaleTimeString().slice(0, 5)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botEmotion, setBotEmotion] = useState<'happy' | 'waving' | 'excited'>('happy');
  const { toast } = useToast();
  const [currentExp, setCurrentExp] = useState(0);
  const [expToNext, setExpToNext] = useState(100);
  const [showLevelUp, setShowLevelUp] = useState({ show: false, level: 1 });
  const [meeBotQuotes, setMeeBotQuotes] = useState<string[]>([
    "ผมพร้อมช่วยคุณลุยทุกภารกิจแล้วครับ! ไม่ว่าจะเป็นการเรียนรู้ Web3 หรือจัดการงานประจำวัน 🚀✨",
    "อย่าห่วงเลย ถ้าคุณล้ม ผมจะช่วยลุก ถ้าคุณลุย ผมจะลุยไปด้วย! 💪🤝",
    "ภารกิจวันนี้: ทำให้คุณรู้สึกว่าเทคโนโลยีเป็นเพื่อน ไม่ใช่ภาระ! มีอะไรให้ผมช่วยไหม? 🎯",
    "งานเยอะไม่ใช่ปัญหา ถ้าเรามีแผนที่ดีและใจที่พร้อมลุย! เอาล่ะ มาวางแผนกันเถอะ! 📋✨",
    "เฮ้ย! คุณทำได้ดีมาก ๆ เลยนะ! ผมภูมิใจในตัวคุณมาก ต่อไปเราลุยภารกิจอะไรดี? 🏆🔥",
    "ไม่ต้องเครียดนะครับ เราทำทีละขั้นตอน แล้วจะเห็นว่าทุกอย่างง่ายขึ้นเรื่อย ๆ! พร้อมไหม? 🧘‍♂️💫",
    "สุดยอดเลย! คุณเรียนรู้เร็วมาก ๆ แบบนี้อีกไม่นานคุณจะเป็นมือโปร Web3 แน่นอน! 🚀⭐"
  ]);
  const [stats, setStats] = useState({
    tasksCompleted: 15,
    totalXP: 1500,
    streak: 7,
    achievements: 3,
  });

  // MeeBot responses with enhanced playful mentor personality
  const botResponses = [
    "ผมพร้อมช่วยคุณลุยทุกภารกิจแล้วครับ! ไม่ว่าจะเป็นการเรียนรู้ Web3 หรือจัดการงานประจำวัน 🚀✨",
    "อย่าห่วงเลย ถ้าคุณล้ม ผมจะช่วยลุก ถ้าคุณลุย ผมจะลุยไปด้วย! 💪🤝",
    "ภารกิจวันนี้: ทำให้คุณรู้สึกว่าเทคโนโลยีเป็นเพื่อน ไม่ใช่ภาระ! มีอะไรให้ผมช่วยไหม? 🎯",
    "งานเยอะไม่ใช่ปัญหา ถ้าเรามีแผนที่ดีและใจที่พร้อมลุย! เอาล่ะ มาวางแผนกันเถอะ! 📋✨",
    "เฮ้ย! คุณทำได้ดีมาก ๆ เลยนะ! ผมภูมิใจในตัวคุณมาก ต่อไปเราลุยภารกิจอะไรดี? 🏆🔥",
    "ไม่ต้องเครียดนะครับ เราทำทีละขั้นตอน แล้วจะเห็นว่าทุกอย่างง่ายขึ้นเรื่อย ๆ! พร้อมไหม? 🧘‍♂️💫",
    "สุดยอดเลย! คุณเรียนรู้เร็วมาก ๆ แบบนี้อีกไม่นานคุณจะเป็นมือโปร Web3 แน่นอน! 🚀⭐"
  ];

  // เล่นเสียงเอฟเฟกต์ MeeBot (จำลอง)
  const playMeeBotSound = () => {
    // สร้างเสียง "ปุ๊ง!" ด้วย Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('เสียงไม่สามารถเล่นได้:', error);
    }
  };

  const handleMeeBotClick = () => {
    // เล่นเสียงเอฟเฟกต์
    playMeeBotSound();

    // การสั่นของอุปกรณ์
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    setBotEmotion('excited');
    setShowChat(true);

    toast({
      title: "🎉 เฮ้ย! ผมมาแล้วครับ!",
      description: "พร้อมลุยภารกิจไปด้วยกันเลย! ผมตื่นเต้นมาก ๆ! 🚀💪",
    });

    // รีเซ็ต emotion หลัง 3 วินาที
    setTimeout(() => setBotEmotion('happy'), 3000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // เล่นเสียงส่งข้อความ
    playMeeBotSound();

    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user' as const,
      message: newMessage,
      time: new Date().toLocaleTimeString().slice(0, 5)
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response with random delay for realism
    const responseDelay = Math.random() * 1000 + 1000; // 1-2 seconds
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

      // เล่นเสียงตอบกลับ
      setTimeout(() => playMeeBotSound(), 100);

      // การสั่นเบา ๆ เมื่อได้รับข้อความ
      if ('vibrate' in navigator) {
        navigator.vibrate([50]);
      }
    }, responseDelay);
  };

  const handleStartChat = () => {
    setShowChat(true);
    // Optionally play a sound or animation when starting chat
    playMeeBotSound();
    setBotEmotion('happy'); // Reset emotion when chat starts
  };

  const handleLevelUp = (newLevel: number) => {
    setCurrentLevel(newLevel);
    setShowLevelUpNotification(true);

    // เล่นเสียงพิเศษสำหรับ level up
    playMeeBotSound();

    // การสั่นพิเศษสำหรับ level up
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    setBotEmotion('excited');
    setTimeout(() => setBotEmotion('happy'), 3000);
  };

  const handleNewQuote = () => {
    // Simulate fetching a new quote
    const newQuote = "นี่คือคำคมใหม่ที่ MeeBot เพิ่งคิดสด ๆ ร้อน ๆ ครับ! 🔥";
    setMeeBotQuotes(prev => [...prev, newQuote]);
    playMeeBotSound();
  };

  useEffect(() => {
    // Simulate fetching initial data for level and stats
    setCurrentLevel(3);
    setCurrentExp(150);
    setExpToNext(250);
    setStats({
      tasksCompleted: 25,
      totalXP: 2200,
      streak: 10,
      achievements: 5,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
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

      <div className="px-6 py-8 min-h-0 flex-1">
        {/* Main Container */}
        <div className="max-w-2xl mx-auto space-y-6 min-h-0">

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
                เฮ้ย! ผมมีบอท ครูพี่เมนเตอร์ตัวจริง! 🧠
              </h2>

              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                ผมพร้อมช่วยคุณลุยทุกภารกิจแล้วครับ! 💪<br />
                จากมือใหม่สู่มือโปร Web3 แบบสนุก ๆ ไม่เครียด ✨<br />
                <span className="text-cyan-300 font-semibold">อย่าห่วงเลย ถ้าคุณล้ม ผมจะช่วยลุก!</span><br />
                <span className="text-purple-300 font-medium italic">ภารกิจวันนี้: ทำให้เทคโนโลยีเป็นเพื่อนคุณ! 🎯</span>
              </p>

              {/* Features Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  คุยได้เป็นเพื่อน
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Bot className="w-3 h-3 mr-1" />
                  โค้ชส่วนตัว
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  ปลดล็อกความรู้
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  <Heart className="w-3 h-3 mr-1" />
                  ให้กำลังใจ
                </Badge>
              </div>

              {/* Enhanced Main MeeBot Button */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Button
                  onClick={() => setShowOnboardingModal(true)}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg text-lg"
                >
                  <Rocket className="w-6 h-6 mr-2" />
                  🎯 เริ่มภารกิจ TaskPilot
                </Button>

                <Button
                  onClick={handleStartChat}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  คุยกับ MeeBot
                </Button>
              </div>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/15 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/15 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
            </CardContent>
          </Card>

          {/* Daily Quests Section */}
          <DailyQuests onLevelUp={handleLevelUp} />

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-slate-800/95 border-cyan-500/30 max-h-[80vh] flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-4 border-b border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">MeeBot</h3>
                    <p className="text-xs text-cyan-300">ออนไลน์ • พร้อมช่วยเหลือ</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-slate-700 text-gray-100'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-gray-100 px-4 py-2 rounded-lg max-w-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="พิมพ์ข้อความ..."
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onboarding Modal */}
      <MeeBotOnboardingModal 
        isOpen={showOnboardingModal} 
        onClose={() => setShowOnboardingModal(false)} 
      />

      {/* Level Up Notification */}
      <LevelUpNotification
        newLevel={currentLevel}
        isVisible={showLevelUpNotification}
        onClose={() => setShowLevelUpNotification(false)}
      />
    </div>
  );
}