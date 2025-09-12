
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Zap, Star, TrendingUp, Coins } from 'lucide-react';
import { useSmartContracts } from '@/hooks/use-smart-contracts';

interface BadgeUpgradeManagerProps {
  userBadges: any[];
  onBadgeUpgraded?: () => void;
}

const RARITY_NAMES = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
const RARITY_COLORS = {
  COMMON: 'bg-gray-500',
  RARE: 'bg-blue-500',
  EPIC: 'bg-purple-500',
  LEGENDARY: 'bg-orange-500',
  MYTHIC: 'bg-red-500'
};

export function BadgeUpgradeManager({ userBadges, onBadgeUpgraded }: BadgeUpgradeManagerProps) {
  const { toast } = useToast();
  const { service } = useSmartContracts();
  const [upgradingBadges, setUpgradingBadges] = useState<Set<number>>(new Set());
  const [upgradeCosts, setUpgradeCosts] = useState<Record<number, string>>({});
  const [meeBalance, setMeeBalance] = useState<string>('0');

  useEffect(() => {
    loadUpgradeInfo();
  }, [userBadges, service]);

  const loadUpgradeInfo = async () => {
    if (!service) return;

    try {
      // Get user's MEE balance
      const userAddress = await service.getCurrentAddress();
      if (userAddress) {
        const balance = await service.getMEEBalance(userAddress);
        setMeeBalance(balance);
      }

      // Get upgrade costs for each badge
      const costs: Record<number, string> = {};
      for (const badge of userBadges) {
        if (badge.rarity < 4) { // Not at max rarity
          try {
            const cost = await service.getBadgeUpgradeCost(badge.tokenId);
            if (cost) {
              costs[badge.tokenId] = cost;
            }
          } catch (error) {
            console.error(`Error getting cost for badge ${badge.tokenId}:`, error);
          }
        }
      }
      setUpgradeCosts(costs);
    } catch (error) {
      console.error('Error loading upgrade info:', error);
    }
  };

  const handleUpgradeBadge = async (tokenId: number) => {
    if (!service) return;

    setUpgradingBadges(prev => new Set(prev).add(tokenId));

    try {
      const userAddress = await service.getCurrentAddress();
      if (!userAddress) {
        toast({
          title: "❌ เชื่อมต่อ Wallet",
          description: "กรุณาเชื่อมต่อ wallet ก่อนครับ",
          variant: "destructive",
        });
        return;
      }

      // Check if can upgrade
      const { canUpgrade, reason } = await service.canUpgradeBadge(tokenId, userAddress);
      if (!canUpgrade) {
        toast({
          title: "❌ ไม่สามารถอัปเกรดได้",
          description: `MeeBot: ${reason}`,
          variant: "destructive",
        });
        return;
      }

      const txHash = await service.upgradeBadgeRarity(tokenId);
      if (txHash) {
        toast({
          title: "🎉 อัปเกรดสำเร็จ!",
          description: "MeeBot: Badge ของคุณอัปเกรดเป็นระดับที่สูงขึ้นแล้ว! 🔥",
          variant: "default",
        });
        
        // Reload info and notify parent
        await loadUpgradeInfo();
        onBadgeUpgraded?.();
      }
    } catch (error) {
      toast({
        title: "❌ อัปเกรดไม่สำเร็จ",
        description: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setUpgradingBadges(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  const getUpgradeableProgress = () => {
    const upgradeable = userBadges.filter(badge => badge.rarity < 4).length;
    const total = userBadges.length;
    return total > 0 ? (upgradeable / total) * 100 : 0;
  };

  const upgradeableBadges = userBadges.filter(badge => badge.rarity < 4);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            Badge Upgrade Center
          </CardTitle>
          <CardDescription>
            ใช้ MEE tokens เพื่ออัปเกรดระดับความหายากของ badge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-sm text-gray-600">MEE Balance</div>
                <div className="text-xl font-bold">{parseFloat(meeBalance).toFixed(2)} MEE</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-sm text-gray-600">Upgradeable Badges</div>
                <div className="text-xl font-bold">{upgradeableBadges.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Upgrade Progress</div>
                <Progress value={100 - getUpgradeableProgress()} className="w-full mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgradeable Badges */}
      {upgradeableBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upgradeableBadges.map((badge) => {
            const currentRarity = RARITY_NAMES[badge.rarity];
            const nextRarity = RARITY_NAMES[badge.rarity + 1];
            const upgradeCost = upgradeCosts[badge.tokenId];
            const isUpgrading = upgradingBadges.has(badge.tokenId);
            const canAfford = upgradeCost ? parseFloat(meeBalance) >= parseFloat(upgradeCost) : false;

            return (
              <Card key={badge.tokenId} className="border-2 hover:border-purple-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <Badge className={`${RARITY_COLORS[currentRarity]} text-white`}>
                      {currentRarity}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Level {badge.level} • Power: {badge.powerBoost}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upgrade Path */}
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={`${RARITY_COLORS[currentRarity]} text-white`}>
                      {currentRarity}
                    </Badge>
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <Badge className={`${RARITY_COLORS[nextRarity]} text-white`}>
                      {nextRarity}
                    </Badge>
                  </div>

                  {/* Upgrade Cost */}
                  {upgradeCost && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Upgrade Cost</div>
                      <div className={`text-lg font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(upgradeCost).toFixed(0)} MEE
                      </div>
                    </div>
                  )}

                  {/* Upgrade Button */}
                  <Button
                    onClick={() => handleUpgradeBadge(badge.tokenId)}
                    disabled={isUpgrading || !canAfford || !upgradeCost}
                    className="w-full"
                    variant={canAfford ? "default" : "secondary"}
                  >
                    {isUpgrading ? (
                      "กำลังอัปเกรด..."
                    ) : !canAfford ? (
                      "MEE ไม่เพียงพอ"
                    ) : (
                      `อัปเกรดเป็น ${nextRarity}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              ไม่มี Badge ที่สามารถอัปเกรดได้
            </h3>
            <p className="text-gray-500">
              Badge ทั้งหมดของคุณอยู่ในระดับสูงสุดแล้ว หรือไม่สามารถอัปเกรดได้
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
