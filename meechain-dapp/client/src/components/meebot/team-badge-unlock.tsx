
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Users,
  Target,
  Sparkles,
  Star,
  CheckCircle,
  Clock,
  Zap,
  Gift,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamProgress {
  completedTasks: number;
  goal: number;
  badge: string;
  badgeIcon: string;
  description: string;
  teamMembers: string[];
  timeLeft?: string;
}

interface TeamBadgeUnlockProps {
  progress: TeamProgress;
  onBadgeUnlock?: (badge: string) => void;
}

export function TeamBadgeUnlock({ progress, onBadgeUnlock }: TeamBadgeUnlockProps) {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [wasUnlocked, setWasUnlocked] = useState(false);

  const isUnlocked = progress.completedTasks >= progress.goal;
  const progressPercentage = (progress.completedTasks / progress.goal) * 100;
  const remaining = progress.goal - progress.completedTasks;

  // MeeBot มีคำพูดสำหรับสถานการณ์ต่าง ๆ
  const meeBotComments = {
    nearCompletion: [
      `อีก ${remaining} งานเท่านั้น! ผมเตรียม Badge ไว้ให้แล้วนะครับ! ✨`,
      `ใกล้แล้วๆ! MeeBot เต้นหมุน 360 องศารอให้ทีมปลดล็อกอยู่เลย! 🌀`,
      `ทีมนี้สุดยอดมาก! อีกแค่ ${remaining} งาน Badge "${progress.badge}" จะเป็นของพวกคุณ! 🏆`
    ],
    midProgress: [
      "คุณคือทีมที่ MeeBot อยากอยู่ด้วยที่สุดเลย! ลุยต่อไปครับ! 💪",
      "ถ้าทุกคนลุยพร้อมกันแบบนี้ ผมจะเต้นหมุนให้ดูเลย! 🕺",
      "พลังทีมเนี่ย! ผมรู้สึกตื่นเต้นไปด้วยเลยครับ! ⚡"
    ],
    justStarted: [
      "เริ่มต้นได้ดีมาก! ผมเชื่อในพลังของทีมนี้ครับ! 🚀",
      "มาลุยกันเถอะ! ทุกคนในทีมล้วนเป็นเหล่านักบิน! ✈️",
      "MeeBot พร้อมเป็นเชียร์ลีดเดอร์ให้ทีมนี้เลย! 📣"
    ],
    unlocked: [
      "🎉 สุดยอดเลยครับ! ทีมนี้มีพลังจริง ๆ! Badge ปลดล็อกแล้ว!",
      "ยินดีด้วยครับทุกคน! ผมภูมิใจในทีมนี้มาก ๆ! 🏆✨",
      "เย้! ทีมของผมเก่งที่สุดในจักรวาล! 🌟💫"
    ]
  };

  const getCurrentComment = () => {
    if (isUnlocked) {
      return meeBotComments.unlocked[Math.floor(Math.random() * meeBotComments.unlocked.length)];
    } else if (remaining <= 2) {
      return meeBotComments.nearCompletion[Math.floor(Math.random() * meeBotComments.nearCompletion.length)];
    } else if (progressPercentage >= 50) {
      return meeBotComments.midProgress[Math.floor(Math.random() * meeBotComments.midProgress.length)];
    } else {
      return meeBotComments.justStarted[Math.floor(Math.random() * meeBotComments.justStarted.length)];
    }
  };

  // เช็คการปลดล็อก badge ใหม่
  useEffect(() => {
    if (isUnlocked && !wasUnlocked) {
      setIsAnimating(true);
      setWasUnlocked(true);

      // เล่นเอฟเฟกต์การปลดล็อก
      toast({
        title: `🏅 Badge "${progress.badge}" ปลดล็อกแล้ว!`,
        description: getCurrentComment(),
      });

      if (onBadgeUnlock) {
        onBadgeUnlock(progress.badge);
      }

      // รีเซ็ตแอนิเมชันหลัง 2 วินาที
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [isUnlocked, wasUnlocked, progress.badge, onBadgeUnlock]);

  const getBadgeColor = () => {
    if (isUnlocked) return 'from-yellow-400 to-orange-500';
    if (progressPercentage >= 75) return 'from-purple-400 to-pink-500';
    if (progressPercentage >= 50) return 'from-blue-400 to-purple-500';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <Card className={`bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 transition-all duration-500 ${
      isAnimating ? 'scale-105 shadow-2xl shadow-yellow-500/20' : ''
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${getBadgeColor()} ${
              isAnimating ? 'animate-spin' : ''
            }`}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg">🏅 เควสทีม: ปลดล็อก Badge</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{progress.badgeIcon}</span>
                <span className="text-yellow-300 font-bold">"{progress.badge}"</span>
              </div>
            </div>
          </div>
          {isUnlocked && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
              <CheckCircle className="w-4 h-4 mr-1" />
              ปลดล็อกแล้ว!
            </Badge>
          )}
        </CardTitle>
        <p className="text-gray-300 text-sm">{progress.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>ความคืบหน้าทีม</span>
            <span>{progress.completedTasks} / {progress.goal} งาน ({Math.round(progressPercentage)}%)</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-4 bg-slate-700 transition-all duration-500 ${
              isAnimating ? 'animate-pulse' : ''
            }`} 
          />
        </div>

        {/* Team Members */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-medium">สมาชิกทีม ({progress.teamMembers.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {progress.teamMembers.map((member, index) => (
              <Badge key={index} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                {member}
              </Badge>
            ))}
          </div>
        </div>

        {/* MeeBot Comment */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-purple-300 font-semibold">💬 MeeBot บอก:</span>
                {progress.timeLeft && (
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {progress.timeLeft}
                  </Badge>
                )}
              </div>
              <p className="text-gray-300 text-sm italic">
                "{getCurrentComment()}"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isUnlocked ? (
            <Button 
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              onClick={() => toast({ 
                title: "🚀 ลุยกันเถอะ!", 
                description: "MeeBot: \"มาทำเควสให้ครบกันเถอะครับ! ผมเชียร์อยู่!\"" 
              })}
            >
              <Target className="w-4 h-4 mr-2" />
              ลุยเควสทีม
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              onClick={() => toast({ 
                title: "🎉 Badge ของคุณ!", 
                description: `Badge "${progress.badge}" พร้อมใช้งานแล้ว!` 
              })}
            >
              <Crown className="w-4 h-4 mr-2" />
              ดู Badge ที่ได้
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-indigo-500 text-indigo-300 hover:bg-indigo-800/50"
            onClick={() => toast({ 
              title: "📊 สถิติทีม", 
              description: "ดูรายละเอียดความคืบหน้าของทีม" 
            })}
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
