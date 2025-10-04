
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  Trophy,
  Star,
  Crown,
  Gem,
  Sparkles,
  CheckCircle,
  Lock,
  Bot,
  Gift,
  ArrowRight,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestBadge {
  name: string;
  description: string;
  owned: boolean;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  imageUrl?: string;
}

interface NFTQuest {
  questId: string;
  title: string;
  description: string;
  requiredBadges: QuestBadge[];
  rewardBadge: {
    name: string;
    description: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    imageUrl?: string;
  };
  isCompleted: boolean;
  completions: number;
  timeLimit?: string;
  meeBotQuote: string;
}

export function NFTQuestSystem() {
  const [quests, setQuests] = useState<NFTQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<NFTQuest | null>(null);
  const { toast } = useToast();

  // Mock quest data
  const mockQuests: NFTQuest[] = [
    {
      questId: 'productivity-master',
      title: 'Productivity Master',
      description: 'สะสม badge ครบชุดเพื่อกลายเป็น Productivity Champion!',
      requiredBadges: [
        { name: 'Zen Pilot', description: 'ปลดล็อกจากการทำสมาธิ', owned: true, rarity: 'COMMON' },
        { name: 'Early Riser', description: 'ตื่นเช้าทำภารกิจ', owned: true, rarity: 'COMMON' },
        { name: 'Focus Master', description: 'ทำงานโฟกัสนานกว่า 2 ชั่วโมง', owned: false, rarity: 'RARE' }
      ],
      rewardBadge: {
        name: 'Productivity Champion',
        description: 'NFT สุดพิเศษสำหรับผู้เชี่ยวชาญด้าน Productivity',
        rarity: 'LEGENDARY'
      },
      isCompleted: false,
      completions: 23,
      timeLimit: '7 วัน',
      meeBotQuote: 'คุณมี 2 badge แล้วครับ! เหลืออีก 1 badge เท่านั้น! 💪✨'
    },
    {
      questId: 'web3-pioneer',
      title: 'Web3 Pioneer',
      description: 'เป็นนักสำรวจ Web3 ตัวจริง!',
      requiredBadges: [
        { name: 'First Transaction', description: 'ส่ง transaction แรก', owned: true, rarity: 'COMMON' },
        { name: 'DeFi Explorer', description: 'ใช้ DeFi protocol', owned: false, rarity: 'RARE' },
        { name: 'NFT Collector', description: 'สะสม NFT 5 ชิ้น', owned: false, rarity: 'EPIC' }
      ],
      rewardBadge: {
        name: 'Web3 Pioneer',
        description: 'Badge สำหรับผู้บุกเบิก Web3',
        rarity: 'MYTHIC'
      },
      isCompleted: false,
      completions: 7,
      meeBotQuote: 'Web3 Pioneer เป็น badge ที่หายากมาก ๆ ครับ! ลุยกันเถอะ! 🚀'
    },
    {
      questId: 'community-builder',
      title: 'Community Builder',
      description: 'สร้างชุมชนและช่วยเหลือเพื่อน ๆ',
      requiredBadges: [
        { name: 'Helpful Friend', description: 'ช่วยเพื่อน 5 ครั้ง', owned: true, rarity: 'COMMON' },
        { name: 'Mentor', description: 'สอนมือใหม่', owned: true, rarity: 'RARE' },
        { name: 'Community Leader', description: 'นำชุมชน', owned: true, rarity: 'EPIC' }
      ],
      rewardBadge: {
        name: 'Community Hero',
        description: 'ผู้สร้างชุมชนที่แข็งแกร่ง',
        rarity: 'LEGENDARY'
      },
      isCompleted: true,
      completions: 12,
      meeBotQuote: 'สำเร็จแล้วครับ! คุณเป็น Community Hero ตัวจริง! 🏆'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuests(mockQuests);
      setLoading(false);
    }, 1000);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'from-gray-500 to-gray-400';
      case 'RARE': return 'from-blue-500 to-blue-400';
      case 'EPIC': return 'from-purple-500 to-purple-400';
      case 'LEGENDARY': return 'from-yellow-500 to-yellow-400';
      case 'MYTHIC': return 'from-pink-500 to-red-500';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return <Star className="w-4 h-4" />;
      case 'RARE': return <Gem className="w-4 h-4" />;
      case 'EPIC': return <Crown className="w-4 h-4" />;
      case 'LEGENDARY': return <Trophy className="w-4 h-4" />;
      case 'MYTHIC': return <Sparkles className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const calculateProgress = (badges: QuestBadge[]) => {
    const owned = badges.filter(badge => badge.owned).length;
    return (owned / badges.length) * 100;
  };

  const handleClaimReward = (quest: NFTQuest) => {
    const allBadgesOwned = quest.requiredBadges.every(badge => badge.owned);
    
    if (!allBadgesOwned) {
      toast({
        title: "🤖 MeeBot",
        description: "ยังสะสม badge ไม่ครบครับ! ลุยต่อกันเถอะ! 💪",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🎉 Quest สำเร็จ!",
      description: `${quest.meeBotQuote} รับ ${quest.rewardBadge.name} ไปเลย!`,
    });

    // Update quest completion
    setQuests(prev => prev.map(q => 
      q.questId === quest.questId 
        ? { ...q, isCompleted: true, completions: q.completions + 1 }
        : q
    ));
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-4">
              <Target className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
              <p className="text-slate-300">กำลังโหลด NFT Quests...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">NFT Quest Collection</h2>
                <p className="text-sm text-slate-400">สะสม badge ครบชุดเพื่อปลดล็อก NFT สุดพิเศษ!</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quests.map((quest) => {
          const progress = calculateProgress(quest.requiredBadges);
          const isComplete = quest.isCompleted || progress === 100;
          
          return (
            <Card 
              key={quest.questId}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                isComplete 
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' 
                  : 'bg-slate-800/80 border-slate-600/50'
              }`}
            >
              {/* Completion Overlay */}
              {isComplete && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    สำเร็จแล้ว
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{quest.title}</h3>
                    <p className="text-sm text-slate-400 font-normal">{quest.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quest Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">ความคืบหน้า</span>
                    <span className="text-purple-300 font-semibold">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2 bg-slate-700"
                  />
                </div>

                {/* Required Badges */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Gem className="w-4 h-4" />
                    Badge ที่ต้องสะสม
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {quest.requiredBadges.map((badge, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          badge.owned 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-slate-700/30 border-slate-600/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {badge.owned ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-slate-500" />
                          )}
                          <div>
                            <span className={`font-medium ${badge.owned ? 'text-green-300' : 'text-slate-300'}`}>
                              {badge.name}
                            </span>
                            <p className="text-xs text-slate-400">{badge.description}</p>
                          </div>
                        </div>
                        <Badge 
                          className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white border-0`}
                        >
                          {getRarityIcon(badge.rarity)}
                          <span className="ml-1 text-xs">{badge.rarity}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reward Section */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    รางวัลที่ได้รับ
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getRarityColor(quest.rewardBadge.rarity)} rounded-lg flex items-center justify-center`}>
                        {getRarityIcon(quest.rewardBadge.rarity)}
                      </div>
                      <div>
                        <span className="font-semibold text-white">{quest.rewardBadge.name}</span>
                        <p className="text-xs text-slate-400">{quest.rewardBadge.description}</p>
                      </div>
                    </div>
                    <Badge 
                      className={`bg-gradient-to-r ${getRarityColor(quest.rewardBadge.rarity)} text-white border-0`}
                    >
                      {quest.rewardBadge.rarity}
                    </Badge>
                  </div>
                </div>

                {/* Quest Stats */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {quest.completions} คนทำสำเร็จ
                    </span>
                    {quest.timeLimit && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        เหลือ {quest.timeLimit}
                      </span>
                    )}
                  </div>
                </div>

                {/* MeeBot Quote */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">MeeBot บอก</span>
                  </div>
                  <p className="text-sm text-gray-300">{quest.meeBotQuote}</p>
                </div>

                {/* Action Button */}
                {isComplete ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                    onClick={() => handleClaimReward(quest)}
                    disabled={quest.isCompleted}
                  >
                    {quest.isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        รับรางวัลแล้ว
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        รับรางวัล NFT
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full border-purple-500 text-purple-300 hover:bg-purple-800/50"
                    onClick={() => {
                      toast({
                        title: "🎯 เริ่มภารกิจ!",
                        description: "MeeBot จะพาคุณไปหา badge ที่ยังขาดครับ! 🚀",
                      });
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    เริ่มภารกิจ
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quest Leaderboard */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Quest Leaderboard</h3>
              <p className="text-sm text-slate-400">ผู้ทำ quest สำเร็จเร็วที่สุด</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'CryptoKing', quests: 15, lastQuest: 'Web3 Pioneer' },
              { rank: 2, name: 'NFTCollector', quests: 12, lastQuest: 'Community Builder' },
              { rank: 3, name: 'DeFiMaster', quests: 10, lastQuest: 'Productivity Master' }
            ].map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-black' :
                    user.rank === 2 ? 'bg-gray-400 text-black' :
                    'bg-orange-600 text-white'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <span className="font-semibold text-white">{user.name}</span>
                    <p className="text-xs text-slate-400">Quest ล่าสุด: {user.lastQuest}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {user.quests} quests
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MeeBot Quest Tips */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-cyan-300 mb-1">🎮 MeeBot Quest Tips</h3>
              <p className="text-sm text-gray-300">
                แต่ละ quest จะให้ NFT ที่หายากแตกต่างกัน! MYTHIC NFT หาได้ยากที่สุด แต่ให้ผลตอบแทนสูงสุดในอนาคต! 🏆⚡
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
              onClick={() => {
                toast({
                  title: "🤖 MeeBot",
                  description: "เรื่องราวเพิ่มเติมจะมาเร็ว ๆ นี้ครับ! 📚✨",
                });
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              เรียนรู้เพิ่ม
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
