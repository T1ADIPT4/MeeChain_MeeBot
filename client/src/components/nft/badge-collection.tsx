import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, 
  Star, 
  Crown, 
  Gem, 
  Zap, 
  Target, 
  ShoppingCart,
  Sparkles,
  Heart,
  Moon,
  Sun 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Badge as BadgeType, BadgePower } from '@shared/schema';

// Mock badge data - in real app would come from API
const mockBadges: (BadgeType & { 
  equippedSlot?: number; 
  powers?: BadgePower[];
})[] = [
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'One of the first 1000 users on MeeChain',
    imageUrl: '🚀',
    rarity: 'Legendary',
    category: 'special',
    isNFT: true,
    contractAddress: '0x123...',
    tokenId: '1',
    powers: [
      {
        type: 'xp_boost',
        value: 15,
        description: 'เพิ่ม XP 15% จากทุกภารกิจ'
      }
    ],
    isActive: true,
    createdAt: new Date(),
    equippedSlot: 1
  },
  {
    id: 'quest-master',
    name: 'Quest Master',
    description: 'Complete 50 daily quests',
    imageUrl: '🎯',
    rarity: 'Rare',
    category: 'achievement',
    isNFT: false,
    contractAddress: null,
    tokenId: null,
    powers: [
      {
        type: 'xp_boost',
        value: 10,
        condition: 'night_quest',
        description: 'เพิ่ม XP 10% เมื่อทำภารกิจกลางคืน'
      }
    ],
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'voice-coach-user',
    name: 'Voice Coach User',
    description: 'Used MeeBot Voice Coach 100 times',
    imageUrl: '🎤',
    rarity: 'Common',
    category: 'achievement',
    isNFT: false,
    contractAddress: null,
    tokenId: null,
    powers: [
      {
        type: 'special_access',
        value: 1,
        description: 'ปลดล็อคคำพูดให้กำลังใจพิเศษ'
      }
    ],
    isActive: true,
    createdAt: new Date(),
    equippedSlot: 2
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete quests after midnight',
    imageUrl: '🦉',
    rarity: 'Rare',
    category: 'quest',
    isNFT: false,
    contractAddress: null,
    tokenId: null,
    powers: [
      {
        type: 'token_boost',
        value: 5,
        condition: 'night_quest',
        description: 'เพิ่มโทเค็นรางวัล 5% เมื่อทำภารกิจกลางคืน'
      }
    ],
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'seasonal-spring',
    name: 'Spring Bloom',
    description: 'Limited edition spring badge',
    imageUrl: '🌸',
    rarity: 'Legendary',
    category: 'season',
    isNFT: true,
    contractAddress: '0x456...',
    tokenId: '25',
    powers: [
      {
        type: 'quest_unlock',
        value: 1,
        description: 'ปลดล็อคภารกิจพิเศษฤดูใบไม้ผลิ'
      }
    ],
    isActive: true,
    createdAt: new Date()
  }
];

interface BadgeCollectionProps {
  onMarketplaceClick?: () => void;
}

export function BadgeCollection({ onMarketplaceClick }: BadgeCollectionProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'rare': 
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'common':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return <Crown className="w-3 h-3" />;
      case 'rare':
        return <Gem className="w-3 h-3" />;
      case 'common':
        return <Star className="w-3 h-3" />;
      default:
        return <Trophy className="w-3 h-3" />;
    }
  };

  const formatPowerDescription = (power: BadgePower) => {
    let desc = power.description;
    if (power.condition) {
      const conditionText = power.condition === 'night_quest' ? ' (กลางคืน)' : '';
      desc += conditionText;
    }
    return desc;
  };

  const equippedBadges = mockBadges.filter(badge => badge.equippedSlot);
  const unequippedBadges = mockBadges.filter(badge => !badge.equippedSlot);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold">🧠 Badge & NFT Zone</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onMarketplaceClick}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/30 hover:from-purple-500/20 hover:to-blue-500/20"
          data-testid="button-marketplace"
        >
          <ShoppingCart className="w-4 h-4" />
          ไปตลาด
        </Button>
      </div>

      {/* Equipped Badges Section */}
      {equippedBadges.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200/50 dark:border-yellow-700/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              เครื่องประดับที่สวมใส่
              <Badge variant="secondary" className="text-xs">
                ใช้งานอยู่
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {equippedBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="relative p-3 rounded-lg border-2 border-yellow-300/50 dark:border-yellow-700/50 bg-white/50 dark:bg-gray-800/50 cursor-pointer hover:shadow-md transition-all group"
                        data-testid={`badge-equipped-${badge.id}`}
                      >
                        {/* Equipped Indicator */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        
                        <div className="text-center space-y-2">
                          <div className="text-2xl mb-1">{badge.imageUrl}</div>
                          <div className="text-xs font-medium truncate">{badge.name}</div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs flex items-center gap-1 w-full justify-center",
                              getRarityColor(badge.rarity)
                            )}
                          >
                            {getRarityIcon(badge.rarity)}
                            {badge.rarity}
                          </Badge>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {badge.description}
                        </div>
                        {badge.powers && badge.powers.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              🌟 พลังพิเศษ:
                            </div>
                            {badge.powers.map((power, idx) => (
                              <div key={idx} className="text-xs text-green-600 dark:text-green-400">
                                • {formatPowerDescription(power)}
                              </div>
                            ))}
                          </div>
                        )}
                        {badge.isNFT && (
                          <div className="text-xs text-purple-600 dark:text-purple-400">
                            🔗 NFT • {badge.tokenId}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Badge Collection
            <Badge variant="outline" className="text-xs">
              {mockBadges.length} รายการ
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {unequippedBadges.map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="relative p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer hover:shadow-md transition-all group bg-white dark:bg-gray-800"
                      data-testid={`badge-collection-${badge.id}`}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                          {badge.imageUrl}
                        </div>
                        <div className="text-xs font-medium truncate">{badge.name}</div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs flex items-center gap-1 w-full justify-center",
                            getRarityColor(badge.rarity)
                          )}
                        >
                          {getRarityIcon(badge.rarity)}
                          {badge.rarity}
                        </Badge>
                        
                        {badge.isNFT && (
                          <div className="absolute top-1 right-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full opacity-80"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-2">
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {badge.description}
                      </div>
                      {badge.powers && badge.powers.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            🌟 NFT Powers:
                          </div>
                          {badge.powers.map((power, idx) => (
                            <div key={idx} className="text-xs text-green-600 dark:text-green-400">
                              • {formatPowerDescription(power)}
                            </div>
                          ))}
                        </div>
                      )}
                      {badge.isNFT && (
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          🔗 NFT • Token #{badge.tokenId}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {unequippedBadges.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ยังไม่มี Badge ในคอลเลกชัน</p>
              <p className="text-sm">ทำภารกิจเพื่อรับ Badge ใหม่!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rarity Legend */}
      <Card className="bg-gray-50/50 dark:bg-gray-900/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Common</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-300">Rare</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-300">Legendary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">NFT</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}