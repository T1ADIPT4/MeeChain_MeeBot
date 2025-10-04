
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart,
  Zap,
  Star,
  Crown,
  Gem,
  Sparkles,
  TrendingUp,
  Filter,
  Search,
  Bot,
  ArrowUpCircle,
  Gift,
  Users,
  Eye,
  Heart,
  Sword,
  Shield,
  Clock,
  Target,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BadgePower {
  name: string;
  description: string;
  boost: number; // Percentage boost
  type: 'xp' | 'speed' | 'cooldown' | 'energy' | 'focus';
}

interface MarketplaceBadge {
  tokenId: number;
  name: string;
  description: string;
  power: BadgePower;
  level: number;
  maxLevel: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  category: 'PRODUCTIVITY' | 'EXPLORER' | 'SOCIALIZER' | 'ACHIEVER' | 'SPECIAL';
  price: string;
  seller: string;
  imageUrl?: string;
  isUpgradeable: boolean;
  questReward: boolean;
  views: number;
  likes: number;
  powerBoost: number;
}

export function RPGMarketplace() {
  const [badges, setBadges] = useState<MarketplaceBadge[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<MarketplaceBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [powerFilter, setPowerFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price_low');
  const { toast } = useToast();

  // Mock marketplace data with RPG elements
  const mockBadges: MarketplaceBadge[] = [
    {
      tokenId: 1,
      name: 'Zen Master',
      description: 'ผู้เชี่ยวชาญด้านสมาธิและความสงบ',
      power: {
        name: 'Focus Boost',
        description: 'เพิ่มประสิทธิภาพการทำงาน',
        boost: 25,
        type: 'focus'
      },
      level: 3,
      maxLevel: 5,
      rarity: 'EPIC',
      category: 'PRODUCTIVITY',
      price: '0.015 ETH',
      seller: '0x123...abc',
      isUpgradeable: true,
      questReward: false,
      views: 234,
      likes: 89,
      powerBoost: 25
    },
    {
      tokenId: 2,
      name: 'Time Warp Explorer',
      description: 'นักสำรวจผู้ควบคุมเวลาได้',
      power: {
        name: 'Time Acceleration',
        description: 'ลดเวลา cooldown ของภารกิจ',
        boost: 30,
        type: 'cooldown'
      },
      level: 2,
      maxLevel: 7,
      rarity: 'LEGENDARY',
      category: 'EXPLORER',
      price: '0.05 ETH',
      seller: '0x456...def',
      isUpgradeable: true,
      questReward: true,
      views: 567,
      likes: 234,
      powerBoost: 30
    },
    {
      tokenId: 3,
      name: 'Social Butterfly',
      description: 'ผู้เชี่ยวชาญด้านการสื่อสาร',
      power: {
        name: 'Network Boost',
        description: 'เพิ่มคะแนนจากกิจกรรมทีม',
        boost: 20,
        type: 'xp'
      },
      level: 1,
      maxLevel: 3,
      rarity: 'RARE',
      category: 'SOCIALIZER',
      price: '0.008 ETH',
      seller: '0x789...ghi',
      isUpgradeable: true,
      questReward: false,
      views: 123,
      likes: 45,
      powerBoost: 20
    },
    {
      tokenId: 4,
      name: 'Mythic Champion',
      description: 'ตำนานผู้พิชิต สุดยอดของ MeeChain',
      power: {
        name: 'Ultimate Power',
        description: 'เพิ่มทุกประเภทของ boost',
        boost: 50,
        type: 'energy'
      },
      level: 1,
      maxLevel: 15,
      rarity: 'MYTHIC',
      category: 'SPECIAL',
      price: '0.2 ETH',
      seller: '0xabc...123',
      isUpgradeable: true,
      questReward: true,
      views: 1234,
      likes: 567,
      powerBoost: 50
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setBadges(mockBadges);
      setFilteredBadges(mockBadges);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let filtered = badges;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(badge => 
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.power.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(badge => badge.rarity === rarityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(badge => badge.category === categoryFilter);
    }

    // Power type filter
    if (powerFilter !== 'all') {
      filtered = filtered.filter(badge => badge.power.type === powerFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'level':
          return b.level - a.level;
        case 'power':
          return b.powerBoost - a.powerBoost;
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredBadges(filtered);
  }, [badges, searchTerm, rarityFilter, categoryFilter, powerFilter, sortBy]);

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

  const getPowerIcon = (type: string) => {
    switch (type) {
      case 'xp': return <TrendingUp className="w-4 h-4" />;
      case 'speed': return <Zap className="w-4 h-4" />;
      case 'cooldown': return <Clock className="w-4 h-4" />;
      case 'energy': return <Sparkles className="w-4 h-4" />;
      case 'focus': return <Target className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const handlePurchase = (badge: MarketplaceBadge) => {
    toast({
      title: "🤖 MeeBot",
      description: `กำลังซื้อ ${badge.name} ให้คุณครับ! พลัง ${badge.power.name} จะช่วยเพิ่มประสิทธิภาพ ${badge.powerBoost}% เลย! 🚀`,
    });

    // Update views and likes
    setBadges(prev => prev.map(b => 
      b.tokenId === badge.tokenId 
        ? { ...b, views: b.views + 1, likes: b.likes + 1 }
        : b
    ));
  };

  const getMeeBotRecommendation = (badge: MarketplaceBadge) => {
    const quotes = [
      `${badge.name} เหมาะกับคุณมาก! พลัง ${badge.power.name} จะช่วยเพิ่มประสิทธิภาพได้เยอะครับ! 💪`,
      `Level ${badge.level} แล้วนะครับ! ยังอัปเกรดได้อีก ${badge.maxLevel - badge.level} ระดับเลย! ⚡`,
      `Badge ${badge.rarity} หาได้ยาก! ราคานี้คุ้มมากครับ! 💎`,
      `พลัง ${badge.power.name} +${badge.powerBoost}% นี่มันโกงเลยครับ! 🔥`
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-4">
              <ShoppingCart className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
              <p className="text-slate-300">กำลังโหลด RPG Marketplace...</p>
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
                <h2 className="text-xl font-bold">RPG Badge Marketplace</h2>
                <p className="text-sm text-slate-400">สะสม badge พร้อมพลังพิเศษ และอัปเกรดแบบ RPG!</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              {filteredBadges.length} badges พร้อมขาย
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="ค้นหา badge หรือพลัง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุก Rarity</SelectItem>
                <SelectItem value="COMMON">Common</SelectItem>
                <SelectItem value="RARE">Rare</SelectItem>
                <SelectItem value="EPIC">Epic</SelectItem>
                <SelectItem value="LEGENDARY">Legendary</SelectItem>
                <SelectItem value="MYTHIC">Mythic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุก Category</SelectItem>
                <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                <SelectItem value="EXPLORER">Explorer</SelectItem>
                <SelectItem value="SOCIALIZER">Socializer</SelectItem>
                <SelectItem value="ACHIEVER">Achiever</SelectItem>
                <SelectItem value="SPECIAL">Special</SelectItem>
              </SelectContent>
            </Select>

            <Select value={powerFilter} onValueChange={setPowerFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Power Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุก Power</SelectItem>
                <SelectItem value="xp">XP Boost</SelectItem>
                <SelectItem value="speed">Speed</SelectItem>
                <SelectItem value="cooldown">Cooldown</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="focus">Focus</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="เรียงตาม" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_low">ราคาต่ำสุด</SelectItem>
                <SelectItem value="price_high">ราคาสูงสุด</SelectItem>
                <SelectItem value="level">Level สูงสุด</SelectItem>
                <SelectItem value="power">Power สูงสุด</SelectItem>
                <SelectItem value="popular">ความนิยม</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <Card 
            key={badge.tokenId}
            className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-slate-800/80 border-slate-600/50 backdrop-blur-sm group`}
          >
            {/* Rarity Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(badge.rarity)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Quest Reward Badge */}
            {badge.questReward && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Quest Reward
                </Badge>
              </div>
            )}

            {/* Upgradeable Icon */}
            {badge.isUpgradeable && badge.level < badge.maxLevel && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  <ArrowUpCircle className="w-3 h-3 mr-1" />
                  Upgradeable
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4 relative z-20">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white border-0`}>
                  {badge.rarity}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {badge.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {badge.likes}
                  </span>
                </div>
              </div>

              <CardTitle className="text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{badge.name}</h3>
                  <span className="text-sm text-slate-400">Lv.{badge.level}/{badge.maxLevel}</span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 relative z-20">
              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed">{badge.description}</p>

              {/* Power Section */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPowerIcon(badge.power.type)}
                    <span className="text-sm font-semibold text-cyan-300">{badge.power.name}</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 text-xs font-bold">
                    +{badge.powerBoost}%
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{badge.power.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Owner: {badge.seller.slice(0, 8)}...
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {badge.category}
                  </Badge>
                </span>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                <div>
                  <span className="text-2xl font-bold text-white">{badge.price}</span>
                  <div className="text-xs text-slate-400">≈ $24.50 USD</div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  onClick={() => handlePurchase(badge)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ซื้อ
                </Button>
              </div>

              {/* MeeBot Quote */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-300">MeeBot แนะนำ</span>
                </div>
                <p className="text-xs text-gray-300">{getMeeBotRecommendation(badge)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MeeBot Marketplace Tips */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-cyan-300 mb-1">🛒 MeeBot Marketplace Tips</h3>
              <p className="text-sm text-gray-300">
                Badge ที่มี Level สูงจะให้ Power Boost มากขึ้น! MYTHIC badge สามารถอัปเกรดได้ถึง Level 15 และให้พลังสูงสุด! 
                ใช้ Power ในระบบ Quest เพื่อลด Cooldown และเพิ่ม XP ได้! ⚡🏆
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
              onClick={() => {
                toast({
                  title: "🎮 RPG Guide",
                  description: "เรียนรู้วิธีใช้ Badge Power และ Upgrade System ครับ! 📚",
                });
              }}
            >
              <Sword className="w-4 h-4 mr-2" />
              RPG Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
