import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@/lib/web3-utils';
import { QRCodeGenerator } from '@/components/web3/qr-code-generator';
import logoUrl from '@assets/branding/logo.png';

export default function ReceiveTokens() {
  const [location, navigate] = useLocation();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        กำลังโหลด...
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">รับโทเค็น</h1>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Instructions */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5" />
              วิธีรับโทเค็น
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ol className="list-decimal list-inside space-y-2">
              <li>แชร์ที่อยู่ Wallet หรือ QR Code ให้ผู้ส่ง</li>
              <li>ผู้ส่งโอนโทเค็นมาที่ที่อยู่นี้</li>
              <li>โทเค็นจะปรากฏในกระเป๋าของคุณภายในไม่กี่นาที</li>
            </ol>
          </CardContent>
        </Card>

        {/* Wallet Address */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">ที่อยู่ Wallet ของคุณ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="font-mono text-sm mb-2">
                {walletData?.address || 'ไม่พบที่อยู่'}
              </div>
              <Button
                onClick={handleCopyAddress}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                data-testid="button-copy-address"
              >
                <Copy className="w-4 h-4 mr-2" />
                คัดลอกที่อยู่
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        {walletData?.address && (
          <QRCodeGenerator 
            value={walletData.address}
            title="QR Code ที่อยู่ Wallet"
            size={200}
            className="bg-white/10 border-white/20 backdrop-blur-sm"
          />
        )}

        {/* Warning */}
        <Card className="bg-orange-500/10 border-orange-500/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-orange-300 mb-2">⚠️ คำเตือน</h3>
            <ul className="text-sm text-orange-200 space-y-1">
              <li>• รองรับเฉพาะโทเค็นบน Polygon Network เท่านั้น</li>
              <li>• ตรวจสอบที่อยู่ให้ถูกต้องก่อนโอน</li>
              <li>• การโอนผิดที่อยู่จะไม่สามารถกู้คืนได้</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}