
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Crown, 
  Gem, 
  Bot,
  Target,
  Award,
  Gift,
  Eye,
  Share2,
  Filter,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollectibleNFT {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  type: 'BADGE' | 'MASCOT' | 'MISSION' | 'ACHIEVEMENT' | 'SPECIAL';
  mintedAt: string;
  isTransferable: boolean;
  originalMinter: string;
}

interface CollectiblesViewerProps {
  userAddress?: string;
}

export function CollectiblesViewer({ userAddress }: CollectiblesViewerProps) {
  const [collectibles, setCollectibles] = useState<CollectibleNFT[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedNFT, setSelectedNFT] = useState<CollectibleNFT | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data - จะเชื่อมต่อกับ smart contract ในอนาคต
  const mockCollectibles: CollectibleNFT[] = [
    {
      tokenId: 1,
      name: "First Flight Badge",
      description: "ปลดล็อกจากการทำภารกิจครั้งแรกใน MeeChain",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'COMMON',
      type: 'BADGE',
      mintedAt: new Date().toISOString(),
      isTransferable: false,
      originalMinter: userAddress || '0x...'
    },
    {
      tokenId: 2,
      name: "Golden MeeBot",
      description: "MeeBot สุดพิเศษที่มีเพียง 100 ตัวในโลก!",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'LEGENDARY',
      type: 'MASCOT',
      mintedAt: new Date().toISOString(),
      isTransferable: true,
      originalMinter: userAddress || '0x...'
    },
    {
      tokenId: 3,
      name: "Web3 Pioneer",
      description: "สำหรับผู้ที่ส่ง transaction แรกใน Web3",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'EPIC',
      type: 'ACHIEVEMENT',
      mintedAt: new Date().toISOString(),
      isTransferable: false,
      originalMinter: userAddress || '0x...'
    },
    {
      tokenId: 4,
      name: "Mission Master",
      description: "ผ่านภารกิจระดับยากแล้ว 10 ภารกิจ",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'RARE',
      type: 'MISSION',
      mintedAt: new Date().toISOString(),
      isTransferable: true,
      originalMinter: userAddress || '0x...'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCollectibles(mockCollectibles);
      setLoading(false);
    }, 1000);
  }, [userAddress]);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BADGE': return <Award className="w-4 h-4" />;
      case 'MASCOT': return <Bot className="w-4 h-4" />;
      case 'MISSION': return <Target className="w-4 h-4" />;
      case 'ACHIEVEMENT': return <Trophy className="w-4 h-4" />;
      case 'SPECIAL': return <Gift className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const filteredCollectibles = selectedTab === 'all' 
    ? collectibles 
    : collectibles.filter(nft => nft.type.toLowerCase() === selectedTab);

  const handleNFTClick = (nft: CollectibleNFT) => {
    setSelectedNFT(nft);
    setShowDetails(true);
    
    // MeeBot comment
    toast({
      title: "🤖 MeeBot",
      description: `ว้าว! ${nft.name} สวยมาก ๆ เลยครับ! ${nft.rarity === 'LEGENDARY' ? 'นี่เป็น NFT หายากมาก ๆ นะ! 🏆' : 'เก็บไว้โชว์เลย! ✨'}`,
    });
  };

  const handleShare = (nft: CollectibleNFT) => {
    navigator.clipboard.writeText(`ดู NFT สุดเท่ของผม: ${nft.name} - ${nft.description}`);
    toast({
      title: "🔗 คัดลอกแล้ว!",
      description: "ลิงก์ NFT ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
              <p className="text-slate-300">กำลังโหลด NFT ของคุณ...</p>
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
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">My NFT Collection</h2>
                <p className="text-sm text-slate-400">{collectibles.length} collectibles</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-600/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-500/20">All</TabsTrigger>
          <TabsTrigger value="badge" className="data-[state=active]:bg-blue-500/20">Badges</TabsTrigger>
          <TabsTrigger value="mascot" className="data-[state=active]:bg-green-500/20">Mascots</TabsTrigger>
          <TabsTrigger value="mission" className="data-[state=active]:bg-yellow-500/20">Missions</TabsTrigger>
          <TabsTrigger value="achievement" className="data-[state=active]:bg-red-500/20">Achievements</TabsTrigger>
          <TabsTrigger value="special" className="data-[state=active]:bg-pink-500/20">Special</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCollectibles.map((nft) => (
              <Card 
                key={nft.tokenId}
                className={`bg-gradient-to-br ${getRarityColor(nft.rarity)}/10 border-2 border-${getRarityColor(nft.rarity).split(' ')[1].split('-')[1]}-500/30 hover:border-${getRarityColor(nft.rarity).split(' ')[1].split('-')[1]}-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group`}
                onClick={() => handleNFTClick(nft)}
              >
                <CardHeader className="pb-2">
                  <div className="relative">
                    {/* NFT Image Placeholder */}
                    <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-600/50 transition-colors">
                      <div className="text-center">
                        {getTypeIcon(nft.type)}
                        <p className="text-xs text-slate-400 mt-1">NFT Image</p>
                      </div>
                    </div>

                    {/* Rarity Badge */}
                    <Badge 
                      className={`absolute top-2 right-2 bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white border-0`}
                    >
                      {getRarityIcon(nft.rarity)}
                      <span className="ml-1 text-xs">{nft.rarity}</span>
                    </Badge>

                    {/* Transferable Badge */}
                    {!nft.isTransferable && (
                      <Badge className="absolute top-2 left-2 bg-slate-600/80 text-slate-200 border-0">
                        🔒 Soulbound
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white line-clamp-1">{nft.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{nft.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {getTypeIcon(nft.type)}
                      <span className="ml-1 text-xs">{nft.type}</span>
                    </Badge>

                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(nft);
                        }}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCollectibles.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ยังไม่มี NFT ในหมวดนี้</h3>
                <p className="text-slate-400 mb-6">ลุยภารกิจเพื่อปลดล็อก NFT สุดเท่กันเถอะ!</p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Target className="w-4 h-4 mr-2" />
                  ดูภารกิจ
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* MeeBot Collection Tips */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-cyan-300 mb-1">💡 MeeBot Tips</h3>
              <p className="text-sm text-gray-300">
                NFT มีหลายระดับความหายาก! ลุยภารกิจเพิ่มเติมเพื่อปลดล็อก LEGENDARY และ MYTHIC กันเถอะ! 🏆✨
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              ดูเพิ่ม
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
