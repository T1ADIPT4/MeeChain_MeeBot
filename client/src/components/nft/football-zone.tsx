
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FootballQuests } from './football-quests';
import {
  Trophy,
  Star,
  Target,
  Users,
  Zap,
  Crown,
  Medal,
  Flame,
  Bot,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getContractAddress, isFallbackEnabled } from '@/services/deploy-registry';

interface FootballPlayer {
  id: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  skills: {
    pace: number;
    shooting: number;
    passing: number;
    defending: number;
    dribbling: number;
    physical: number;
  };
  imageUrl: string;
  questRequired?: string;
  price?: number;
}

const mockPlayers: FootballPlayer[] = [
  {
    id: 1,
    name: "Cristiano Ronaldo",
    position: "FWD",
    rating: 95,
    rarity: "MYTHIC",
    skills: { pace: 89, shooting: 96, passing: 82, defending: 35, dribbling: 89, physical: 87 },
    imageUrl: "/api/placeholder/200/250",
    questRequired: "Champion's League Winner",
    price: 500
  },
  {
    id: 2,
    name: "Lionel Messi",
    position: "FWD",
    rating: 94,
    rarity: "MYTHIC",
    skills: { pace: 81, shooting: 89, passing: 95, defending: 38, dribbling: 96, physical: 65 },
    imageUrl: "/api/placeholder/200/250",
    questRequired: "World Cup Hero",
    price: 500
  },
  {
    id: 3,
    name: "Kevin De Bruyne",
    position: "MID",
    rating: 91,
    rarity: "LEGENDARY",
    skills: { pace: 76, shooting: 88, passing: 96, defending: 64, dribbling: 86, physical: 78 },
    imageUrl: "/api/placeholder/200/250",
    questRequired: "Playmaker Master",
    price: 300
  },
  {
    id: 4,
    name: "Virgil van Dijk",
    position: "DEF",
    rating: 90,
    rarity: "LEGENDARY",
    skills: { pace: 79, shooting: 60, passing: 71, defending: 96, dribbling: 72, physical: 93 },
    imageUrl: "/api/placeholder/200/250",
    questRequired: "Defensive Wall",
    price: 250
  },
  {
    id: 5,
    name: "Kylian Mbappé",
    position: "FWD",
    rating: 92,
    rarity: "LEGENDARY",
    skills: { pace: 97, shooting: 89, passing: 80, defending: 39, dribbling: 92, physical: 77 },
    imageUrl: "/api/placeholder/200/250",
    questRequired: "Speed Demon",
    price: 350
  }
];

export function FootballZone() {
  const [selectedPlayer, setSelectedPlayer] = useState<FootballPlayer | null>(null);
  const [filter, setFilter] = useState<{
    position: string;
    rarity: string;
    searchTerm: string;
  }>({
    position: 'ALL',
    rarity: 'ALL',
    searchTerm: ''
  });
  const [userTeam, setUserTeam] = useState<FootballPlayer[]>([]);
  const { toast } = useToast();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'MYTHIC': return 'from-pink-500 to-red-500';
      case 'LEGENDARY': return 'from-yellow-500 to-orange-500';
      case 'EPIC': return 'from-purple-500 to-indigo-500';
      case 'RARE': return 'from-blue-500 to-cyan-500';
      case 'COMMON': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'GK': return '🥅';
      case 'DEF': return '🛡️';
      case 'MID': return '⚙️';
      case 'FWD': return '⚽';
      default: return '👤';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'DEF': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'MID': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'FWD': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesPosition = filter.position === 'ALL' || player.position === filter.position;
    const matchesRarity = filter.rarity === 'ALL' || player.rarity === filter.rarity;
    const matchesSearch = player.name.toLowerCase().includes(filter.searchTerm.toLowerCase());
    return matchesPosition && matchesRarity && matchesSearch;
  });

  const handleRecruitPlayer = async (player: FootballPlayer) => {
    try {
      // Mock recruitment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserTeam(prev => [...prev, player]);
      
      toast({
        title: `⚽ ${player.name} เข้าร่วมทีมแล้ว!`,
        description: `🎉 คุณได้รับ ${player.rarity} NFT และสามารถใช้ในการแข่งขันได้แล้ว!`,
      });

      // MeeBot reaction
      setTimeout(() => {
        toast({
          title: "🤖 MeeBot",
          description: `ยินดีด้วย! ${player.name} จะทำให้ทีมของคุณแข็งแกร่งขึ้น! 🌟`,
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถสรรหาผู้เล่นได้ กรุณาลองใหม่",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Fallback Banner */}
      {isFallbackEnabled() && (
        <div className="fallback-banner bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg text-yellow-300 text-center text-sm">
          ⚠️ โซนฟุตบอลกำลังทำงานในโหมด Demo - NFT จะถูกจำลองแทนการใช้ Smart Contract
        </div>
      )}

      {/* Header */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-300/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
              <Trophy className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">⚽ Football Legends Zone</h2>
              <p className="text-sm text-slate-400">สรรหาผู้เล่นดาวและสร้างทีมในฝัน</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="players" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="players" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">
            👥 ผู้เล่น
          </TabsTrigger>
          <TabsTrigger value="quests" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
            🎯 เควสต์
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="space-y-6">
          {/* Filters */}
          <Card className="bg-slate-800/80 border-slate-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5 text-cyan-400" />
            ค้นหาผู้เล่น
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">ค้นหาชื่อ</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="ชื่อผู้เล่น..."
                  value={filter.searchTerm}
                  onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">ตำแหน่ง</label>
              <Select value={filter.position} onValueChange={(value) => setFilter(prev => ({ ...prev, position: value }))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ทุกตำแหน่ง</SelectItem>
                  <SelectItem value="GK">🥅 Goalkeeper</SelectItem>
                  <SelectItem value="DEF">🛡️ Defender</SelectItem>
                  <SelectItem value="MID">⚙️ Midfielder</SelectItem>
                  <SelectItem value="FWD">⚽ Forward</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">ความหายาก</label>
              <Select value={filter.rarity} onValueChange={(value) => setFilter(prev => ({ ...prev, rarity: value }))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ทั้งหมด</SelectItem>
                  <SelectItem value="COMMON">Common</SelectItem>
                  <SelectItem value="RARE">Rare</SelectItem>
                  <SelectItem value="EPIC">Epic</SelectItem>
                  <SelectItem value="LEGENDARY">Legendary</SelectItem>
                  <SelectItem value="MYTHIC">Mythic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Cards */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlayers.map((player) => (
              <Card 
                key={player.id} 
                className={`bg-gradient-to-br ${getRarityColor(player.rarity)}/10 border-${player.rarity.toLowerCase()}-300/30 cursor-pointer transition-all hover:scale-[1.02]`}
                onClick={() => setSelectedPlayer(player)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{player.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getPositionColor(player.position)} border text-xs`}>
                          {getPositionIcon(player.position)} {player.position}
                        </Badge>
                        <Badge className={`bg-gradient-to-r ${getRarityColor(player.rarity)}/20 text-white border-0`}>
                          {player.rarity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{player.rating}</div>
                      <div className="text-xs text-slate-400">OVR</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">⚡ Pace:</span>
                      <span className="text-white">{player.skills.pace}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">🎯 Shooting:</span>
                      <span className="text-white">{player.skills.shooting}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">🎯 Passing:</span>
                      <span className="text-white">{player.skills.passing}</span>
                    </div>
                  </div>

                  {player.questRequired && (
                    <div className="mb-4 p-2 bg-blue-500/20 rounded border border-blue-500/30">
                      <div className="text-xs text-blue-300">🎯 Quest Required:</div>
                      <div className="text-sm text-white">{player.questRequired}</div>
                    </div>
                  )}

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecruitPlayer(player);
                    }}
                    disabled={userTeam.some(p => p.id === player.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    {userTeam.some(p => p.id === player.id) ? (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        ในทีมแล้ว
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        สรรหา {player.price} MEE
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Team */}
        <div className="space-y-6">
          <Card className="bg-slate-800/80 border-slate-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-green-400" />
                ทีมของฉัน ({userTeam.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userTeam.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>ยังไม่มีผู้เล่นในทีม</p>
                  <p className="text-sm">สรรหาผู้เล่นเพื่อเริ่มต้น!</p>
                </div>
              ) : (
                userTeam.map((player) => (
                  <div key={player.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getPositionIcon(player.position)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{player.name}</div>
                      <div className="text-slate-400 text-xs">{player.position} • {player.rating} OVR</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* MeeBot Tips */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-300/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-300 mb-1">⚽ MeeBot Tips</h3>
                  <p className="text-sm text-gray-300">
                    ทำเควสต์เพื่อปลดล็อกผู้เล่นระดับ MYTHIC! ทีมที่สมดุลจะชนะได้ง่ายกว่า! 🏆
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`bg-gradient-to-br ${getRarityColor(selectedPlayer.rarity)}/20 border-${selectedPlayer.rarity.toLowerCase()}-300/50 max-w-md w-full`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl">{selectedPlayer.name}</h3>
                  <Badge className={`${getPositionColor(selectedPlayer.position)} border mt-1`}>
                    {getPositionIcon(selectedPlayer.position)} {selectedPlayer.position}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{selectedPlayer.rating}</div>
                <Badge className={`bg-gradient-to-r ${getRarityColor(selectedPlayer.rarity)}/30 text-white border-0`}>
                  {selectedPlayer.rarity}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selectedPlayer.skills).map(([skill, value]) => (
                  <div key={skill} className="bg-slate-700/50 p-3 rounded">
                    <div className="text-slate-400 text-xs capitalize">{skill}</div>
                    <div className="text-white text-lg font-bold">{value}</div>
                  </div>
                ))}
              </div>

              {selectedPlayer.questRequired && (
                <div className="p-3 bg-blue-500/20 rounded border border-blue-500/30">
                  <div className="text-blue-300 text-sm font-medium">🎯 Quest Required</div>
                  <div className="text-white">{selectedPlayer.questRequired}</div>
                </div>
              )}

              <Button
                onClick={() => {
                  handleRecruitPlayer(selectedPlayer);
                  setSelectedPlayer(null);
                }}
                disabled={userTeam.some(p => p.id === selectedPlayer.id)}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                {userTeam.some(p => p.id === selectedPlayer.id) ? (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    ในทีมแล้ว
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    สรรหา {selectedPlayer.price} MEE
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
        </TabsContent>

        <TabsContent value="quests">
          <FootballQuests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
