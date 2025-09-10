import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
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
  Trophy,
  Menu,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';
import { DailyQuests } from '@/components/meebot/daily-quests';
import { LevelUpNotification } from '@/components/meebot/level-up-notification';
import { MeeBotOnboardingModal } from '@/components/meebot/meebot-onboarding-modal';
import { Link } from 'wouter';
import { MeeBotTips } from '@/components/meebot/meebot-tips';
import { MeeBotInsight } from '@/components/meebot/meebot-insight';
import { WeeklyQuest } from '@/components/meebot/weekly-quest';
import { MeeBotChat } from '@/components/meebot/meebot-chat';
import { CustomerContacts } from '@/components/meebot/customer-contacts';

// Placeholder for the new SystemCheck component
const SystemCheck = () => {
  return (
    <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/30">
      <CardContent className="p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-300 mb-2">
          ✅ ระบบตรวจสอบ MeeBot
        </h3>
        <p className="text-green-200">
          สถานะระบบ: <Badge variant="outline" className="border-green-400 text-green-300">ปกติ</Badge>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          อัปเดตล่าสุด: {new Date().toLocaleTimeString().slice(0, 5)}
        </p>
      </CardContent>
    </Card>
  );
};


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

  // Dummy state for sidebar and user stats, assuming they are defined elsewhere or managed globally
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState({ questsCompleted: 0, expGained: 0, level: 1 });
  const [showOnboarding, setShowOnboarding] = useState(false);


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
    // Set dummy initial stats for sidebar
    setUserStats({ questsCompleted: 2, expGained: 150, level: 2 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 transition-transform duration-300 z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-80`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">TaskPilot Assistant</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4 h-full overflow-y-auto pb-20">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-cyan-300 mb-2">📊 สถิติวันนี้</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">เควสสำเร็จ:</span>
                <span className="text-green-400 font-semibold">{userStats.questsCompleted}/3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">EXP ได้รับ:</span>
                <span className="text-yellow-400 font-semibold">+{userStats.expGained}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">เลเวล:</span>
                <span className="text-purple-400 font-semibold">{userStats.level}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-cyan-300 mb-2">🎯 เควสด่วน</h3>
            <div className="space-y-2">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                <p className="text-yellow-300 text-sm font-medium">📝 สร้าง Task ใหม่</p>
                <p className="text-gray-300 text-xs mt-1">รางวัล: +50 EXP</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                <p className="text-blue-300 text-sm font-medium">✅ ทำ Task ให้เสร็จ 3 รายการ</p>
                <p className="text-gray-300 text-xs mt-1">รางวัล: +100 EXP</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-cyan-300 mb-2">🏆 Achievement ล่าสุด</h3>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
              <p className="text-purple-300 text-sm font-medium">First Flight</p>
              <p className="text-gray-300 text-xs mt-1">ครั้งแรกที่ใช้งาน TaskPilot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content - Scrollable */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-400 hover:text-white bg-slate-800/50 backdrop-blur-sm border border-slate-700"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <Link to="/dashboard">
                <Button
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white bg-slate-800/50 backdrop-blur-sm border border-slate-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">ย้อนกลับ</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2">
                <span className="text-yellow-400 font-semibold">⭐ Level {userStats.level}</span>
              </div>
              <div className="flex gap-2">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800/50">
                    หน้าหลัก
                  </Button>
                </Link>
                <Link to="/missions">
                  <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-800/50">
                    ถัดไป: ภารกิจ
                  </Button>
                </Link>
                <Link to="/team-dashboard">
                  <Button variant="outline" className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50">
                    🤝 ทีมแดชบอร์ด
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto px-6 pb-8 space-y-8">
          {/* Daily Quests */}
          <DailyQuests />

          {/* System Check */}
          <SystemCheck />

          {/* Additional MeeBot Features Placeholder */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-300 mb-2">
                🚀 ฟีเจอร์ใหม่กำลังมา
              </h3>
              <p className="text-purple-200">
                MeeBot กำลังเตรียมฟีเจอร์เจ๋ง ๆ มาให้ ติดตามได้เลย!
              </p>
            </CardContent>
          </Card>

          {/* Tabs for MeeBot Features */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="chat" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                <MessageCircle className="w-4 h-4" />
                MeeBot Chat
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
              >
                <Users className="w-4 h-4" />
                Customer Contacts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <MeeBotChat />
            </TabsContent>
            <TabsContent value="contacts" className="space-y-6">
              <CustomerContacts />
            </TabsContent>
          </Tabs>

        {/* New MeeBot Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MeeBotInsight />
          </div>
          <div className="lg:col-span-1">
            <WeeklyQuest />
          </div>
          <div className="lg:col-span-1">
            <MeeBotChat />
          </div>
        </div>
        </div>
      </div>

      {/* MeeBot Onboarding Modal */}
      <MeeBotOnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
      </div>
    </div>
  );
}