
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Bot,
  Heart,
  Share2,
  Eye,
  Sparkles,
  Star,
  Crown,
  Trophy,
  Gem,
  Tag,
  Users,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceNFT {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  type: 'BADGE' | 'MASCOT' | 'MISSION' | 'ACHIEVEMENT' | 'SPECIAL';
  price: number;
  seller: string;
  sellerName: string;
  isOnSale: boolean;
  viewCount: number;
  favoriteCount: number;
  lastSalePrice?: number;
  listingTime: string;
}

export function NFTMarketplace() {
  const [marketplaceNFTs, setMarketplaceNFTs] = useState<MarketplaceNFT[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock marketplace data
  const mockMarketplaceNFTs: MarketplaceNFT[] = [
    {
      tokenId: 100,
      name: "Legendary Zen Pilot",
      description: "Badge หายาก! ปลดล็อกจากการทำสมาธิ 100 ครั้ง",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'LEGENDARY',
      type: 'BADGE',
      price: 150,
      seller: '0xbadge...',
      sellerName: 'ZenMaster',
      isOnSale: true,
      viewCount: 89,
      favoriteCount: 18,
      lastSalePrice: 120,
      listingTime: new Date().toISOString()
    },
    {
      tokenId: 101,
      name: "Crypto Pilot Badge",
      description: "Badge สำหรับนักบินที่เก่งเรื่อง cryptocurrency",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'RARE',
      type: 'BADGE',
      price: 50,
      seller: '0x123...',
      sellerName: 'CryptoPro',
      isOnSale: true,
      viewCount: 42,
      favoriteCount: 8,
      lastSalePrice: 45,
      listingTime: new Date().toISOString()
    },
    {
      tokenId: 102,
      name: "Rainbow MeeBot",
      description: "MeeBot สีรุ้งสุดน่ารัก limited edition!",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'LEGENDARY',
      type: 'MASCOT',
      price: 200,
      seller: '0x456...',
      sellerName: 'NFTCollector',
      isOnSale: true,
      viewCount: 156,
      favoriteCount: 23,
      lastSalePrice: 180,
      listingTime: new Date().toISOString()
    },
    {
      tokenId: 103,
      name: "DeFi Master",
      description: "Achievement จากการทำ DeFi ครบทุกประเภท",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'EPIC',
      type: 'ACHIEVEMENT',
      price: 75,
      seller: '0x789...',
      sellerName: 'DeFiKing',
      isOnSale: true,
      viewCount: 89,
      favoriteCount: 15,
      lastSalePrice: 70,
      listingTime: new Date().toISOString()
    },
    {
      tokenId: 104,
      name: "Genesis Mission",
      description: "NFT จากภารกิจแรกของ MeeChain",
      imageUrl: "/api/placeholder/200/200",
      rarity: 'MYTHIC',
      type: 'SPECIAL',
      price: 500,
      seller: '0xabc...',
      sellerName: 'Genesis',
      isOnSale: true,
      viewCount: 234,
      favoriteCount: 45,
      lastSalePrice: 450,
      listingTime: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMarketplaceNFTs(mockMarketplaceNFTs);
      setLoading(false);
    }, 1500);
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

  const handleBuyNFT = (nft: MarketplaceNFT) => {
    // MeeBot purchase recommendation
    const rarityMessages = {
      'COMMON': 'นี่เป็นราคาดี ๆ เลยครับ! เหมาะสำหรับมือใหม่ 👍',
      'RARE': 'โอ้! NFT นี้มีคุณค่าดีนะครับ ลงทุนคุ้มแน่นอน! 💎',
      'EPIC': 'ว้าว! Epic NFT เลยครับ นี่จะเป็นของสะสมที่ดีมาก! 🔥',
      'LEGENDARY': 'โอ้โห! Legendary NFT!! นี่หายากมาก ๆ เลยครับ! 🏆✨',
      'MYTHIC': 'อะไรนะ?! MYTHIC NFT!! นี่เป็นสมบัติระดับตำนานเลยครับ!! 🌟🚀'
    };

    toast({
      title: "🤖 MeeBot แนะนำ",
      description: rarityMessages[nft.rarity] || 'NFT นี้น่าสนใจดีครับ!',
    });

    // Simulate purchase
    setTimeout(() => {
      toast({
        title: "🎉 ซื้อสำเร็จ!",
        description: `คุณได้ ${nft.name} แล้ว! MeeBot ยินดีด้วยครับ! 🎊`,
      });
    }, 1000);
  };

  const handleFavorite = (nft: MarketplaceNFT) => {
    toast({
      title: "❤️ เพิ่มไปยังรายการโปรด",
      description: `${nft.name} ถูกเพิ่มไปยังรายการโปรดแล้ว`,
    });
  };

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || nft.type.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
              <p className="text-slate-300">กำลังโหลด Marketplace...</p>
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
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">NFT Marketplace</h2>
                <p className="text-sm text-slate-400">{marketplaceNFTs.length} NFTs ให้เลือกซื้อ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                Stats
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="ค้นหา NFT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-600/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="badge">Badges</TabsTrigger>
          <TabsTrigger value="mascot">Mascots</TabsTrigger>
          <TabsTrigger value="mission">Missions</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNFTs.map((nft) => (
              <Card 
                key={nft.tokenId}
                className={`bg-gradient-to-br ${getRarityColor(nft.rarity)}/10 border-2 border-${getRarityColor(nft.rarity).split(' ')[1].split('-')[1]}-500/30 hover:border-${getRarityColor(nft.rarity).split(' ')[1].split('-')[1]}-500/60 transition-all duration-300 hover:scale-105 group`}
              >
                <CardHeader className="pb-2">
                  <div className="relative">
                    {/* NFT Image */}
                    <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-600/50 transition-colors">
                      <div className="text-center">
                        {getRarityIcon(nft.rarity)}
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

                    {/* Quick Actions */}
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleFavorite(nft)}
                        className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white line-clamp-1">{nft.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{nft.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {nft.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {nft.favoriteCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{nft.sellerName}</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">ราคา</span>
                      {nft.lastSalePrice && (
                        <span className="text-xs text-green-400">
                          +{((nft.price - nft.lastSalePrice) / nft.lastSalePrice * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="font-bold text-white">{nft.price} MEE</span>
                      </div>
                      {nft.lastSalePrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {nft.lastSalePrice} MEE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
                    onClick={() => handleBuyNFT(nft)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    ซื้อทันที
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredNFTs.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ไม่พบ NFT ที่ค้นหา</h3>
                <p className="text-slate-400">ลองค้นหาด้วยคำอื่น หรือเปลี่ยนหมวดหมู่ดูครับ</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* MeeBot Marketplace Tips */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-cyan-300 mb-1">🛒 MeeBot Market Tips</h3>
              <p className="text-sm text-gray-300">
                LEGENDARY และ MYTHIC NFTs มีราคาสูงขึ้นเรื่อย ๆ! ลงทุนตอนนี้อาจคุ้มในอนาคตครับ! 📈✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
