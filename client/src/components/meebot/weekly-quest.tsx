
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Target,
  Clock,
  Star,
  Gift,
  Sword,
  Shield,
  Gem,
  Zap,
  CheckCircle,
  Lock,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'trading' | 'security' | 'learning' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  maxProgress: number;
  reward: {
    exp: number;
    tokens?: number;
    badge?: string;
    special?: string;
  };
  deadline: string;
  isCompleted: boolean;
  isLocked: boolean;
  emoji: string;
}

export function WeeklyQuest() {
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [questAnimation, setQuestAnimation] = useState<string | null>(null);
  const { toast } = useToast();

  const quests: Quest[] = [
    {
      id: 'swap-master',
      title: 'Swap Master Challenge',
      description: 'ทำ token swap สำเร็จ 5 ครั้งในสัปดาห์นี้',
      category: 'trading',
      difficulty: 'easy',
      progress: 3,
      maxProgress: 5,
      reward: { exp: 100, tokens: 50 },
      deadline: '2024-09-15',
      isCompleted: false,
      isLocked: false,
      emoji: '🔄'
    },
    {
      id: 'security-shield',
      title: 'Security Shield Builder',
      description: 'ตั้งค่า 2FA และ backup phrase ให้ครบถ้วน',
      category: 'security',
      difficulty: 'medium',
      progress: 1,
      maxProgress: 2,
      reward: { exp: 200, badge: 'Security Expert' },
      deadline: '2024-09-15',
      isCompleted: false,
      isLocked: false,
      emoji: '🛡️'
    },
    {
      id: 'academy-graduate',
      title: 'Academy Graduate',
      description: 'จบคอร์ส DeFi Basics และ Smart Contract 101',
      category: 'learning',
      difficulty: 'hard',
      progress: 0,
      maxProgress: 2,
      reward: { exp: 500, special: 'MeeChain Diploma NFT' },
      deadline: '2024-09-15',
      isCompleted: false,
      isLocked: true,
      emoji: '🎓'
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'เชิญเพื่อน 3 คนเข้าร่วม MeeChain และช่วยเหลือใน onboarding',
      category: 'social',
      difficulty: 'medium',
      progress: 1,
      maxProgress: 3,
      reward: { exp: 300, tokens: 100, badge: 'Community Helper' },
      deadline: '2024-09-15',
      isCompleted: false,
      isLocked: false,
      emoji: '🤝'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading': return <Target className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'learning': return <Star className="w-4 h-4" />;
      case 'social': return <Sparkles className="w-4 h-4" />;
      default: return <Sword className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleQuestAccept = (questId: string) => {
    setQuestAnimation(questId);
    toast({
      title: "🎯 ภารกิจรับแล้ว!",
      description: "MeeBot จะติดตามความคืบหน้าให้คุณ",
    });
    
    setTimeout(() => setQuestAnimation(null), 1000);
  };

  const handleClaimReward = (quest: Quest) => {
    toast({
      title: "🏆 ได้รางวัลแล้ว!",
      description: `+${quest.reward.exp} EXP ${quest.reward.tokens ? `+${quest.reward.tokens} tokens` : ''}`,
    });
  };

  const getTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} วันเหลือ`;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-purple-800/50 to-slate-800 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/30 rounded-full animate-pulse">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-lg">🎮 Weekly Quest</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeLeft('2024-09-15')}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  <Gem className="w-3 h-3 mr-1" />
                  Week #37
                </Badge>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quest List */}
        <div className="space-y-3">
          {quests.map((quest) => (
            <div 
              key={quest.id}
              className={`bg-white/5 backdrop-blur-sm rounded-lg p-4 border transition-all duration-300 ${
                quest.isLocked 
                  ? 'border-gray-600/50 opacity-60' 
                  : quest.isCompleted 
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-slate-600/50 hover:border-purple-500/50'
              } ${questAnimation === quest.id ? 'animate-bounce scale-105' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-1">
                  {quest.isLocked ? '🔒' : quest.emoji}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(quest.category)}
                    <span className="text-cyan-300 font-medium text-sm capitalize">
                      {quest.category}
                    </span>
                    <Badge className={`text-xs ${getDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </Badge>
                    {quest.isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {quest.isLocked && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  <h4 className="text-white font-semibold mb-1">{quest.title}</h4>
                  <p className="text-gray-300 text-sm mb-3">{quest.description}</p>
                  
                  {!quest.isLocked && (
                    <div className="space-y-2">
                      {/* Progress Bar */}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">ความคืบหน้า</span>
                        <span className="text-cyan-300 font-semibold">
                          {quest.progress} / {quest.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={(quest.progress / quest.maxProgress) * 100} 
                        className="h-2 bg-gray-700"
                      />
                      
                      {/* Rewards */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 text-xs">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-300">{quest.reward.exp} EXP</span>
                        </div>
                        {quest.reward.tokens && (
                          <div className="flex items-center gap-1 text-xs">
                            <Gem className="w-3 h-3 text-green-400" />
                            <span className="text-green-300">{quest.reward.tokens} Tokens</span>
                          </div>
                        )}
                        {quest.reward.badge && (
                          <div className="flex items-center gap-1 text-xs">
                            <Trophy className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-300">{quest.reward.badge}</span>
                          </div>
                        )}
                        {quest.reward.special && (
                          <div className="flex items-center gap-1 text-xs">
                            <Gift className="w-3 h-3 text-pink-400" />
                            <span className="text-pink-300">{quest.reward.special}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              {!quest.isLocked && (
                <div className="mt-3 flex gap-2">
                  {quest.isCompleted ? (
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(quest)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      รับรางวัล
                    </Button>
                  ) : quest.progress > 0 ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      ดำเนินการต่อ
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleQuestAccept(quest.id)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Sword className="w-4 h-4 mr-2" />
                      รับภารกิจ
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quest Summary */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">ความคืบหน้าสัปดาห์นี้</span>
            <span className="text-cyan-300 font-semibold">
              {quests.filter(q => q.isCompleted).length} / {quests.filter(q => !q.isLocked).length} เสร็จสิ้น
            </span>
          </div>
          <Progress 
            value={(quests.filter(q => q.isCompleted).length / quests.filter(q => !q.isLocked).length) * 100} 
            className="h-2 bg-gray-600 mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
