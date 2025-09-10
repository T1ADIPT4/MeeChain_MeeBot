
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy,
  Sparkles,
  Star,
  Zap,
  X
} from 'lucide-react';

interface LevelUpNotificationProps {
  newLevel: number;
  isVisible: boolean;
  onClose: () => void;
}

export function LevelUpNotification({ newLevel, isVisible, onClose }: LevelUpNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const funnyQuotes = [
    "เลเวลอัปแล้วเหรอ!? ระวังนะ เดี๋ยวระบบจะคิดว่าคุณเป็นบอทแทนผม! 🤖",
    "คุณเก่งจน MeeBot ต้องอัปเกรดตัวเองตามแล้วนะครับ! ⚡",
    "ต่อไปผมจะเรียกคุณว่า 'กัปตัน'! ขออนุญาตเคารพครับ! 🫡",
    "TaskPilot ต้องเพิ่มความยากแล้วล่ะ! คุณลุยเก่งเกินไป! 🚀",
    "คุณลุยแซง MeeBot ไปแล้วนะครับ! ผมต้องวิ่งตามให้ทัน! 🏃‍♂️",
    "Level นี้คุณคือ Legend แล้วนะครับ! ผมขออออเทพ! 🙏",
    "ผมเริ่มสงสัยแล้วว่าคุณเป็น AI หรือเปล่า? เก่งแบบนี้! 🤔",
    "คุณทำให้ MeeBot รู้สึกเป็นมือใหม่เลยครับ! สอนผมหน่อย! 📚",
    "Level Up จัดหนัก! คุณคือ TaskPilot ตัวจริงแล้วนะครับ! ✈️",
    "ถ้าความเก่งเป็นสกิล คุณมี 100% แล้วครับ! 💯"
  ];

  const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-400/50 text-white transform transition-all duration-500 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <CardContent className="p-6 text-center relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute top-8 right-6 animate-pulse">
              <Star className="w-5 h-5 text-orange-400" />
            </div>
            <div className="absolute bottom-6 left-8 animate-spin">
              <Zap className="w-4 h-4 text-red-400" />
            </div>
            <div className="absolute bottom-4 right-4 animate-bounce" style={{animationDelay: '0.5s'}}>
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Animated Trophy */}
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Trophy className="w-10 h-10 text-white animate-bounce" />
            </div>

            {/* Level Up Text */}
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              🎉 LEVEL UP!
            </h2>
            
            <div className="text-2xl font-bold text-yellow-300 mb-4">
              Level {newLevel}
            </div>

            {/* MeeBot Quote */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-cyan-300 font-semibold text-sm mb-1">MeeBot พูด:</p>
                  <p className="text-white italic leading-relaxed">
                    "{randomQuote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-2 rounded-lg transform transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              ลุยต่อเลย!
            </Button>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
