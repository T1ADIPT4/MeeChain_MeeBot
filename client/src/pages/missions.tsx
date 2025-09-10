import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Gift, Coins } from "lucide-react";
import { Link } from "wouter";

interface Mission {
  missionId: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "claimed";
  reward: {
    type: string;
    amount: string;
    token: string | null;
  };
  completedAt?: string;
  claimedAt?: string;
}

interface TokenBalance {
  id: string;
  balance: string;
  totalEarned: string;
  lastFaucetClaim?: string;
  token: {
    symbol: string;
    name: string;
    address: string;
    chainId: string;
    decimals: string;
    logoUri?: string;
  };
}

export default function Missions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user from localStorage (from onboarding)
  const userStr = localStorage.getItem("meechain_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { data: missions = [], isLoading: loadingMissions } = useQuery({
    queryKey: ["/api/missions/list", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/missions/list?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch missions");
      return response.json();
    },
  });

  const { data: balances = [], isLoading: loadingBalances } = useQuery({
    queryKey: ["/api/balances", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/balances/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch balances");
      return response.json();
    },
  });

  const { data: tokens = [] } = useQuery({
    queryKey: ["/api/tokens"],
    queryFn: async () => {
      const response = await fetch("/api/tokens");
      if (!response.ok) throw new Error("Failed to fetch tokens");
      return response.json();
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const response = await apiRequest("POST", "/api/missions/claim", {
        userId: user.id,
        missionId,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "รับรางวัลสำเร็จ!",
        description: `ได้รับ ${data.reward?.amount} ${data.reward?.token}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/missions/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
    },
    onError: (error) => {
      toast({
        title: "ไม่สามารถรับรางวัลได้",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const faucetMutation = useMutation({
    mutationFn: async (token: any) => {
      const response = await apiRequest("POST", "/api/faucet/request", {
        userId: user.id,
        tokenAddress: token.address,
        chainId: token.chainId,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Faucet request failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "รับเหรียญทดลองสำเร็จ!",
        description: `ได้รับ ${parseFloat(data.amount) / Math.pow(10, 18)} ${data.token}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
    },
    onError: (error) => {
      toast({
        title: "ไม่สามารถรับเหรียญทดลองได้",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "claimed":
        return <Gift className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "เสร็จสิ้น";
      case "claimed":
        return "รับรางวัลแล้ว";
      default:
        return "รอดำเนินการ";
    }
  };

  const formatBalance = (balance: string, decimals: string) => {
    const divisor = Math.pow(10, parseInt(decimals));
    return (parseFloat(balance) / divisor).toFixed(4);
  };

  const completedMissions = missions.filter((m: Mission) => m.status === "completed" || m.status === "claimed");
  const progressPercentage = (completedMissions.length / Math.max(missions.length, 1)) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-white mb-4">กรุณาเข้าสู่ระบบก่อนใช้งาน</p>
            <Link to="/">
              <Button>กลับหน้าหลัก</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ภารกิจ & รางวัล</h1>
            <p className="text-purple-200">ทำภารกิจเพื่อรับรางวัลและเหรียญฟรี</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20">
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>

        {/* Progress Overview */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5" />
              ความคืบหน้าภารกิจ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">
                  เสร็จสิ้น {completedMissions.length} จาก {missions.length} ภารกิจ
                </span>
                <span className="text-purple-200">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Missions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">รายการภารกิจ</h2>
            {loadingMissions ? (
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <p className="text-purple-200">กำลังโหลด...</p>
                </CardContent>
              </Card>
            ) : (
              missions.map((mission: Mission) => (
                <Card key={mission.missionId} className="bg-black/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-white text-lg">{mission.title}</CardTitle>
                        <CardDescription className="text-purple-200">
                          {mission.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={mission.status === "completed" ? "default" : mission.status === "claimed" ? "secondary" : "outline"}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(mission.status)}
                        {getStatusText(mission.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-purple-200">
                        <Coins className="h-4 w-4" />
                        รางวัล: {mission.reward.amount} {mission.reward.token}
                      </div>
                      {mission.status === "completed" && !mission.claimedAt && (
                        <Button
                          size="sm"
                          onClick={() => claimMutation.mutate(mission.missionId)}
                          disabled={claimMutation.isPending}
                          data-testid={`button-claim-${mission.missionId}`}
                        >
                          {claimMutation.isPending ? "กำลังรับ..." : "รับรางวัล"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Token Balances & Faucet */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">ยอดคงเหลือ & Faucet</h2>

            {/* Token Balances */}
            {loadingBalances ? (
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <p className="text-purple-200">กำลังโหลด...</p>
                </CardContent>
              </Card>
            ) : balances.length > 0 ? (
              balances.map((balance: TokenBalance) => (
                <Card key={balance.id} className="bg-black/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{balance.token.symbol}</h3>
                        <p className="text-sm text-purple-200">{balance.token.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white" data-testid={`balance-${balance.token.symbol}`}>
                          {formatBalance(balance.balance, balance.token.decimals)}
                        </p>
                        <p className="text-xs text-purple-200">
                          รวมได้รับ: {formatBalance(balance.totalEarned, balance.token.decimals)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-purple-200 mb-4">ยังไม่มียอดคงเหลือ</p>
                  <p className="text-sm text-purple-300">เริ่มทำภารกิจหรือใช้ Faucet เพื่อรับเหรียญฟรี</p>
                </CardContent>
              </Card>
            )}

            {/* Faucet Section */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">รับเหรียญฟรี (Faucet)</CardTitle>
                <CardDescription className="text-purple-200">
                  รับเหรียญทดลองฟรีทุกวัน - รองรับ ERC-20 Token ใหม่!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tokens.map((token: any) => (
                  <div key={token.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div>
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-sm text-purple-200">{token.name}</p>
                      {token.chainId === "122" && (
                        <Badge variant="outline" className="text-xs mt-1">Fuse Network</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => faucetMutation.mutate(token)}
                      disabled={faucetMutation.isPending}
                      className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
                      data-testid={`button-faucet-${token.symbol}`}
                    >
                      {faucetMutation.isPending ? "กำลังรับ..." : "รับฟรี"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap, 
  Star, 
  Gift, 
  CheckCircle,
  Book,
  RefreshCw,
  Users,
  Sparkles,
  Bot,
  Clipboard,
  Award,
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';

interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'usage' | 'exploration' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    xp: number;
    tokens?: number;
    badge?: string;
    meePoints?: number;
  };
  progress: number;
  maxProgress: number;
  completed: boolean;
  meeBotComment: string;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  totalMissions: number;
  streakDays: number;
  badges: string[];
  meePoints: number;
}

export default function MissionsPage() {
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 150,
    xpToNextLevel: 300,
    title: "MeeBot Trainee",
    totalMissions: 8,
    streakDays: 3,
    badges: ["First Flight", "Explorer"],
    meePoints: 450
  });

  // Mock missions data
  useEffect(() => {
    const mockMissions: Mission[] = [
      {
        id: 'learn-wallet',
        title: '📚 อ่านบทความ Wallet Security',
        description: 'เรียนรู้วิธีปกป้อง Wallet ของคุณให้ปลอดภัย',
        category: 'learning',
        difficulty: 'easy',
        reward: { xp: 50, badge: 'Security Expert' },
        progress: 0,
        maxProgress: 1,
        completed: false,
        meeBotComment: 'ความปลอดภัยคือสิ่งสำคัญที่สุดนะ! อ่านเสร็จแล้วมาเล่าให้ผมฟัง 🔒'
      },
      {
        id: 'swap-token',
        title: '🔄 ทำ Token Swap 1 ครั้ง',
        description: 'ลองใช้ระบบ Swap เพื่อแลกเปลี่ยน Token',
        category: 'usage',
        difficulty: 'medium',
        reward: { xp: 75, tokens: 10, meePoints: 25 },
        progress: 0,
        maxProgress: 1,
        completed: false,
        meeBotComment: 'Swap เป็นยังไง? สนุกและเจ๋งใช่มั้ย! คุณกำลังเป็นนักเทรดมือโปรแล้วนะ 📈'
      },
      {
        id: 'explore-academy',
        title: '🧭 สำรวจ MeeChain Academy',
        description: 'เข้าไปดูคอร์สและบทเรียนใน Academy',
        category: 'exploration',
        difficulty: 'easy',
        reward: { xp: 40, badge: 'Knowledge Seeker' },
        progress: 1,
        maxProgress: 3,
        completed: false,
        meeBotComment: 'Academy เต็มไปด้วยความรู้ดี ๆ เลยนะ! ดูให้ครบทุกส่วนเลย 🎓'
      },
      {
        id: 'invite-friend',
        title: '🤝 แนะนำ MeeChain ให้เพื่อน',
        description: 'ชวนเพื่อนมาเป็นส่วนหนึ่งของ MeeChain',
        category: 'community',
        difficulty: 'hard',
        reward: { xp: 100, tokens: 50, meePoints: 100, badge: 'Community Builder' },
        progress: 0,
        maxProgress: 1,
        completed: false,
        meeBotComment: 'แชร์ความสนุกให้เพื่อน ๆ ด้วย! ยิ่งมีเพื่อน ยิ่งสนุกกันเยอะ 🎉'
      },
      {
        id: 'daily-login',
        title: '✨ เข้าใช้งานต่อเนื่อง 7 วัน',
        description: 'มาทักทาย MeeBot ทุกวันนะ!',
        category: 'exploration',
        difficulty: 'easy',
        reward: { xp: 80, badge: 'Loyal Pilot' },
        progress: 3,
        maxProgress: 7,
        completed: false,
        meeBotComment: 'ขอบคุณที่มาหาผมทุกวันนะ! อีก 4 วันจะได้ badge พิเศษแล้ว 🥰'
      }
    ];
    setMissions(mockMissions);
  }, []);

  const handleClaimReward = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    // อัปเดต mission
    setMissions(prev => 
      prev.map(m => 
        m.id === missionId 
          ? { ...m, completed: true, progress: m.maxProgress }
          : m
      )
    );

    // อัปเดต user stats
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + mission.reward.xp,
      meePoints: prev.meePoints + (mission.reward.meePoints || 0),
      totalMissions: prev.totalMissions + 1,
      badges: mission.reward.badge 
        ? [...prev.badges, mission.reward.badge]
        : prev.badges
    }));

    toast({
      title: "🎉 ภารกิจสำเร็จ!",
      description: `${mission.reward.xp} XP${mission.reward.tokens ? ` + ${mission.reward.tokens} Token` : ''}${mission.reward.badge ? ` + Badge "${mission.reward.badge}"` : ''}`,
    });
  };

  const getCategoryIcon = (category: Mission['category']) => {
    switch (category) {
      case 'learning': return <Book className="w-4 h-4" />;
      case 'usage': return <RefreshCw className="w-4 h-4" />;
      case 'exploration': return <Target className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Mission['category']) => {
    switch (category) {
      case 'learning': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'usage': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'exploration': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'community': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
  };

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return "MeeBot Guardian";
    if (level >= 5) return "MeeBot Explorer";
    return "MeeBot Trainee";
  };

  const xpProgress = (userStats.xp / userStats.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/meebot">
              <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-white/10">
                ← กลับ MeeBot
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🎮 MeeBot Missions</h1>
              <p className="text-purple-200">ภารกิจรายวันจาก MeeBot เพื่อเป็นนักบิน Web3 มือโปร!</p>
            </div>
          </div>
        </div>

        {/* MeeBot Welcome Section */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clipboard className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-cyan-300">ภารกิจวันนี้มาแล้วจ้า!</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  "สวัสดีครับ! วันนี้มีภารกิจสนุก ๆ รออยู่เยอะเลย ทำครบทุกอย่างแล้วจะได้ XP และรางวัลเพียบ! พร้อมลุยมั้ย? 🚀"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/50 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-bold text-yellow-300">Level {userStats.level}</h3>
              <p className="text-sm text-gray-300">{getLevelTitle(userStats.level)}</p>
              <div className="mt-2">
                <Progress value={xpProgress} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">{userStats.xp}/{userStats.xpToNextLevel} XP</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-green-500/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-bold text-green-300">{userStats.totalMissions}</h3>
              <p className="text-sm text-gray-300">ภารกิจสำเร็จ</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="font-bold text-orange-300">{userStats.streakDays} วัน</h3>
              <p className="text-sm text-gray-300">Streak ต่อเนื่อง</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-bold text-purple-300">{userStats.meePoints}</h3>
              <p className="text-sm text-gray-300">MeePoints</p>
            </CardContent>
          </Card>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {missions.map((mission) => (
            <Card 
              key={mission.id} 
              className={`transition-all duration-300 hover:scale-105 ${
                mission.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-black/50 border-slate-600 hover:border-cyan-500/50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`font-bold text-lg ${
                        mission.completed ? 'text-green-300 line-through' : 'text-white'
                      }`}>
                        {mission.title}
                      </h4>
                      {mission.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{mission.description}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge className={getCategoryColor(mission.category)}>
                        {getCategoryIcon(mission.category)}
                        <span className="ml-1 capitalize">{mission.category}</span>
                      </Badge>
                      <Badge className={getDifficultyColor(mission.difficulty)}>
                        {mission.difficulty}
                      </Badge>
                    </div>

                    {/* Progress */}
                    {mission.maxProgress > 1 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>ความคืบหน้า</span>
                          <span>{mission.progress}/{mission.maxProgress}</span>
                        </div>
                        <Progress value={(mission.progress / mission.maxProgress) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* MeeBot Comment */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-cyan-200 text-sm italic">"{mission.meeBotComment}"</p>
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-yellow-300">
                      <Sparkles className="w-4 h-4" />
                      <span>{mission.reward.xp} XP</span>
                    </div>
                    {mission.reward.tokens && (
                      <div className="flex items-center gap-1 text-green-300">
                        <Gift className="w-4 h-4" />
                        <span>{mission.reward.tokens} Token</span>
                      </div>
                    )}
                    {mission.reward.meePoints && (
                      <div className="flex items-center gap-1 text-purple-300">
                        <Star className="w-4 h-4" />
                        <span>{mission.reward.meePoints} MP</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleClaimReward(mission.id)}
                    disabled={mission.completed || mission.progress < mission.maxProgress}
                    size="sm"
                    className={mission.completed 
                      ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                      : mission.progress >= mission.maxProgress
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white animate-pulse"
                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }
                  >
                    {mission.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        สำเร็จแล้ว
                      </>
                    ) : mission.progress >= mission.maxProgress ? (
                      <>
                        <Gift className="w-4 h-4 mr-1" />
                        รับรางวัล!
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        ดำเนินการ
                      </>
                    )}
                  </Button>
                </div>

                {mission.reward.badge && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="flex items-center gap-2 text-yellow-300 text-sm">
                      <Award className="w-4 h-4" />
                      <span>Badge: "{mission.reward.badge}"</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Progress Summary */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              สรุปความคืบหน้าวันนี้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-300">
                  {missions.filter(m => m.completed).length}
                </p>
                <p className="text-sm text-gray-300">ภารกิจเสร็จ</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-300">
                  {missions.reduce((acc, m) => acc + (m.completed ? m.reward.xp : 0), 0)}
                </p>
                <p className="text-sm text-gray-300">XP รวม</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-300">
                  {missions.reduce((acc, m) => acc + (m.completed ? (m.reward.tokens || 0) : 0), 0)}
                </p>
                <p className="text-sm text-gray-300">Token รวม</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-300">
                  {userStats.badges.length}
                </p>
                <p className="text-sm text-gray-300">Badge ที่มี</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
