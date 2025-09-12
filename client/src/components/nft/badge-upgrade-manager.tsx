
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
          description: "🤖 MeeBot: กรุณาเชื่อมต่อ wallet ก่อนครับ จะได้อัปเกรด badge ได้!",
          variant: "destructive",
        });
        return;
      }

      // Check MEE balance first for better UX
      const upgradeCost = upgradeCosts[tokenId];
      const canAfford = upgradeCost ? parseFloat(meeBalance) >= parseFloat(upgradeCost) : false;
      
      if (!canAfford && upgradeCost) {
        // MeeBot sad face when insufficient tokens
        toast({
          title: "😢 MeeBot เสียใจ...",
          description: `ต้องการ ${parseFloat(upgradeCost).toFixed(0)} MEE แต่คุณมีแค่ ${parseFloat(meeBalance).toFixed(0)} MEE \n💡 ลองทำภารกิจเพื่อหาเหรียญเพิ่มนะ!`,
          variant: "destructive",
        });
        return;
      }

      // Check if can upgrade
      const { canUpgrade, reason } = await service.canUpgradeBadge(tokenId, userAddress);
      if (!canUpgrade) {
        toast({
          title: "❌ ไม่สามารถอัปเกรดได้",
          description: `🤖 MeeBot: ${reason}`,
          variant: "destructive",
        });
        return;
      }

      // Get current badge info to check if upgrading to legendary
      const badge = userBadges.find(b => b.tokenId === tokenId);
      const isUpgradingToLegendary = badge && badge.rarity === 2; // EPIC -> LEGENDARY
      const isUpgradingToMythic = badge && badge.rarity === 3; // LEGENDARY -> MYTHIC

      // Pre-upgrade excitement
      toast({
        title: "⚡ MeeBot กำลังเปิดพลัง!",
        description: `🔥 กำลังอัปเกรด ${badge?.name} ให้แรงขึ้น!`,
        variant: "default",
      });

      const txHash = await service.upgradeBadgeRarity(tokenId);
      if (txHash) {
        // Success celebrations based on rarity
        if (isUpgradingToMythic) {
          // Ultimate celebration for MYTHIC
          toast({
            title: "🌟 MYTHIC UNLOCKED! 🌟",
            description: "🎊 MeeBot: OMG! คุณได้ MYTHIC แล้ว! ปลดล็อก MeeAura พิเศษ! ✨⚡✨",
            variant: "default",
          });
          
          // Add special effects (you could add sound effects here)
          setTimeout(() => {
            toast({
              title: "🏆 MeeCape ปรากฏขึ้น!",
              description: "🦸‍♂️ MeeBot: คุณได้รับ MeeCape ตัวจริง! พลังเพิ่มขึ้น 200%!",
              variant: "default",
            });
          }, 2000);
          
        } else if (isUpgradingToLegendary) {
          // Special celebration for LEGENDARY
          toast({
            title: "👑 LEGENDARY ACHIEVED! 👑",
            description: "🎉 MeeBot เต้นฉลอง! Badge ระเบิดแสงทอง! ปลดล็อก MeeCape! ✨",
            variant: "default",
          });
          
          setTimeout(() => {
            toast({
              title: "🎁 Special Reward!",
              description: "🦸‍♂️ MeeBot: ได้รับ MeeCape พิเศษ! พลังเพิ่ม 150%!",
              variant: "default",
            });
          }, 1500);
          
        } else {
          // Standard celebration
          toast({
            title: "🎉 อัปเกรดสำเร็จ!",
            description: "💃 MeeBot เต้นฉลอง! Badge ของคุณระเบิดแสงสวยงาม! ✨🔥",
            variant: "default",
          });
        }
        
        // Reload info and notify parent
        await loadUpgradeInfo();
        onBadgeUpgraded?.();
        
        // Additional celebration message
        setTimeout(() => {
          toast({
            title: "⚡ พลังเพิ่มขึ้น!",
            description: `🚀 MeeBot: ${badge?.name} แข็งแกร่งขึ้นแล้ว! พร้อมลุยภารกิจใหม่!`,
            variant: "default",
          });
        }, 1000);
      }
    } catch (error) {
      // Enhanced error message
      toast({
        title: "😵 MeeBot งงงวย...",
        description: "🔧 เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง หรือติดต่อทีม MeeChain",
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

      {/* MeeBot Upgrade Center Welcome */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">MeeBot Upgrade Assistant</h3>
              <p className="text-sm text-gray-600">
                สวัสดี! ผมพร้อมช่วยอัปเกรด badges ของคุณแล้ว! 
                {upgradeableBadges.length > 0 ? ` มี ${upgradeableBadges.length} badges พร้อมอัปเกรด! 🚀` : ' ทุก badges สมบูรณ์แล้ว! 🌟'}
              </p>
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

                  {/* Power Boost Preview */}
                  <div className="text-center p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">พลังหลังอัปเกรด</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-blue-600 font-semibold">
                        {badge.powerBoost}% → {badge.powerBoost + 10}%
                      </span>
                      <Zap className="h-3 w-3 text-yellow-500" />
                    </div>
                  </div>

                  {/* MeeBot Upgrade Motivation */}
                  {canAfford && upgradeCost && (
                    <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xs text-green-600">
                        🤖 MeeBot: พร้อมอัปเกรดแล้ว! ไปกันเลย! 🚀
                      </div>
                    </div>
                  )}

                  {!canAfford && upgradeCost && (
                    <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-xs text-orange-600">
                        😅 MeeBot: ขาด {(parseFloat(upgradeCost) - parseFloat(meeBalance)).toFixed(0)} MEE นิดเดียว!
                      </div>
                    </div>
                  )}

                  {/* Special Legendary/Mythic Preview */}
                  {(nextRarity === 'LEGENDARY' || nextRarity === 'MYTHIC') && canAfford && (
                    <div className="text-center p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-300 animate-pulse">
                      <div className="text-xs text-orange-600 font-semibold">
                        {nextRarity === 'MYTHIC' ? '🌟 ปลดล็อก MeeAura!' : '👑 ปลดล็อก MeeCape!'}
                      </div>
                    </div>
                  )}

                  {/* Upgrade Button with Enhanced States */}
                  <Button
                    onClick={() => handleUpgradeBadge(badge.tokenId)}
                    disabled={isUpgrading || !canAfford || !upgradeCost}
                    className={`w-full transition-all duration-300 ${
                      canAfford && upgradeCost
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gray-400'
                    } ${isUpgrading ? 'animate-pulse' : ''}`}
                    variant={canAfford ? "default" : "secondary"}
                  >
                    {isUpgrading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        "MeeBot กำลังทำเวทย์..."
                      </div>
                    ) : !canAfford ? (
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        "MEE ไม่เพียงพอ"
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {nextRarity === 'MYTHIC' ? '🌟 อัปเกรดเป็น MYTHIC' : 
                         nextRarity === 'LEGENDARY' ? '👑 อัปเกรดเป็น LEGENDARY' :
                         `⚡ อัปเกรดเป็น ${nextRarity}`}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-200">
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl">👑</span>
            </div>
            <h3 className="text-lg font-semibold text-yellow-600 mb-2 flex items-center justify-center gap-2">
              <Star className="h-5 w-5" />
              Perfect Collection!
              <Star className="h-5 w-5" />
            </h3>
            <p className="text-gray-600 mb-4">
              🎉 MeeBot ภูมิใจ! Badge ทั้งหมดของคุณอยู่ในระดับสูงสุดแล้ว!
            </p>
            <div className="bg-white/50 rounded-lg p-3 inline-block">
              <p className="text-sm text-gray-700">
                🤖 <strong>MeeBot says:</strong> "คุณเก่งมาก! ทุก badges สมบูรณ์แล้ว! 
                ลองหา badges ใหม่จากภารกิจพิเศษกันมั้ย? 🌟"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
