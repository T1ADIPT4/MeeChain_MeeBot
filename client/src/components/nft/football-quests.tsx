
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Target,
  Star,
  Crown,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FootballQuest {
  id: number;
  title: string;
  description: string;
  type: 'RECRUIT' | 'MATCH' | 'TRAINING' | 'TOURNAMENT';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'LEGENDARY';
  progress: number;
  maxProgress: number;
  rewards: {
    meeTokens: number;
    playerNFT?: string;
    badgeNFT?: string;
    items?: string[];
  };
  requirements?: string[];
  timeLimit?: number; // hours
  isCompleted: boolean;
  isActive: boolean;
}

const mockFootballQuests: FootballQuest[] = [
  {
    id: 1,
    title: "สรรหาผู้เล่นคนแรก",
    description: "เริ่มต้นทีมของคุณด้วยการสรรหาผู้เล่นคนแรก",
    type: "RECRUIT",
    difficulty: "EASY",
    progress: 0,
    maxProgress: 1,
    rewards: {
      meeTokens: 100,
      badgeNFT: "First Recruit Badge",
      items: ["Training Kit", "Team Logo"]
    },
    isCompleted: false,
    isActive: true
  },
  {
    id: 2,
    title: "สรรหาทีมครบ 11 คน",
    description: "สร้างทีมที่สมบูรณ์ด้วยผู้เล่น 11 คน",
    type: "RECRUIT",
    difficulty: "MEDIUM",
    progress: 0,
    maxProgress: 11,
    rewards: {
      meeTokens: 500,
      playerNFT: "Captain NFT",
      badgeNFT: "Team Builder Badge"
    },
    requirements: ["ต้องมีผู้เล่นทุกตำแหน่ง"],
    isCompleted: false,
    isActive: false
  },
  {
    id: 3,
    title: "แชมป์ลีก",
    description: "ชนะการแข่งขันลีกเพื่อรับรางวัลใหญ่",
    type: "TOURNAMENT",
    difficulty: "LEGENDARY",
    progress: 0,
    maxProgress: 10,
    rewards: {
      meeTokens: 2000,
      playerNFT: "Legendary Star Player",
      badgeNFT: "Champion Badge",
      items: ["Golden Trophy", "Championship Ring"]
    },
    requirements: ["ทีมเรตติ้งรวม 850+", "ชนะ 10 นัดติดต่อกัน"],
    timeLimit: 168, // 7 days
    isCompleted: false,
    isActive: false
  },
  {
    id: 4,
    title: "เทรนนิ่งหนัก",
    description: "ฝึกซ้อมทีมให้แข็งแกร่งขึ้น",
    type: "TRAINING",
    difficulty: "MEDIUM",
    progress: 2,
    maxProgress: 5,
    rewards: {
      meeTokens: 300,
      items: ["Skill Boost", "Fitness Kit"]
    },
    timeLimit: 24,
    isCompleted: false,
    isActive: true
  },
  {
    id: 5,
    title: "นักเตะดาว",
    description: "สรรหาผู้เล่น MYTHIC rarity",
    type: "RECRUIT",
    difficulty: "HARD",
    progress: 0,
    maxProgress: 1,
    rewards: {
      meeTokens: 1000,
      badgeNFT: "Star Hunter Badge",
      items: ["VIP Scout Pass"]
    },
    requirements: ["ต้องมี MEE 500+ tokens", "ทำเควสต์ Champion's League Winner"],
    isCompleted: false,
    isActive: false
  }
];

export function FootballQuests() {
  const [quests, setQuests] = useState<FootballQuest[]>(mockFootballQuests);
  const [selectedQuest, setSelectedQuest] = useState<FootballQuest | null>(null);
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'LEGENDARY': return 'from-pink-500 to-red-500';
      case 'HARD': return 'from-red-500 to-orange-500';
      case 'MEDIUM': return 'from-yellow-500 to-orange-500';
      case 'EASY': return 'from-green-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RECRUIT': return <Users className="w-4 h-4" />;
      case 'MATCH': return <Target className="w-4 h-4" />;
      case 'TRAINING': return <Zap className="w-4 h-4" />;
      case 'TOURNAMENT': return <Trophy className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RECRUIT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'MATCH': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'TRAINING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'TOURNAMENT': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleStartQuest = async (quest: FootballQuest) => {
    if (!quest.isActive) {
      toast({
        title: "🔒 เควสต์ถูกล็อก",
        description: "ทำเควสต์อื่นก่อนเพื่อปลดล็อกเควสต์นี้",
        variant: "destructive"
      });
      return;
    }

    try {
      // Mock quest start
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "🎯 เริ่มเควสต์แล้ว!",
        description: `${quest.title} - ${quest.description}`,
      });

      // MeeBot encouragement
      setTimeout(() => {
        toast({
          title: "🤖 MeeBot",
          description: "ไปเลย! คุณทำได้แน่นอน! ผมเชื่อมั่นในทีมของคุณ! ⚽",
        });
      }, 1500);

    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถเริ่มเควสต์ได้",
        variant: "destructive"
      });
    }
  };

  const handleCompleteQuest = async (quest: FootballQuest) => {
    if (quest.progress < quest.maxProgress) {
      toast({
        title: "⏳ ยังไม่เสร็จ",
        description: "ทำเควสต์ให้เสร็จก่อนถึงจะเคลมรางวัลได้",
        variant: "destructive"
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setQuests(prev => prev.map(q => 
        q.id === quest.id ? { ...q, isCompleted: true } : q
      ));

      toast({
        title: "🎉 เควสต์สำเร็จ!",
        description: `ได้รับ ${quest.rewards.meeTokens} MEE และรางวัลอื่นๆ!`,
      });

      // MeeBot celebration
      setTimeout(() => {
        toast({
          title: "🤖 MeeBot",
          description: "ยอดเยี่ยม! คุณเป็นผู้จัดการทีมที่เก่งจริงๆ! 🏆",
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถเคลมรางวัลได้",
        variant: "destructive"
      });
    }
  };

  const activeQuests = quests.filter(q => q.isActive && !q.isCompleted);
  const completedQuests = quests.filter(q => q.isCompleted);
  const lockedQuests = quests.filter(q => !q.isActive && !q.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-300/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">⚽ Football Quests</h2>
              <p className="text-sm text-slate-400">ภารกิจสำหรับผู้จัดการทีม</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Quests */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            เควสต์ที่ใช้งานได้ ({activeQuests.length})
          </h3>
          {activeQuests.map((quest) => (
            <Card key={quest.id} className="bg-slate-800/80 border-slate-600/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{quest.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{quest.description}</p>
                  </div>
                  <Badge className={`${getTypeColor(quest.type)} border text-xs`}>
                    {getTypeIcon(quest.type)}
                    <span className="ml-1">{quest.type}</span>
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">ความคืบหน้า</span>
                      <span className="text-white">{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(quest.progress / quest.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className={`p-3 bg-gradient-to-r ${getDifficultyColor(quest.difficulty)}/20 rounded border border-${quest.difficulty.toLowerCase()}-500/30`}>
                    <div className="text-xs text-yellow-300 mb-1">🎁 รางวัล:</div>
                    <div className="text-sm text-white">
                      💰 {quest.rewards.meeTokens} MEE
                      {quest.rewards.playerNFT && <div>🏆 {quest.rewards.playerNFT}</div>}
                      {quest.rewards.badgeNFT && <div>🏅 {quest.rewards.badgeNFT}</div>}
                    </div>
                  </div>

                  {quest.requirements && (
                    <div className="text-xs text-slate-400">
                      📋 ความต้องการ: {quest.requirements.join(", ")}
                    </div>
                  )}

                  {quest.timeLimit && (
                    <div className="text-xs text-orange-400">
                      ⏰ เหลือเวลา: {quest.timeLimit} ชั่วโมง
                    </div>
                  )}

                  {quest.progress >= quest.maxProgress ? (
                    <Button
                      onClick={() => handleCompleteQuest(quest)}
                      className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      เคลมรางวัล
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStartQuest(quest)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      เริ่มเควสต์
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completed Quests */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            เสร็จแล้ว ({completedQuests.length})
          </h3>
          {completedQuests.map((quest) => (
            <Card key={quest.id} className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-green-300">{quest.title}</h4>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-sm text-slate-400">{quest.description}</p>
                <div className="text-xs text-green-400 mt-2">
                  ✅ สำเร็จแล้ว - ได้รับ {quest.rewards.meeTokens} MEE
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Locked Quests */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            ล็อกอยู่ ({lockedQuests.length})
          </h3>
          {lockedQuests.map((quest) => (
            <Card key={quest.id} className="bg-slate-700/50 border-slate-600/30 opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-300">{quest.title}</h4>
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-sm text-slate-400">{quest.description}</p>
                <div className={`mt-3 p-2 bg-gradient-to-r ${getDifficultyColor(quest.difficulty)}/10 rounded border border-${quest.difficulty.toLowerCase()}-500/20`}>
                  <div className="text-xs text-slate-400">🎁 รางวัลรอคุณอยู่:</div>
                  <div className="text-sm text-slate-300">
                    💰 {quest.rewards.meeTokens} MEE
                    {quest.rewards.playerNFT && <div>🏆 {quest.rewards.playerNFT}</div>}
                  </div>
                </div>
                {quest.requirements && (
                  <div className="text-xs text-slate-500 mt-2">
                    🔒 ต้อง: {quest.requirements.join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
