
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
  Users,
  Zap,
  ArrowRight,
  Clock,
  TrendingUp,
  Shield,
  Sword,
  Eye,
  ArrowUpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BadgeRequirement {
  name: string;
  description: string;
  owned: boolean;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  power?: string;
  powerBoost?: number;
  imageUrl?: string;
}

interface QuestReward {
  badge: {
    name: string;
    description: string;
    power: string;
    powerBoost: number;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    level: number;
    maxLevel: number;
    isUpgradeable: boolean;
  };
  xp: number;
  tokens: number;
  specialReward?: string;
}

interface CollectionQuest {
  questId: string;
  title: string;
  description: string;
  category: 'PRODUCTIVITY' | 'EXPLORER' | 'SOCIALIZER' | 'ACHIEVER' | 'SPECIAL';
  requiredBadges: BadgeRequirement[];
  reward: QuestReward;
  isCompleted: boolean;
  completions: number;
  timeLimit?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'LEGENDARY' | 'MYTHIC';
  meeBotQuotes: {
    inProgress: string;
    completed: string;
    recommendation: string;
  };
  prerequisites?: string[];
  unlocks?: string[];
}

export function CollectionQuestSystem() {
  const [quests, setQuests] = useState<CollectionQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<CollectionQuest | null>(null);
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2750,
    nextLevelXP: 3000,
    completedQuests: 5,
    totalBadges: 8
  });
  const { toast } = useToast();

  // Mock collection quest data with RPG elements
  const mockQuests: CollectionQuest[] = [
    {
      questId: 'productivity-master-set',
      title: 'สะสมชุด Productivity Master',
      description: 'รวบรวม badge ครบชุดเพื่อกลายเป็น Productivity Champion ตัวจริง!',
      category: 'PRODUCTIVITY',
      difficulty: 'MEDIUM',
      requiredBadges: [
        { 
          name: 'Zen Pilot', 
          description: 'ปลดล็อกจากการทำสมาธิ', 
          owned: true, 
          rarity: 'COMMON',
          power: 'Focus Boost',
          powerBoost: 15
        },
        { 
          name: 'Early Riser', 
          description: 'ตื่นเช้าทำภารกิจ 7 วันติด', 
          owned: true, 
          rarity: 'RARE',
          power: 'Energy Boost',
          powerBoost: 20
        },
        { 
          name: 'Focus Master', 
          description: 'ทำงานโฟกัสนานกว่า 4 ชั่วโมง', 
          owned: false, 
          rarity: 'EPIC',
          power: 'Deep Focus',
          powerBoost: 30
        },
        { 
          name: 'Time Warrior', 
          description: 'จัดการเวลาอย่างมืออาชีพ', 
          owned: false, 
          rarity: 'RARE',
          power: 'Time Control',
          powerBoost: 25
        }
      ],
      reward: {
        badge: {
          name: 'Productivity Champion',
          description: 'ผู้พิชิตด้าน Productivity แบบ Ultimate!',
          power: 'Ultimate Productivity',
          powerBoost: 50,
          rarity: 'LEGENDARY',
          level: 1,
          maxLevel: 10,
          isUpgradeable: true
        },
        xp: 1000,
        tokens: 500,
        specialReward: 'ปลดล็อกโหมด "Zen Mode" ในแดชบอร์ด'
      },
      isCompleted: false,
      completions: 47,
      timeLimit: '14 วัน',
      meeBotQuotes: {
        inProgress: 'คุณมี 2/4 badge แล้วครับ! เหลืออีก 2 badge เท่านั้น! Focus Master จะได้จากการทำงานโฟกัสนาน ๆ 💪',
        completed: 'สุดยอดเลยครับ! คุณคือ Productivity Champion ตัวจริง! พลัง Ultimate Productivity +50% นี่โกงเลย! 🏆⚡',
        recommendation: 'แนะนำให้ทำ Focus Quest ก่อนครับ เพราะ Focus Master เป็น badge ที่หาได้ยาก! 🎯'
      },
      prerequisites: [],
      unlocks: ['advanced-productivity-quests']
    },
    {
      questId: 'web3-pioneer-collection',
      title: 'สะสมชุด Web3 Pioneer',
      description: 'เป็นนักบุกเบิก Web3 ตัวจริงด้วยการสะสม badge ครบชุด!',
      category: 'EXPLORER',
      difficulty: 'HARD',
      requiredBadges: [
        { 
          name: 'First Transaction', 
          description: 'ส่ง transaction แรกบนบล็อกเชน', 
          owned: true, 
          rarity: 'COMMON',
          power: 'Blockchain Sync',
          powerBoost: 10
        },
        { 
          name: 'DeFi Explorer', 
          description: 'ใช้ DeFi protocol สำเร็จ', 
          owned: false, 
          rarity: 'EPIC',
          power: 'DeFi Mastery',
          powerBoost: 35
        },
        { 
          name: 'NFT Collector', 
          description: 'สะสม NFT ครบ 10 ชิ้น', 
          owned: false, 
          rarity: 'RARE',
          power: 'NFT Vision',
          powerBoost: 25
        },
        { 
          name: 'Smart Contract Developer', 
          description: 'Deploy smart contract สำเร็จ', 
          owned: false, 
          rarity: 'LEGENDARY',
          power: 'Code Mastery',
          powerBoost: 40
        },
        { 
          name: 'DAO Participant', 
          description: 'เข้าร่วม DAO และ vote', 
          owned: false, 
          rarity: 'EPIC',
          power: 'Governance Power',
          powerBoost: 30
        }
      ],
      reward: {
        badge: {
          name: 'Web3 Pioneer',
          description: 'ผู้บุกเบิก Web3 ระดับตำนาน!',
          power: 'Web3 Supreme',
          powerBoost: 75,
          rarity: 'MYTHIC',
          level: 1,
          maxLevel: 15,
          isUpgradeable: true
        },
        xp: 2500,
        tokens: 1000,
        specialReward: 'ปลดล็อก "Web3 Dashboard" พิเศษ + Early access Beta features'
      },
      isCompleted: false,
      completions: 12,
      timeLimit: '30 วัน',
      meeBotQuotes: {
        inProgress: 'Web3 Pioneer เป็น badge MYTHIC ที่หายากที่สุดครับ! มีแค่ 12 คนที่ได้เท่านั้น! คุณจะเป็นคนที่ 13 ไหม? 🚀',
        completed: 'OMG! คุณเป็น Web3 Pioneer แล้วครับ! นี่คือ badge MYTHIC แรก! พลัง Web3 Supreme +75% นี่คือระดับเทพเลย! 🌟👑',
        recommendation: 'เริ่มจาก DeFi Explorer ก่อนครับ เพราะจะปลดล็อกเส้นทางไปยัง badge อื่น ๆ ได้! 🌊'
      },
      prerequisites: ['wallet-setup', 'basic-transactions'],
      unlocks: ['mythic-challenges', 'web3-academy-access']
    },
    {
      questId: 'community-builder-set',
      title: 'สะสมชุด Community Builder',
      description: 'สร้างชุมชนที่แข็งแกร่งและช่วยเหลือเพื่อน ๆ',
      category: 'SOCIALIZER',
      difficulty: 'EASY',
      requiredBadges: [
        { 
          name: 'Helpful Friend', 
          description: 'ช่วยเหลือเพื่อน 10 ครั้ง', 
          owned: true, 
          rarity: 'COMMON',
          power: 'Friendship Boost',
          powerBoost: 15
        },
        { 
          name: 'Mentor', 
          description: 'สอนมือใหม่ 5 คน', 
          owned: true, 
          rarity: 'RARE',
          power: 'Wisdom Share',
          powerBoost: 20
        },
        { 
          name: 'Community Leader', 
          description: 'นำทีมทำโปรเจค', 
          owned: true, 
          rarity: 'EPIC',
          power: 'Leadership Aura',
          powerBoost: 35
        }
      ],
      reward: {
        badge: {
          name: 'Community Hero',
          description: 'ผู้สร้างชุมชนที่แข็งแกร่ง ฮีโร่ตัวจริง!',
          power: 'Community Champion',
          powerBoost: 45,
          rarity: 'LEGENDARY',
          level: 1,
          maxLevel: 8,
          isUpgradeable: true
        },
        xp: 800,
        tokens: 300,
        specialReward: 'ปลดล็อก "Community Dashboard" + สิทธิพิเศษ Moderator'
      },
      isCompleted: true,
      completions: 89,
      meeBotQuotes: {
        inProgress: '',
        completed: 'สำเร็จแล้วครับ! คุณเป็น Community Hero ตัวจริง! ชุมชนมีคุณถึงจะเข้มแข็ง! 🏆❤️',
        recommendation: ''
      },
      prerequisites: [],
      unlocks: ['advanced-community-features']
    },
    {
      questId: 'ultimate-achiever-collection',
      title: 'สะสมชุด Ultimate Achiever',
      description: 'รวบรวม badge ที่ยากที่สุดเพื่อพิสูจน์ว่าคุณคือ Achiever สุดยอด!',
      category: 'ACHIEVER',
      difficulty: 'MYTHIC',
      requiredBadges: [
        { 
          name: '100 Day Streak', 
          description: 'ทำภารกิจติดต่อกัน 100 วัน', 
          owned: false, 
          rarity: 'LEGENDARY',
          power: 'Unstoppable Force',
          powerBoost: 50
        },
        { 
          name: 'Perfect Score', 
          description: 'ได้คะแนนเต็ม 10 เควสติดต่อกัน', 
          owned: false, 
          rarity: 'EPIC',
          power: 'Perfection Aura',
          powerBoost: 40
        },
        { 
          name: 'Speed Demon', 
          description: 'ทำเควสเสร็จเร็วที่สุด 5 ครั้ง', 
          owned: false, 
          rarity: 'RARE',
          power: 'Lightning Speed',
          powerBoost: 30
        },
        { 
          name: 'Challenge Master', 
          description: 'ผ่านความท้าทายระดับสูงทุกอัน', 
          owned: false, 
          rarity: 'LEGENDARY',
          power: 'Challenge Crusher',
          powerBoost: 45
        },
        { 
          name: 'Legendary Mentor', 
          description: 'เป็นพี่เลี้ยงให้กับ 50 คน', 
          owned: false, 
          rarity: 'MYTHIC',
          power: 'Ultimate Wisdom',
          powerBoost: 60
        }
      ],
      reward: {
        badge: {
          name: 'Ultimate Achiever',
          description: 'ระดับเทพสูงสุดของ MeeChain! ไม่มีใครเกินได้!',
          power: 'God Mode',
          powerBoost: 100,
          rarity: 'MYTHIC',
          level: 1,
          maxLevel: 20,
          isUpgradeable: true
        },
        xp: 5000,
        tokens: 2500,
        specialReward: 'Hall of Fame + Custom MeeBot + All Premium Features Forever!'
      },
      isCompleted: false,
      completions: 0,
      timeLimit: 'No Limit',
      meeBotQuotes: {
        inProgress: 'นี่คือความท้าทายที่ยากที่สุดครับ! ยังไม่เคยมีใครทำสำเร็จเลย! คุณจะเป็นคนแรกไหม? 🔥👑',
        completed: 'OMG!!! คุณเป็นคนแรกของโลกที่ได้ Ultimate Achiever! นี่คือประวัติศาสตร์! พลัง God Mode +100% นี่คือระดับเทพเลยครับ! 🌟🚀👑',
        recommendation: 'เริ่มจาก 100 Day Streak ก่อนครับ นี่คือพื้นฐานสำคัญ! แต่เตรียมใจให้พร้อม... มันยากมาก ๆ! 💪'
      },
      prerequisites: ['productivity-master-set', 'web3-pioneer-collection', 'community-builder-set'],
      unlocks: ['ultimate-features', 'beta-tester-access', 'legendary-status']
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuests(mockQuests);
      setLoading(false);
    }, 1200);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'HARD': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'LEGENDARY': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'MYTHIC': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const calculateProgress = (badges: BadgeRequirement[]) => {
    const owned = badges.filter(badge => badge.owned).length;
    return (owned / badges.length) * 100;
  };

  const calculateTotalPowerBoost = (badges: BadgeRequirement[]) => {
    return badges
      .filter(badge => badge.owned)
      .reduce((total, badge) => total + (badge.powerBoost || 0), 0);
  };

  const handleClaimReward = (quest: CollectionQuest) => {
    const progress = calculateProgress(quest.requiredBadges);
    
    if (progress < 100) {
      const missingCount = quest.requiredBadges.filter(b => !b.owned).length;
      toast({
        title: "🤖 MeeBot",
        description: `${quest.meeBotQuotes.inProgress || `ยังสะสม badge ไม่ครบครับ! เหลืออีก ${missingCount} badge`} 💪`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🎉 Collection Quest สำเร็จ!",
      description: quest.meeBotQuotes.completed,
    });

    // Update quest completion
    setQuests(prev => prev.map(q => 
      q.questId === quest.questId 
        ? { ...q, isCompleted: true, completions: q.completions + 1 }
        : q
    ));

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + quest.reward.xp,
      completedQuests: prev.completedQuests + 1,
      totalBadges: prev.totalBadges + 1
    }));
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-4">
              <Target className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
              <p className="text-slate-300">กำลังโหลด Collection Quests...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Stats Header - Compact */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-300/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Level {userStats.level} Collection Master</h3>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span>🏆 {userStats.completedQuests}</span>
                <span>💎 {userStats.totalBadges}</span>
                <span>⚡ {userStats.xp} XP</span>
                <div className="flex-1 max-w-24">
                  <Progress value={(userStats.xp / userStats.nextLevelXP) * 100} className="h-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Quests */}
      <div className="space-y-6">
        {quests.map((quest) => {
          const progress = calculateProgress(quest.requiredBadges);
          const currentPowerBoost = calculateTotalPowerBoost(quest.requiredBadges);
          const isComplete = quest.isCompleted || progress === 100;
          
          return (
            <Card 
              key={quest.questId}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                isComplete 
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' 
                  : 'bg-slate-800/80 border-slate-600/50'
              }`}
            >
              {/* Completion Badge */}
              {isComplete && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    สำเร็จแล้ว
                  </Badge>
                </div>
              )}

              {/* Difficulty Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className={getDifficultyColor(quest.difficulty)}>
                  {quest.difficulty}
                </Badge>
              </div>

              <CardHeader className="pb-2 pt-8">
                <CardTitle className="text-white">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{quest.title}</h3>
                    <p className="text-xs text-slate-400 font-normal">{quest.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Progress Overview - Compact */}
                <div className="flex gap-2 text-xs">
                  <div className="bg-slate-700/30 rounded px-2 py-1 text-center flex-1">
                    <div className="font-bold text-white">{progress.toFixed(0)}%</div>
                    <div className="text-slate-400">Progress</div>
                  </div>
                  <div className="bg-slate-700/30 rounded px-2 py-1 text-center flex-1">
                    <div className="font-bold text-cyan-300">+{currentPowerBoost}%</div>
                    <div className="text-slate-400">Power</div>
                  </div>
                  <div className="bg-slate-700/30 rounded px-2 py-1 text-center flex-1">
                    <div className="font-bold text-purple-300">{quest.completions}</div>
                    <div className="text-slate-400">Done</div>
                  </div>
                </div>

                {/* Progress Bar - Compact */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">ความคืบหน้า</span>
                    <span className="text-purple-300 font-semibold">
                      {quest.requiredBadges.filter(b => b.owned).length} / {quest.requiredBadges.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 bg-slate-700" />
                </div>

                {/* Required Badges - Compact Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Gem className="w-3 h-3" />
                    Required Badges ({quest.requiredBadges.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quest.requiredBadges.map((badge, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded-md border text-xs ${
                          badge.owned 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-slate-700/30 border-slate-600/30'
                        }`}
                      >
                        {badge.owned ? (
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate ${badge.owned ? 'text-green-300' : 'text-slate-300'}`}>
                            {badge.name}
                          </div>
                          {badge.power && (
                            <Badge className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white border-0 text-xs mt-1`}>
                              +{badge.powerBoost}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ultimate Reward Section - Compact */}
                <div className={`bg-gradient-to-r ${getRarityColor(quest.reward.badge.rarity)} bg-opacity-10 border border-opacity-30 rounded-lg p-3`}>
                  <h4 className="text-xs font-semibold text-yellow-300 mb-2 flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    Ultimate Reward
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getRarityColor(quest.reward.badge.rarity)} rounded-lg flex items-center justify-center relative`}>
                      <Crown className="w-5 h-5 text-white" />
                      {quest.reward.badge.isUpgradeable && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <ArrowUpCircle className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-white text-sm truncate">{quest.reward.badge.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`bg-gradient-to-r ${getRarityColor(quest.reward.badge.rarity)} text-white border-0 text-xs`}>
                          {quest.reward.badge.rarity}
                        </Badge>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                          +{quest.reward.badge.powerBoost}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Rewards - Compact */}
                  <div className="flex items-center gap-3 text-xs mt-2">
                    <span className="flex items-center gap-1 text-blue-300">
                      <TrendingUp className="w-3 h-3" />
                      +{quest.reward.xp} XP
                    </span>
                    <span className="flex items-center gap-1 text-green-300">
                      <Gem className="w-3 h-3" />
                      +{quest.reward.tokens} MEE
                    </span>
                  </div>
                  {quest.reward.specialReward && (
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded p-1 mt-2">
                      <p className="text-xs text-pink-300">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {quest.reward.specialReward}
                      </p>
                    </div>
                  )}
                </div>

                {/* Prerequisites & Unlocks */}
                {(quest.prerequisites?.length || quest.unlocks?.length) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {quest.prerequisites?.length && (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                        <h5 className="text-orange-300 font-semibold mb-2 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          เงื่อนไขที่ต้องทำก่อน:
                        </h5>
                        <ul className="text-orange-200 space-y-1">
                          {quest.prerequisites.map((prereq, i) => (
                            <li key={i}>• {prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {quest.unlocks?.length && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                        <h5 className="text-purple-300 font-semibold mb-2 flex items-center gap-1">
                          <Sword className="w-3 h-3" />
                          จะปลดล็อก:
                        </h5>
                        <ul className="text-purple-200 space-y-1">
                          {quest.unlocks.map((unlock, i) => (
                            <li key={i}>• {unlock}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Quest Info */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-600/30 pt-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {quest.completions} คนทำสำเร็จ
                    </span>
                    {quest.timeLimit && quest.timeLimit !== 'No Limit' && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        เหลือ {quest.timeLimit}
                      </span>
                    )}
                    <span className="text-slate-500">#{quest.questId}</span>
                  </div>
                </div>

                {/* MeeBot Quote */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">MeeBot Collection Guide</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {isComplete 
                      ? quest.meeBotQuotes.completed
                      : quest.meeBotQuotes.inProgress || quest.meeBotQuotes.recommendation
                    }
                  </p>
                </div>

                {/* Action Button */}
                {isComplete ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-lg py-6"
                    onClick={() => handleClaimReward(quest)}
                    disabled={quest.isCompleted}
                  >
                    {quest.isCompleted ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        รับรางวัลแล้ว
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        รับรางวัล Ultimate Badge!
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full border-purple-500 text-purple-300 hover:bg-purple-800/50 text-lg py-6"
                    onClick={() => {
                      toast({
                        title: "🎯 เริ่มการสะสม!",
                        description: quest.meeBotQuotes.recommendation || "MeeBot จะช่วยแนะนำเส้นทางการสะสม badge ครับ! 🚀",
                      });
                    }}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    เริ่มสะสม Badge ชุดนี้
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hall of Fame */}
      <Card className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-300/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Collection Hall of Fame</h3>
              <p className="text-sm text-slate-400">ผู้สะสม Collection สำเร็จเร็วที่สุด</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'CryptoKing', collections: 8, latest: 'Ultimate Achiever', rarity: 'MYTHIC', time: '47 วัน' },
              { rank: 2, name: 'BadgeHunter', collections: 6, latest: 'Web3 Pioneer', rarity: 'MYTHIC', time: '23 วัน' },
              { rank: 3, name: 'QuestMaster', collections: 5, latest: 'Productivity Champion', rarity: 'LEGENDARY', time: '12 วัน' }
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{user.name}</span>
                      <Badge className={`bg-gradient-to-r ${getRarityColor(user.rarity)} text-white border-0 text-xs`}>
                        {user.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">ล่าสุด: {user.latest} ({user.time})</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {user.collections} collections
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
