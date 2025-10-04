
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import meechainLogo from '@assets/branding/logo.png';
import { 
  Trophy, 
  Medal,
  Star,
  Crown,
  Zap,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  exp: number;
  completedQuests: number;
  badges: string[];
  avatar?: string;
  isCurrentUser?: boolean;
  fastestCompletion?: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [activeTab, setActiveTab] = useState<'overall' | 'weekly' | 'achievements'>('overall');
  
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "CryptoMaster123",
      level: 3,
      exp: 850,
      completedQuests: 5,
      badges: ["Wallet Pioneer", "Token Handler", "Swap Ninja", "Security Guardian", "MeeChain Expert"],
      fastestCompletion: "45 นาที"
    },
    {
      rank: 2,
      username: "Web3Explorer",
      level: 3,
      exp: 720,
      completedQuests: 5,
      badges: ["Wallet Pioneer", "Token Handler", "Swap Ninja", "Security Guardian"],
      fastestCompletion: "52 นาที"
    },
    {
      rank: 3,
      username: "BlockchainBeginner",
      level: 2,
      exp: 580,
      completedQuests: 4,
      badges: ["Wallet Pioneer", "Token Handler", "Swap Ninja"],
      fastestCompletion: "1 ชั่วโมง 15 นาที"
    },
    {
      rank: 42,
      username: "คุณ",
      level: 1,
      exp: 220,
      completedQuests: 2,
      badges: ["Wallet Pioneer", "Token Handler"],
      isCurrentUser: true,
      fastestCompletion: "1 ชั่วโมง 30 นาที"
    }
  ];

  const achievements = [
    {
      name: "🚀 Speed Runner",
      description: "จบ Academy ภายใน 1 ชั่วโมง",
      holders: 12,
      rarity: "Legendary"
    },
    {
      name: "🧠 Perfect Scholar",
      description: "ได้คะแนน Quiz เต็ม 100% ทุกเควส",
      holders: 8,
      rarity: "Legendary"
    },
    {
      name: "🎯 Quest Master",
      description: "จบทุกเควสใน Academy",
      holders: 156,
      rarity: "Epic"
    },
    {
      name: "🔥 Early Adopter",
      description: "เป็นใน 100 คนแรกที่เข้าร่วม Academy",
      holders: 100,
      rarity: "Rare"
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-yellow-500/30 text-white max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-300 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              🏆 MeeChain Academy Leaderboard
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 mt-4">
            <Button
              variant={activeTab === 'overall' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('overall')}
              className={activeTab === 'overall' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-400'}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              อันดับรวม
            </Button>
            <Button
              variant={activeTab === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('weekly')}
              className={activeTab === 'weekly' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-400'}
            >
              <Clock className="w-4 h-4 mr-2" />
              สัปดาห์นี้
            </Button>
            <Button
              variant={activeTab === 'achievements' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('achievements')}
              className={activeTab === 'achievements' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-400'}
            >
              <Star className="w-4 h-4 mr-2" />
              Achievements
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-96">
          
          {/* Overall Rankings */}
          {activeTab === 'overall' && (
            <div className="space-y-3">
              {leaderboardData.map((entry) => (
                <Card 
                  key={entry.rank}
                  className={`transition-all ${
                    entry.isCurrentUser 
                      ? 'bg-cyan-500/10 border-cyan-500/30 ring-2 ring-cyan-500/50' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 bg-slate-700/50 rounded-lg">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      {/* Avatar */}
                      <img
                        src={meechainLogo}
                        alt="MeeChain"
                        className="w-10 h-10 rounded-full border-2 border-purple-500"
                      />
                      
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${entry.isCurrentUser ? 'text-cyan-300' : 'text-white'}`}>
                            {entry.username}
                            {entry.isCurrentUser && <span className="text-cyan-400 text-sm">(คุณ)</span>}
                          </h3>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            Level {entry.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>⭐ {entry.exp} EXP</span>
                          <span>🎯 {entry.completedQuests} เควส</span>
                          <span>🏆 {entry.badges.length} badges</span>
                          {entry.fastestCompletion && (
                            <span>⚡ {entry.fastestCompletion}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Special Badges */}
                      <div className="flex flex-col gap-1">
                        {entry.rank <= 3 && (
                          <Badge className={`text-xs ${
                            entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            entry.rank === 2 ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' :
                            'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          }`}>
                            Top {entry.rank}
                          </Badge>
                        )}
                        {entry.completedQuests >= 5 && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            Graduate
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Weekly Rankings */}
          {activeTab === 'weekly' && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">สัปดาห์นี้</h3>
              <p className="text-gray-400">
                การแข่งขันสัปดาห์นี้จะเริ่มในวันจันทร์หน้า!
              </p>
              <p className="text-sm text-cyan-300 mt-2">
                รางวัล: 500 Bonus EXP + Badge พิเศษ
              </p>
            </div>
          )}

          {/* Achievements */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          {achievement.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {achievement.holders} คนที่ได้รับ
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Zap className="w-8 h-8 text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
