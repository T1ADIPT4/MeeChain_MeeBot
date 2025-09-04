import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  Download, 
  History, 
  QrCode, 
  Settings,
  Eye,
  EyeOff,
  Copy,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@/lib/web3-utils';
import { QRCodeGenerator } from '@/components/web3/qr-code-generator';
import logoUrl from '@assets/branding/logo.png';

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const [showBalance, setShowBalance] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  // Fetch user wallet data
  const { data: walletData, isLoading } = useQuery({
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

  // Fetch token balances  
  const { data: balances } = useQuery({
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

  const handleCopyAddress = async () => {
    if (!walletData?.address) return;
    
    try {
      await navigator.clipboard.writeText(walletData.address);
      toast({
        title: "คัดลอกแล้ว",
        description: "ที่อยู่ Wallet ถูกคัดลอกแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถคัดลอกที่อยู่ได้",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="MeeChain" className="w-10 h-10" />
          <h1 className="text-xl font-bold">MeeChain Wallet</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/settings')}
          data-testid="button-settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Wallet Address Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-white">
              <span>ที่อยู่ Wallet</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQR(!showQR)}
                data-testid="button-show-qr"
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="font-mono text-sm bg-white/20 px-3 py-2 rounded flex-1">
                {walletData?.address ? truncateAddress(walletData.address) : 'ไม่พบที่อยู่'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                data-testid="button-copy-address"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            {showQR && walletData?.address && (
              <div className="mt-4">
                <QRCodeGenerator 
                  value={walletData.address}
                  title="ที่อยู่ Wallet"
                  size={150}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-white">
              <span>ยอดคงเหลือ</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                data-testid="button-toggle-balance"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {balances?.tokens?.map((token: any) => (
                <div key={token.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">
                      {showBalance ? `${parseFloat(token.balance).toFixed(4)}` : '••••'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {token.symbol}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-4">
                  ยังไม่มีโทเค็นในกระเป๋า
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 h-16"
            onClick={() => navigate('/receive')}
            data-testid="button-receive"
          >
            <div className="text-center">
              <Download className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">รับโทเค็น</span>
            </div>
          </Button>
          
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 h-16"
            onClick={() => navigate('/send')}
            data-testid="button-send"
          >
            <div className="text-center">
              <Send className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">ส่งโทเค็น</span>
            </div>
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10 h-16"
            onClick={() => navigate('/history')}
            data-testid="button-history"
          >
            <div className="text-center">
              <History className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">ประวัติ</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10 h-16"
            onClick={() => navigate('/faucet')}
            data-testid="button-faucet"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">รับโทเค็นฟรี</span>
            </div>
          </Button>
        </div>

        {/* Network Status */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">เครือข่าย</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Polygon
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}