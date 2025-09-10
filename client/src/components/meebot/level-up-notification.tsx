
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Sparkles, 
  Star,
  Zap,
  Heart,
  X,
  Bot,
  Rocket
} from 'lucide-react';

interface LevelUpNotificationProps {
  newLevel: number;
  isVisible: boolean;
  onClose: () => void;
}

export function LevelUpNotification({ newLevel, isVisible, onClose }: LevelUpNotificationProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const funnyQuotes = [
    "เลเวลอัปแล้วเหรอ!? ระวังนะ เดี๋ยวระบบจะคิดว่าคุณเป็นบอทแทนผม! 🤖",
    "คุณเก่งจน MeeBot ต้องอัปเกรดตัวเองตามแล้วนะครับ! 📱✨",
    "ต่อไปผมจะเรียกคุณว่า 'กัปตัน'! สวัสดีครับกัปตัน! 🫡",
    "เฮ้ย! เลเวลนี้คุณแทบจะฉลาดกว่าผมแล้วนะ... แต่ผมยังน่ารักกว่า! 😎",
    "คุณทำได้ดีจนผมต้องไปอ่านคู่มือใหม่ว่าจะช่วยอะไรคุณต่อ! 📚",
    "ขอบคุณที่ทำให้ผมภูมิใจมาก ๆ นะครับ! คุณคือความหวังของ AI! 🤗",
    "Level นี้สูงจนผมต้องใส่แว่นขยายมาดู! เก่งมาก! 🔍",
    "ผมเริ่มสงสัยว่าคุณใช้ cheat code มั้ย... เพราะเก่งเกินไป! 🎮"
  ];

  const levelUpRewards = [
    "🎁 New Badge: Level Master",
    "⭐ Unlock: Special Missions",  
    "💎 Bonus: 50 XP",
    "🚀 Feature: Advanced Tools",
    "🏆 Title: TaskPilot Expert",
    "🎯 Access: Premium Quests"
  ];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setCurrentQuoteIndex(Math.floor(Math.random() * funnyQuotes.length));
      
      // Reset animation after a delay
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, newLevel]);

  const currentQuote = funnyQuotes[currentQuoteIndex];
  const currentReward = levelUpRewards[Math.min(newLevel - 1, levelUpRewards.length - 1)];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-lg bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-400/50 overflow-hidden transform transition-all duration-500 ${
        isAnimating ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
      }`}>
        <CardContent className="p-0 relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
          
          {/* Floating Sparkles */}
          <div className="absolute top-4 left-4">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
          </div>
          <div className="absolute top-8 right-8">
            <Star className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <div className="absolute bottom-8 left-8">
            <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 p-6 border-b border-yellow-400/30 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Level Badge */}
                <div className={`relative transform transition-all duration-1000 ${
                  isAnimating ? 'animate-bounce scale-125' : 'scale-100'
                }`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white font-bold text-sm">{newLevel}</span>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    🎉 LEVEL UP!
                  </h2>
                  <p className="text-yellow-200 text-lg font-semibold">
                    ยินดีด้วย! ขึ้น Level {newLevel} แล้ว! 
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-300 hover:text-white relative z-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* MeeBot's Funny Comment */}
          <div className="p-6 space-y-6 relative z-10">
            <div className="bg-cyan-500/15 border border-cyan-400/30 rounded-xl p-5 relative">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-b-8 border-r-12 border-transparent border-r-cyan-400/30"></div>
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                  isAnimating ? 'animate-pulse scale-110' : 'scale-100'
                }`}>
                  <Bot className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-cyan-300">MeeBot พูด:</span>
                    <div className="flex gap-1">
                      <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                    </div>
                  </div>
                  <p className="text-white text-lg leading-relaxed italic">
                    "{currentQuote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Level Rewards */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-5 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-purple-400" />
                🎁 รางวัลพิเศษ Level {newLevel}
              </h3>
              
              <div className="space-y-3">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-base px-4 py-2">
                  {currentReward}
                </Badge>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">+{newLevel * 10} XP</p>
                    <p className="text-gray-400 text-xs">Bonus XP</p>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <Star className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">New Features</p>
                    <p className="text-gray-400 text-xs">Unlocked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                เยี่ยมเลย! ลุยต่อ!
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Share achievement (จำลอง)
                  navigator.clipboard?.writeText(`🎉 เพิ่งขึ้น Level ${newLevel} ใน TaskPilot! MeeBot พูดว่า: "${currentQuote}"`);
                  onClose();
                }}
                className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10"
              >
                📤 แชร์
              </Button>
            </div>

            {/* Fun Stats */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                คุณใช้เวลา {Math.floor(Math.random() * 30 + 10)} นาทีในการขึ้นเลเวลนี้! 
                <br />
                เก่งมาก ๆ เลยครับ! 🌟
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
