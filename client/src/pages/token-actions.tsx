import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Coins, Vault, Plus, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { mintToken, depositToken, getTokenBalance, switchToFuseNetwork } from '@/lib/token-actions';
import { TOKEN_ADDRESSES } from '@/lib/swap-bridge';
import FuseNetworkHelper from '@/components/meebot/fuse-network-helper';
import { MeeBotFallbackCard } from '@/components/meebot/meebot-fallback-card';
import logoUrl from '@assets/branding/logo.png';
import WalletConnectHelper from '@/components/meebot/wallet-connect-helper';

export default function TokenActionsPage() {
  const [location, navigate] = useLocation();
  const [mintAddress, setMintAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [depositToken_, setDepositToken] = useState('MEE');
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState('');
  const [isWalletConnect, setIsWalletConnect] = useState(false);
  const { toast } = useToast();

  // Fetch user wallet data
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet/me'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch wallet');
      }
      return response.json();
    },
  });

  const detectWalletType = () => {
    // ตรวจสอบว่าเป็น WalletConnect หรือไม่
    if (window.ethereum && window.ethereum.isWalletConnect) {
      setIsWalletConnect(true);
    }
  };

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      setCurrentChainId(chainId);

      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
        await updateBalance(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const updateBalance = async (address: string) => {
    try {
      const tokenAddress = TOKEN_ADDRESSES[depositToken_ as keyof typeof TOKEN_ADDRESSES];
      const newBalance = await getTokenBalance(tokenAddress, address, 122);
      setBalance(newBalance);
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };


  const handleMint = async () => {
    if (!mintAddress || !mintAmount) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "โปรดกรอกที่อยู่และจำนวนโทเค็น",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(mintAmount) <= 0) {
      toast({
        title: "จำนวนไม่ถูกต้อง",
        description: "โปรดกรอกจำนวนมากกว่า 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTxHash(null);

    try {
      const hash = await mintToken(mintAddress, mintAmount);
      setTxHash(hash);

      toast({
        title: "Mint สำเร็จ! 🎉",
        description: `Transaction Hash: ${hash.slice(0, 10)}...`,
      });

      // Reset form
      setMintAddress('');
      setMintAmount('');
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถ mint ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositToken_ || !depositAmount) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "โปรดเลือกโทเค็นและกรอกจำนวน",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(depositAmount) <= 0) {
      toast({
        title: "จำนวนไม่ถูกต้อง",
        description: "โปรดกรอกจำนวนมากกว่า 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTxHash(null);

    try {
      const tokenAddress = TOKEN_ADDRESSES[depositToken_ as keyof typeof TOKEN_ADDRESSES];
      const hash = await depositToken(tokenAddress, depositAmount);
      setTxHash(hash);

      toast({
        title: "Deposit สำเร็จ! 🎉",
        description: `Transaction Hash: ${hash.slice(0, 10)}...`,
      });

      // Reset form
      setDepositAmount('');
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถ deposit ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkChanged = () => {
    checkWalletConnection();
    toast({
      title: "เปลี่ยนเครือข่ายสำเร็จ! 🎉",
      description: "ตอนนี้คุณสามารถใช้งาน Token Actions ได้แล้ว",
    });
  };

  const tokens = Object.keys(TOKEN_ADDRESSES);
  const isCorrectNetwork = currentChainId === "0x7A"; // Fuse Network Chain ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="MeeChain" className="w-8 h-8" />
          <h1 className="text-xl font-bold">Token Actions</h1>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        
        {/* Network Helper */}
        {!isCorrectNetwork && (
          <WalletConnectHelper
            targetChainId={"0x7A"}
            onNetworkChanged={handleNetworkChanged}
            isWalletConnect={isWalletConnect}
          />
        )}

        {/* Mint Token Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Plus className="w-5 h-5" />
              Mint Token (Owner Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">ที่อยู่ผู้รับ</Label>
              <Input
                placeholder="0x..."
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">จำนวนโทเค็น</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>

            <Button
              onClick={handleMint}
              disabled={isLoading || !mintAddress || !mintAmount}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isLoading ? "กำลัง Mint..." : "Mint Token"}
            </Button>
          </CardContent>
        </Card>

        {/* Deposit Token Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Vault className="w-5 h-5" />
              Deposit Token
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">เลือกโทเค็น</Label>
              <Select value={depositToken_} onValueChange={setDepositToken}>
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
            </div>

            <div className="space-y-2">
              <Label className="text-white">จำนวนโทเค็น</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>

            <Button
              onClick={handleDeposit}
              disabled={isLoading || !depositToken_ || !depositAmount}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "กำลัง Deposit..." : `Deposit ${depositToken_}`}
            </Button>
          </CardContent>
        </Card>

        {/* Transaction Result */}
        {txHash && (
          <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-green-400 font-semibold mb-2">Transaction Successful!</div>
                <div className="text-sm text-white/70 break-all">
                  TX Hash: {txHash}
                </div>
                <a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline mt-2 inline-block"
                >
                  ดูใน Block Explorer
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fuse Network Helper */}
        <FuseNetworkHelper />

        {/* MeeBot Status */}
        <MeeBotFallbackCard />

        {/* Info Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-sm text-white/70 space-y-2">
              <div className="flex items-center gap-2 text-yellow-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">ข้อมูลสำคัญ</span>
              </div>
              <div>• Mint function สามารถใช้ได้เฉพาะ Owner ของ Contract เท่านั้น</div>
              <div>• Deposit จะต้อง approve token ก่อนการ deposit</div>
              <div>• ตรวจสอบ Contract Address ให้ถูกต้องก่อนใช้งาน</div>
              <div>• ค่า Gas จะถูกคิดตามเครือข่ายที่ใช้งาน</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}