import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  Clock,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MeeBotTips() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  // MeeBot tips แบบขำ ๆ และเป็นประโยชน์
  const tips = [
    {
      category: "การทำงานทีม",
      icon: "🤝",
      message: "ทีมที่แข็งแกร่งเริ่มต้นจากการสื่อสารที่ดี! มีใครอยากแชร์ progress ของงานกันไหม?",
      action: "ดูความคืบหน้าทีม",
      priority: "high"
    },
    {
      category: "เคล็ดลับ Productivity",
      icon: "⚡",
      message: "ผมว่าถ้าทุกคนทำ Pomodoro พร้อมกัน จะได้พลังโคตรเท่! ใครอยากลองไหม?",
      action: "เริ่ม Pomodoro ทีม",
      priority: "medium"
    },
    {
      category: "แรงบันดาลใจ",
      icon: "🌟",
      message: "คุณรู้ไหมว่าทีมนี้ทำงานไปแล้ว 127 งานในสัปดาห์นี้! สุดยอดมาก ๆ เลย!",
      action: "ดูสถิติทีม",
      priority: "low"
    },
    {
      category: "เควสใหม่",
      icon: "🎯",
      message: "มีเควสใหม่มาแล้ว! 'ช่วยเพื่อนทีมอย่างน้อย 3 คน' รางวัล: +50 XP ใครอยากลุยไหม?",
      action: "ดูเควสใหม่",
      priority: "high"
    },
    {
      category: "พักผ่อน",
      icon: "🧘‍♂️",
      message: "ทำงานมาหนักแล้วนะ! ผมแนะนำให้พัก 5-10 นาที เดินยืดเส้นยืดสายกันครับ!",
      action: "เตือนพักทีม",
      priority: "medium"
    },
    {
      category: "ความสำเร็จ",
      icon: "🏆",
      message: "ยินดีด้วยกับทีม 'Web3 Warriors' ที่ปลดล็อก Badge 'Code Master' ได้สำเร็จ! เก่งมาก!",
      action: "ดู Achievement",
      priority: "high"
    },
    {
      category: "เทคนิคใหม่",
      icon: "💡",
      message: "ผมได้ยินมาว่าการทำ pair programming ช่วยเพิ่มคุณภาพโค้ดได้เยอะเลย! ใครอยากลองไหม?",
      action: "หาคู่ programming",
      priority: "medium"
    },
    {
      category: "สถิติน่าสนใจ",
      icon: "📊",
      message: "ทีมนี้มี productivity rate สูงสุดในช่วงเวลา 14:00-16:00 น.! เป็นช่วง Golden Hour เลยนะ!",
      action: "ดูสถิติเต็ม",
      priority: "low"
    }
  ];

  // สุ่ม tip ใหม่ทุก 10 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const getCurrentTip = () => tips[currentTip];
  const tip = getCurrentTip();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'medium': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'low': return 'from-green-500/20 to-blue-500/20 border-green-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const handleRefreshTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
      setIsAnimating(false);
    }, 300);
  };

  const handleCheckPoints = () => {
    toast({
      title: "เช็คพอยท์สำเร็จ!",
      description: "คุณได้รับ 10 XP สำหรับการเช็คพอยท์ในครั้งนี้",
      variant: "success"
    });
  };

  const handleCompleteAllTips = () => {
    toast({
      title: "🎉 ยอดเยี่ยม!",
      description: "คุณอ่าน MeeBot Tips ครบถ้วนแล้ว",
      variant: "success"
    });
  };

  return (
    <Card className={`bg-gradient-to-r ${getPriorityColor(tip.priority)} transition-all duration-500 ${
      isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/30 rounded-full animate-pulse">
              <Bot className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <span className="text-lg">💬 MeeBot Live Tips</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Real-time
                </Badge>
                <Badge className={`text-xs ${
                  tip.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                  tip.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-green-500/20 text-green-300 border-green-500/30'
                }`}>
                  {tip.priority === 'high' ? '🔥 ด่วน' : tip.priority === 'medium' ? '⭐ แนะนำ' : '💡 ทั่วไป'}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshTip}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0 mt-1">
              {tip.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-cyan-300 font-medium text-sm">{tip.category}</span>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                {tip.message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Target className="w-4 h-4 mr-2" />
            {tip.action}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckPoints}
            className="border-emerald-500 text-emerald-300 hover:bg-emerald-800/50"
            title="เช็คพอยท์ - รับ 10 XP"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-green-500 text-green-300 hover:bg-green-800/50"
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>

        {/* Tip Counter */}
        <div className="flex justify-center">
          <Badge className="bg-slate-700/50 text-gray-300 border-slate-600 text-xs">
            Tips {currentTip + 1} / {tips.length}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}