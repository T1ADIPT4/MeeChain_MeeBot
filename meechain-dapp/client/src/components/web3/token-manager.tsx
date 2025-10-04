import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  Send, 
  Flame, 
  Wallet, 
  TrendingUp,
  Copy,
  ExternalLink,
  RefreshCw,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { web3Service, QUEST_REWARDS, PURCHASE_COSTS, formatTokenAmount, parseTokenAmount, type TokenBalance } from '@/services/web3-service';

interface TokenManagerProps {
  className?: string;
}

export function TokenManager({ className }: TokenManagerProps) {
  const { toast } = useToast();
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [burnPurpose, setBurnPurpose] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    setLoading(true);
    try {
      const initialized = await web3Service.initialize();
      setIsConnected(web3Service.isWalletConnected());
      
      if (initialized) {
        const address = await web3Service.getCurrentAddress();
        setWalletAddress(address);
        await refreshBalance();
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      toast({
        title: "โหมดสาธิต",
        description: "ระบบทำงานในโหมดสาธิต (ไม่ได้เชื่อมต่อ blockchain จริง)",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    try {
      const tokenBalance = await web3Service.getTokenBalance();
      setBalance(tokenBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferAddress) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกที่อยู่และจำนวนโทเค็นที่ต้องการส่ง",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const amount = parseTokenAmount(transferAmount);
      const result = await web3Service.transferTokens(transferAddress, amount);
      
      if (result.success) {
        toast({
          title: "✅ ส่งโทเค็นสำเร็จ!",
          description: `ส่ง ${transferAmount} MEE ไปยัง ${transferAddress.slice(0, 6)}...${transferAddress.slice(-4)}`,
        });
        setTransferAmount('');
        setTransferAddress('');
        await refreshBalance();
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (error: any) {
      toast({
        title: "❌ การส่งล้มเหลว",
        description: error.message || "เกิดข้อผิดพลาดในการส่งโทเค็น",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBurn = async () => {
    if (!burnAmount || !burnPurpose) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกจำนวนและวัตถุประสงค์ในการเผาโทเค็น",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const amount = parseTokenAmount(burnAmount);
      const result = await web3Service.burnForPurchase(amount, burnPurpose);
      
      if (result.success) {
        toast({
          title: "🔥 เผาโทเค็นสำเร็จ!",
          description: `เผา ${burnAmount} MEE เพื่อ ${burnPurpose}`,
        });
        setBurnAmount('');
        setBurnPurpose('');
        await refreshBalance();
      } else {
        throw new Error(result.error || 'Burn failed');
      }
    } catch (error: any) {
      toast({
        title: "❌ การเผาล้มเหลว",
        description: error.message || "เกิดข้อผิดพลาดในการเผาโทเค็น",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "📋 คัดลอกแล้ว",
        description: "คัดลอกที่อยู่กระเป๋าเงินแล้ว",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header & Balance */}
      <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200/50 dark:border-blue-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-500" />
            🪙 MeeToken Manager
            {!isConnected && (
              <Badge variant="secondary" className="text-xs">
                โหมดสาธิต
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Info */}
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">ยอดเงินคงเหลือ</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-token-balance">
                {balance ? `${parseFloat(balance.formatted).toFixed(2)} MEE` : '0.00 MEE'}
              </div>
              {walletAddress && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Wallet className="w-4 h-4" />
                  <span>{formatAddress(walletAddress)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                    data-testid="button-copy-address"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshBalance}
              disabled={loading}
              className="flex items-center gap-2"
              data-testid="button-refresh-balance"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              รีเฟรช
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries({
              'Voice Coach': QUEST_REWARDS.VOICE_COACH,
              'Daily Quest': QUEST_REWARDS.DAILY_QUEST,
              'Badge Achievement': QUEST_REWARDS.BADGE_ACHIEVEMENT,
              'Special Mission': QUEST_REWARDS.SPECIAL_MISSION
            }).map(([name, amount]) => (
              <div
                key={name}
                className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-lg text-center"
              >
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {name}
                </div>
                <div className="text-sm font-bold text-green-700 dark:text-green-300">
                  +{formatTokenAmount(amount)} MEE
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            การจัดการโทเค็น
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transfer" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                ส่งโทเค็น
              </TabsTrigger>
              <TabsTrigger value="burn" className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                เผาโทเค็น
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transfer" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="transfer-address">ที่อยู่ปลายทาง</Label>
                  <Input
                    id="transfer-address"
                    placeholder="0x..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    data-testid="input-transfer-address"
                  />
                </div>
                <div>
                  <Label htmlFor="transfer-amount">จำนวน MEE</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="0.0"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    data-testid="input-transfer-amount"
                  />
                </div>
                <Button
                  onClick={handleTransfer}
                  disabled={loading || !transferAmount || !transferAddress}
                  className="w-full"
                  data-testid="button-transfer-tokens"
                >
                  {loading ? "กำลังส่ง..." : "ส่งโทเค็น"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="burn" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="burn-amount">จำนวน MEE ที่ต้องการเผา</Label>
                  <Input
                    id="burn-amount"
                    type="number"
                    placeholder="0.0"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    data-testid="input-burn-amount"
                  />
                </div>
                <div>
                  <Label htmlFor="burn-purpose">วัตถุประสงค์</Label>
                  <Textarea
                    id="burn-purpose"
                    placeholder="เช่น ซื้อ NFT Badge, อัปเกรด Badge"
                    value={burnPurpose}
                    onChange={(e) => setBurnPurpose(e.target.value)}
                    data-testid="input-burn-purpose"
                  />
                </div>
                <Button
                  onClick={handleBurn}
                  disabled={loading || !burnAmount || !burnPurpose}
                  variant="destructive"
                  className="w-full"
                  data-testid="button-burn-tokens"
                >
                  {loading ? "กำลังเผา..." : "เผาโทเค็น"}
                </Button>
              </div>

              {/* Purchase Costs Reference */}
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/30 rounded-lg">
                <div className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                  💰 ราคาซื้อ Badge & NFT:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Common Badge: {formatTokenAmount(PURCHASE_COSTS.COMMON_BADGE)} MEE</div>
                  <div>Rare Badge: {formatTokenAmount(PURCHASE_COSTS.RARE_BADGE)} MEE</div>
                  <div>Legendary Badge: {formatTokenAmount(PURCHASE_COSTS.LEGENDARY_BADGE)} MEE</div>
                  <div>Badge Upgrade: {formatTokenAmount(PURCHASE_COSTS.BADGE_UPGRADE)} MEE</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}