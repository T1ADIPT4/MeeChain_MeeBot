import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRightLeft, GitBranch, Repeat, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { TOKEN_ADDRESSES, CHAIN_OPTIONS, swapOrBridgeToken, getSwapQuote } from '@/lib/swap-bridge';
import logoUrl from '@assets/branding/logo.png';
import { LoadingSpinner, LoadingDots } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';

export default function SwapBridge() {
  const [location, navigate] = useLocation();
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('MEE');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'swap' | 'bridge'>('swap');
  const [targetChain, setTargetChain] = useState('122');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState('0');
  const { toast } = useToast();
  const [contractConfigured, setContractConfigured] = useState(false);

  // Check contract configuration on mount
  useEffect(() => {
    checkContractConfiguration();
  }, []);

  const checkContractConfiguration = async () => {
    try {
      const response = await fetch('/api/swap-bridge/config');
      if (response.ok) {
        const config = await response.json();
        setContractConfigured(config.configured || false);
      } else {
        setContractConfigured(false);
        toast({
          title: "⚠️ การตั้งค่าไม่สมบูรณ์",
          description: "กำลังใช้ contract address เริ่มต้น กรุณาตรวจสอบการตั้งค่า",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Contract config check failed:', error);
      setContractConfigured(false);
    }
  };

  // Fetch user balances
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['/api/wallet/balances'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/balances', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch balances');
      }
      return response.json();
    },
  });

  // Get quote when amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (amount && fromToken && toToken && mode === 'swap') {
        try {
          const quoteAmount = await getSwapQuote(
            TOKEN_ADDRESSES[fromToken as keyof typeof TOKEN_ADDRESSES],
            TOKEN_ADDRESSES[toToken as keyof typeof TOKEN_ADDRESSES],
            amount
          );
          setQuote(quoteAmount);
        } catch (error) {
          setQuote('0');
        }
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [amount, fromToken, toToken, mode]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSubmit = async () => {
    if (!amount || !fromToken || !toToken) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "โปรดกรอกจำนวนและเลือกโทเค็น",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "จำนวนไม่ถูกต้อง",
        description: "โปรดกรอกจำนวนมากกว่า 0",
        variant: "destructive",
      });
      return;
    }

    // Check if wallet is connected
    if (!window.ethereum) {
      toast({
        title: "ไม่พบ Wallet",
        description: "กรุณาติดตั้งและเชื่อมต่อ MetaMask หรือ wallet อื่น ๆ",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if contract is configured
      if (!contractConfigured) {
        toast({
          title: "⚠️ กำลังใช้ Demo Mode",
          description: "ระบบใช้ contract address เริ่มต้น จึงไม่สามารถทำธุรกรรมจริงได้",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('Starting swap/bridge:', {
        fromToken,
        toToken,
        amount,
        mode,
        targetChain: mode === 'bridge' ? targetChain : undefined
      });

      const result = await swapOrBridgeToken(
        TOKEN_ADDRESSES[fromToken as keyof typeof TOKEN_ADDRESSES],
        TOKEN_ADDRESSES[toToken as keyof typeof TOKEN_ADDRESSES],
        amount,
        mode === 'bridge' ? targetChain : undefined
      );

      const txHash = typeof result === 'string' ? result : result.txHash;
      
      toast({
        title: `${mode === 'swap' ? 'Swap' : 'Bridge'} สำเร็จ! 🎉`,
        description: `Transaction Hash: ${txHash.slice(0, 10)}...`,
      });

      // Reset form
      setAmount('');
      setQuote('0');

      // Navigate back after delay
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      console.error('Swap/Bridge error:', error);
      
      let errorMessage = "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง";
      
      if (error.message) {
        if (error.message.includes('User denied')) {
          errorMessage = "ผู้ใช้ปฏิเสธการทำธุรกรรม";
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = "ยอดเงินไม่เพียงพอ";
        } else if (error.message.includes('network')) {
          errorMessage = "เกิดปัญหาเครือข่าย กรุณาตรวจสอบการเชื่อมต่อ";
        } else if (error.message.includes('Wallet not found')) {
          errorMessage = "ไม่พบ wallet กรุณาเชื่อมต่อ wallet ก่อน";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "เกิดข้อผิดพลาด",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tokens = Object.keys(TOKEN_ADDRESSES);
  const selectedChain = CHAIN_OPTIONS.find(chain => chain.id === targetChain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-300">Swap & Bridge</h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={contractConfigured
              ? "border-green-500/50 text-green-300"
              : "border-yellow-500/50 text-yellow-300"
            }
          >
            {contractConfigured ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Configured
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Default Config
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'swap' ? 'default' : 'outline'}
            onClick={() => setMode('swap')}
            className="flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Swap
          </Button>
          <Button
            variant={mode === 'bridge' ? 'default' : 'outline'}
            onClick={() => setMode('bridge')}
            className="flex items-center gap-2"
          >
            <GitBranch className="w-4 h-4" />
            Bridge
          </Button>
        </div>

        {/* Swap/Bridge Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {mode === 'swap' ? (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Swap โทเค็น
                </>
              ) : (
                <>
                  <GitBranch className="w-5 h-5" />
                  Bridge โทเค็น
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <Label className="text-white">จาก</Label>
              <div className="flex gap-2">
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map(token => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwapTokens}
                className="rounded-full bg-white/20 hover:bg-white/30"
              >
                <Repeat className="w-5 h-5" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <Label className="text-white">ไป</Label>
              <div className="flex gap-2">
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map(token => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  value={mode === 'swap' ? quote : amount}
                  readOnly
                  className="bg-white/10 border-white/30 text-white/70"
                />
              </div>
            </div>

            {/* Target Chain (Bridge mode only) */}
            {mode === 'bridge' && (
              <div className="space-y-2">
                <Label className="text-white">เครือข่ายปลายทาง</Label>
                <Select value={targetChain} onValueChange={setTargetChain}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAIN_OPTIONS.map(chain => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quote Display */}
            {mode === 'swap' && amount && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-sm text-white/70">คุณจะได้รับ</div>
                <div className="text-lg font-bold text-green-400">
                  {quote} {toToken}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !amount}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                "กำลังดำเนินการ..."
              ) : (
                `${mode === 'swap' ? 'Swap' : 'Bridge'} ${fromToken} → ${toToken}`
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-sm text-white/70 space-y-2">
              <div className="flex justify-between">
                <span>ค่าธรรมเนียม:</span>
                <span>0.1%</span>
              </div>
              {mode === 'bridge' && (
                <div className="flex justify-between">
                  <span>เวลาที่ใช้:</span>
                  <span>~5-10 นาที</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ราคาต่อ Gas:</span>
                <span>Standard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}