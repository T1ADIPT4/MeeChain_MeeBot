
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Star, Zap, ArrowUp, Sparkles } from 'lucide-react';
import { useSmartContracts } from '@/hooks/use-smart-contracts';
import { useToast } from '@/hooks/use-toast';

interface BadgeData {
  tokenId: number;
  name: string;
  description: string;
  power: string;
  level: number;
  maxLevel: number;
  rarity: number;
  category: number;
  mintedAt: number;
  originalOwner: string;
  isQuestReward: boolean;
  questId: string;
  powerBoost: number;
  isUpgradeable: boolean;
}

interface BadgeViewerProps {
  userAddress?: string;
}

export default function BadgeViewer({ userAddress }: BadgeViewerProps) {
  const { service, isConnected } = useSmartContracts();
  const { toast } = useToast();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (service && userAddress) {
      loadUserBadges();
    }
  }, [service, userAddress]);

  const loadUserBadges = async () => {
    if (!service || !userAddress) return;
    
    setIsLoading(true);
    try {
      const userBadges = await service.getUserBadges(userAddress);
      setBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
      toast({
        title: "🤖 MeeBot เสียใจ",
        description: "ไม่สามารถโหลด badges ได้ครับ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeBadge = async (tokenId: number) => {
    if (!service) return;
    
    setIsUpgrading(true);
    try {
      // Check if badge can be upgraded first
      const userAddress = await service.getCurrentAddress();
      if (!userAddress) {
        toast({
          title: "❌ เชื่อมต่อ Wallet",
          description: "กรุณาเชื่อมต่อ wallet ก่อนครับ",
          variant: "destructive",
        });
        return;
      }
      
      const { canUpgrade, reason } = await service.canUpgradeBadge(tokenId, userAddress);
      if (!canUpgrade) {
        toast({
          title: "❌ ไม่สามารถอัปเกรดได้",
          description: `MeeBot: ${reason}`,
          variant: "destructive",
        });
        return;
      }
      
      // Get upgrade cost
      const upgradeCost = await service.getBadgeUpgradeCost(tokenId);
      if (upgradeCost) {
        toast({
          title: "💰 ค่าใช้จ่ายในการอัปเกรด",
          description: `ใช้ ${upgradeCost} MEE tokens`,
          variant: "default",
        });
      }
      
      const txHash = await service.upgradeBadgeRarity(tokenId);
      if (txHash) {
        toast({
          title: "🎉 MeeBot ยินดี!",
          description: "อัปเกรด badge สำเร็จแล้วครับ! ระดับความหายากเพิ่มขึ้นแล้ว! 🔥",
          variant: "default",
        });
        await loadUserBadges(); // Reload badges
        setSelectedBadge(null);
      }
    } catch (error) {
      toast({
        title: "❌ MeeBot เสียใจ",
        description: "ไม่สามารถอัปเกรด badge ได้ครับ ลองใหม่อีกครั้งนะ",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleActivatePower = async (tokenId: number) => {
    if (!service) return;
    
    try {
      const txHash = await service.activateBadgePower(tokenId);
      if (txHash) {
        toast({
          title: "⚡ พลังถูกเปิดใช้!",
          description: "MeeBot: พลังพิเศษของคุณใช้งานได้แล้วครับ!",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "❌ เปิดใช้พลังไม่สำเร็จ",
        description: "MeeBot: มีปัญหาในการเปิดใช้พลังครับ",
        variant: "destructive",
      });
    }
  };

  const getRarityColor = (rarity: number) => {
    const colors = [
      'text-gray-400',    // COMMON
      'text-blue-400',    // RARE  
      'text-purple-400',  // EPIC
      'text-yellow-400',  // LEGENDARY
      'text-red-400'      // MYTHIC
    ];
    return colors[rarity] || colors[0];
  };

  const getRarityName = (rarity: number) => {
    const names = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
    return names[rarity] || 'Common';
  };

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">เชื่อม wallet เพื่อดู badges ของคุณ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            My Badge Collection
            <Badge variant="outline" className="ml-auto">
              {badges.length} badges
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400">กำลังโหลด badges...</p>
            </div>
          ) : badges.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 mb-2">ยังไม่มี badges</p>
              <p className="text-xs text-slate-500">ทำภารกิจเพื่อปลดล็อก badges ใหม่!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.tokenId}
                  onClick={() => setSelectedBadge(badge)}
                  className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-blue-500/50 cursor-pointer transition-all group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{badge.name}</h4>
                    <div className={`text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                      {getRarityName(badge.rarity)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-400">Lv.{badge.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-blue-300 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {selectedBadge?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBadge && (
            <div className="space-y-4">
              {/* Badge Visual */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <Badge className={getRarityColor(selectedBadge.rarity)}>
                  {getRarityName(selectedBadge.rarity)}
                </Badge>
              </div>

              {/* Badge Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <p className="text-gray-400 text-sm">{selectedBadge.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Power</label>
                    <div className="flex items-center gap-1 text-sm text-blue-400">
                      <Zap className="w-3 h-3" />
                      {selectedBadge.power}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Boost</label>
                    <div className="text-sm text-green-400">+{selectedBadge.powerBoost}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Level</label>
                    <div className="text-sm text-white">{selectedBadge.level} / {selectedBadge.maxLevel}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Token ID</label>
                    <div className="text-sm text-gray-400">#{selectedBadge.tokenId}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleActivatePower(selectedBadge.tokenId)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Activate Power
                </Button>
                
                {selectedBadge.isUpgradeable && selectedBadge.level < selectedBadge.maxLevel && (
                  <Button
                    onClick={() => handleUpgradeBadge(selectedBadge.tokenId)}
                    disabled={isUpgrading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    {isUpgrading ? 'Upgrading...' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
