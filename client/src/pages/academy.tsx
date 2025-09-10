
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Trophy, 
  Star,
  BookOpen,
  Target,
  Zap,
  Shield,
  Coins,
  ArrowRight,
  CheckCircle,
  Clock,
  Gift,
  Sparkles,
  ArrowLeft,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { AcademyWelcome } from '@/components/academy/academy-welcome';
import { WalletSetup } from '@/components/academy/wallet-setup';
import { TokenBasics } from '@/components/academy/token-basics';
import { SwapBridge } from '@/components/academy/swap-bridge';

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  badge?: string;
  reward: {
    exp: number;
    tokens?: number;
  };
  requirements?: string[];
}

interface AcademyLevel {
  level: number;
  title: string;
  description: string;
  requiredExp: number;
  unlocks: string[];
}

export default function Academy() {
  const { toast } = useToast();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentAcademyStep, setCurrentAcademyStep] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentExp, setCurrentExp] = useState(0);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showMeeBotTip, setShowMeeBotTip] = useState(true);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const academyLevels: AcademyLevel[] = [
    {
      level: 1,
      title: "🎯 MeeChain Rookie",
      description: "เรียนรู้พื้นฐาน Web3",
      requiredExp: 0,
      unlocks: ["wallet-setup", "token-basics"]
    },
    {
      level: 2,
      title: "⚡ Crypto Explorer",
      description: "เริ่มใช้งาน DeFi",
      requiredExp: 300,
      unlocks: ["swap-bridge", "security-setup"]
    },
    {
      level: 3,
      title: "🚀 MeeChain Master",
      description: "ผู้เชี่ยวชาญระบบ",
      requiredExp: 600,
      unlocks: ["advanced-features", "meebot-advanced"]
    }
  ];

  const quests: Quest[] = [
    {
      id: "wallet-setup",
      title: "🎯 เชื่อมต่อ Wallet",
      description: "เรียนรู้การเชื่อมต่อ Wallet และตั้งค่าเครือข่าย",
      icon: <Target className="w-6 h-6 text-blue-400" />,
      difficulty: "beginner",
      estimatedTime: "5 นาที",
      status: "available",
      badge: "Wallet Pioneer",
      reward: { exp: 100, tokens: 50 },
      requirements: []
    },
    {
      id: "token-basics",
      title: "🪙 พื้นฐานโทเค็น",
      description: "เรียนรู้การซื้อ รับ และส่งโทเค็น",
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
      difficulty: "beginner",
      estimatedTime: "7 นาที",
      status: "available",
      badge: "Token Handler",
      reward: { exp: 120, tokens: 75 },
      requirements: []
    },
    {
      id: "swap-bridge",
      title: "🔄 Swap & Bridge",
      description: "ทดลอง Swap และ Bridge โทเค็นข้ามเครือข่าย",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      difficulty: "intermediate",
      estimatedTime: "10 นาที",
      status: "locked",
      badge: "Swap Ninja",
      reward: { exp: 200, tokens: 100 },
      requirements: ["wallet-setup", "token-basics"]
    },
    {
      id: "security-setup",
      title: "🛡️ ความปลอดภัย",
      description: "ตั้งค่า Secrets และระบบแจ้งเตือน",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      difficulty: "intermediate",
      estimatedTime: "8 นาที",
      status: "locked",
      badge: "Security Guardian",
      reward: { exp: 180, tokens: 80 },
      requirements: ["wallet-setup"]
    },
    {
      id: "advanced-features",
      title: "⚡ ฟีเจอร์ขั้นสูง",
      description: "เรียนรู้การใช้งาน MeeBot และฟีเจอร์ขั้นสูง",
      icon: <Star className="w-6 h-6 text-pink-400" />,
      difficulty: "advanced",
      estimatedTime: "15 นาที",
      status: "locked",
      badge: "MeeChain Expert",
      reward: { exp: 300, tokens: 150 },
      requirements: ["swap-bridge", "security-setup"]
    }
  ];

  const [questsState, setQuestsState] = useState(quests);

  useEffect(() => {
    // Update quest availability based on completed quests
    setQuestsState(prevQuests => 
      prevQuests.map(quest => {
        if (quest.requirements?.every(req => completedQuests.includes(req))) {
          return quest.status === 'locked' ? { ...quest, status: 'available' } : quest;
        }
        return quest;
      })
    );
  }, [completedQuests]);

  const currentLevelInfo = academyLevels.find(level => 
    currentExp >= level.requiredExp && 
    (academyLevels.find(l => l.level === level.level + 1)?.requiredExp || Infinity) > currentExp
  ) || academyLevels[0];

  const nextLevel = academyLevels.find(level => level.level === currentLevelInfo.level + 1);
  const progressToNext = nextLevel ? 
    ((currentExp - currentLevelInfo.requiredExp) / (nextLevel.requiredExp - currentLevelInfo.requiredExp)) * 100 : 100;

  const startQuest = (quest: Quest) => {
    if (quest.status !== 'available') return;
    
    setSelectedQuest(quest);
    setQuestsState(prev => prev.map(q => 
      q.id === quest.id ? { ...q, status: 'in_progress' } : q
    ));

    toast({
      title: "🎯 เริ่มเควสแล้ว!",
      description: `MeeBot พร้อมแนะนำคุณใน "${quest.title}"`,
    });
  };

  const handleStartJourney = () => {
    setShowWelcome(false);
    setIsFirstTime(false);
    setCurrentAcademyStep(2);
    
    toast({
      title: "🎓 ยินดีต้อนรับสู่ Academy!",
      description: "MeeBot พร้อมแนะนำคุณทุกขั้นตอนแล้ว!",
    });
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    setIsFirstTime(false);
  };

  const completeQuest = (questId: string) => {
    const quest = questsState.find(q => q.id === questId);
    if (!quest) return;

    setCompletedQuests(prev => [...prev, questId]);
    setCurrentExp(prev => prev + quest.reward.exp);
    
    setQuestsState(prev => prev.map(q => 
      q.id === questId ? { ...q, status: 'completed' } : q
    ));

    toast({
      title: "🎉 เควสสำเร็จ!",
      description: `ได้รับ ${quest.reward.exp} EXP และ Badge "${quest.badge}"!`,
    });

    setSelectedQuest(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'available': return <Play className="w-5 h-5 text-blue-400" />;
      default: return <Pause className="w-5 h-5 text-gray-400" />;
    }
  };

  // Show welcome screen for first-time users
  if (showWelcome && isFirstTime) {
    return (
      <AcademyWelcome 
        onStartJourney={handleStartJourney}
        onSkip={handleSkipWelcome}
      />
    );
  }

  // Show Wallet Setup step
  if (currentAcademyStep === 2) {
    return (
      <WalletSetup 
        onNext={() => setCurrentAcademyStep(3)}
        onPrev={() => setCurrentAcademyStep(1)}
      />
    );
  }

  // Show Token Basics step
  if (currentAcademyStep === 3) {
    return (
      <TokenBasics 
        onNext={() => setCurrentAcademyStep(4)}
        onPrev={() => setCurrentAcademyStep(2)}
      />
    );
  }

  // Show Swap & Bridge step
  if (currentAcademyStep === 4) {
    return (
      <SwapBridge 
        onNext={() => setCurrentAcademyStep(5)}
        onPrev={() => setCurrentAcademyStep(3)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🎓 MeeChain Academy
              </h1>
              <p className="text-gray-300 text-lg">
                เรียนรู้ Web3 แบบเกมกับ MeeBot Mentor
              </p>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div>
                  <CardTitle className="text-white">{currentLevelInfo.title}</CardTitle>
                  <p className="text-cyan-200 text-sm">{currentLevelInfo.description}</p>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                Level {currentLevelInfo.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {currentExp} EXP
                </span>
                {nextLevel && (
                  <span className="text-gray-300">
                    ถัดไป: {nextLevel.requiredExp} EXP
                  </span>
                )}
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* MeeBot Tip */}
        {showMeeBotTip && (
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-cyan-300 mb-2">💡 MeeBot Tip</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "สวัสดีนักสำรวจ! ผมคือ MeeBot ครูของคุณ 🤖✨ เริ่มจากเควสง่าย ๆ ก่อนนะ แล้วค่อย ๆ เก็บเลเวลไปเรื่อย ๆ! 
                    อย่าลืมว่าทุกเควสจะได้ Badge สุดเท่ห์เป็นรางวัล! 🏆"
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMeeBotTip(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quests List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" />
              รายการเควส
            </h2>
            
            <div className="space-y-4">
              {questsState.map((quest) => (
                <Card 
                  key={quest.id}
                  className={`transition-all duration-300 hover:scale-[1.02] ${
                    quest.status === 'available' 
                      ? 'bg-black/50 border-cyan-500/30 hover:border-cyan-400/50 cursor-pointer' 
                      : quest.status === 'completed'
                        ? 'bg-green-500/10 border-green-500/30'
                        : quest.status === 'in_progress'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-gray-500/10 border-gray-500/30 opacity-60'
                  }`}
                  onClick={() => quest.status === 'available' && startQuest(quest)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                        {quest.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white">{quest.title}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(quest.status)}
                            <Badge className={getDifficultyColor(quest.difficulty)}>
                              {quest.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                          {quest.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>⏱️ {quest.estimatedTime}</span>
                            <span>⭐ {quest.reward.exp} EXP</span>
                            {quest.reward.tokens && <span>🪙 {quest.reward.tokens} Tokens</span>}
                          </div>
                          
                          {quest.status === 'available' && (
                            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                              <Play className="w-3 h-3 mr-1" />
                              เริ่ม
                            </Button>
                          )}
                          
                          {quest.status === 'completed' && quest.badge && (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                              🏆 {quest.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            
            {/* Progress Stats */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  สถิติความก้าวหน้า
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">เควสสำเร็จ</span>
                  <span className="text-white font-semibold">
                    {completedQuests.length}/{questsState.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">EXP รวม</span>
                  <span className="text-cyan-400 font-semibold">{currentExp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Badge ที่ได้</span>
                  <span className="text-yellow-400 font-semibold">
                    {questsState.filter(q => q.status === 'completed').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Preview */}
            <Card className="bg-black/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  รางวัลพิเศษ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <p className="text-yellow-300 text-sm font-medium">🏆 MeeChain Graduate</p>
                  <p className="text-gray-300 text-xs mt-1">จบทุกเควส: +500 EXP + NFT พิเศษ</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
                  <p className="text-purple-300 text-sm font-medium">⚡ Speed Runner</p>
                  <p className="text-gray-300 text-xs mt-1">จบภายใน 1 ชั่วโมง: +200 Bonus EXP</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <p className="text-green-300 text-sm font-medium">🧠 Perfect Score</p>
                  <p className="text-gray-300 text-xs mt-1">คะแนน Quiz เต็ม: Badge พิเศษ</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  เมนูด่วน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/missions">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Target className="w-4 h-4 mr-2" />
                    ภารกิจรายวัน
                  </Button>
                </Link>
                <Link to="/meebot">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Bot className="w-4 h-4 mr-2" />
                    MeeBot Assistant
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    toast({
                      title: "📊 Leaderboard",
                      description: "คุณอยู่อันดับที่ 42 ใน Academy! เก่งมาก! 🎉",
                    });
                  }}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quest Modal */}
        {selectedQuest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-slate-900 border-cyan-500/30 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    {selectedQuest.icon}
                    {selectedQuest.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedQuest(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-cyan-100 italic">
                        "พร้อมแล้วมั้ย? เราจะไปลุยเควส '{selectedQuest.title}' กัน! 
                        ผมจะแนะนำทุกขั้นตอนให้เลย ไม่ต้องกังวล! 🚀"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => completeQuest(selectedQuest.id)}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    เริ่มเรียนรู้!
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedQuest(null)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    ไว้ครั้งหน้า
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
