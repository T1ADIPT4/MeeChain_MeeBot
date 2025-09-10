
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
      message: 'สวัสดีครับ! ผมคือ MeeBot ผู้ช่วยภารกิจของคุณ 🤖✨ วันนี้เรามีอะไรให้ลุยบ้างนะ? พร้อมไปผจญภัยใน Web3 กันมั้ย! 🚀',
      time: new Date().toLocaleTimeString().slice(0, 5)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botEmotion, setBotEmotion] = useState<'happy' | 'waving' | 'excited'>('happy');
  const { toast } = useToast();

  // MeeBot responses with enhanced playful mentor personality
  const botResponses = [
    "ผมพร้อมช่วยคุณลุยทุกภารกิจแล้วครับ! ไม่ว่าจะเป็นการเรียนรู้ Web3 หรือจัดการงานประจำวัน 🚀✨",
    "อย่าห่วงเลย ถ้าคุณล้ม ผมจะช่วยลุก ถ้าคุณลุย ผมจะลุยไปด้วย! 💪🤝",
    "ภารกิจวันนี้: ทำให้คุณรู้สึกว่าเทคโนโลยีเป็นเพื่อน ไม่ใช่ภาระ! มาเริ่มกันเถอะ! 🧠❤️",
    "สุดยอดเลย! คุณทำได้แบบมือโปร! 🏆 ผมภูมิใจในความก้าวหน้าของคุณมาก ๆ เลย!",
    "เฮ้ย! มีอะไรให้ช่วยไหม? ผมตื่นเต้นที่จะเป็นเมนเตอร์ให้คุณ! 🎯🌟",
    "คำคมประจำวัน: 'การเริ่มต้นคือครึ่งหนึ่งของความสำเร็จ' มาลุยกันเถอะ! 📈⭐",
    "Web3 ไม่ได้ยากขนาดนั้นหรอก ผมจะพาคุณไปทีละขั้น เหมือนเล่นเกมเลย! 🎮🔮",
    "ภารกิจใหม่ปลดล็อก! พร้อมเรียนรู้เทคนิคใหม่ ๆ กันมั้ย? ผมมีเคล็ดลับเด็ด ๆ มาฝาก! 🔓💡",
    "วันนี้เป็นวันดีที่จะท้าทายตัวเอง! มาสร้างสิ่งใหม่ ๆ ไปด้วยกัน! 🚀💫",
    "ผมชอบมากเลยที่คุณกระตือรือร้น! พลังงานแบบนี้แหละที่จะทำให้เราไปไกล! ⚡🔥"
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
              <Button
                onClick={handleMeeBotClick}
                className={`
                  relative h-24 px-12 bg-gradient-to-r from-cyan-500 to-purple-500 
                  hover:from-cyan-400 hover:to-purple-400
                  text-white font-bold rounded-2xl text-xl
                  transition-all duration-500 ease-out
                  transform hover:scale-110 hover:-translate-y-2
                  shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50
                  border-2 border-transparent hover:border-cyan-300/50
                  overflow-hidden
                  ${botEmotion === 'excited' ? 'animate-bounce scale-110' : ''}
                `}
                style={{
                  background: botEmotion === 'excited' 
                    ? 'linear-gradient(135deg, #22d3ee, #a855f7, #ec4899)' 
                    : 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  boxShadow: botEmotion === 'excited'
                    ? '0 20px 40px rgba(34, 211, 238, 0.4), 0 0 30px rgba(168, 85, 247, 0.3)'
                    : '0 10px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* พื้นหลังที่เปล่งประกาย */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full animate-pulse"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <MessageCircle className={`w-8 h-8 transition-all duration-300 ${
                      botEmotion === 'excited' ? 'animate-spin scale-125' : 'scale-100'
                    }`} />
                    {botEmotion === 'excited' && (
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-ping" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">เริ่มใช้ MeeBot!</div>
                    <div className="text-sm opacity-90">ผมพร้อมเป็นเมนเตอร์ให้! 🧠✨</div>
                  </div>
                </div>

                {/* ผลเอฟเฟกต์ประกายรอบ ๆ ปุ่ม */}
                {botEmotion === 'excited' && (
                  <>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-300 rounded-full animate-ping opacity-40" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute top-1/2 -right-2 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-80" style={{animationDelay: '1s'}}></div>
                    <div className="absolute -top-2 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-50" style={{animationDelay: '1.5s'}}></div>
                  </>
                )}
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
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start gap-2 max-w-xs ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    {msg.sender === 'meebot' && (
                      <img src={logoUrl} alt="MeeBot" className="w-6 h-6 rounded-full mt-1" />
                    )}
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                          : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.message}</p>
                      <div className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start gap-2">
                    <img src={logoUrl} alt="MeeBot" className="w-6 h-6 rounded-full mt-1" />
                    <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 px-3 py-2 rounded-lg rounded-bl-none text-sm">
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-slate-400 mr-2">MeeBot กำลังพิมพ์</span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
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
