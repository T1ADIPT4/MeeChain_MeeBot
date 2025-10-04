import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeeBotFallbackCard } from './meebot-fallback-card';
import { ManualNetworkCheck } from './manual-network-check';
import { useMeeBotStatus } from '@/hooks/use-meebot-status';
import { 
  Wallet, 
  ExternalLink, 
  HelpCircle, 
  ArrowRight,
  Zap
} from 'lucide-react';
import WalletConnectHelper from './wallet-connect-helper';

interface WalletConnectFallbackProps {
  targetChainId: string;
  targetNetworkName: string;
  onSuccess?: () => void;
}

export function WalletConnectFallback({ 
  targetChainId, 
  targetNetworkName,
  onSuccess 
}: WalletConnectFallbackProps) {
  const { status, setStatus, setMessage } = useMeeBotStatus();

  useEffect(() => {
    // เริ่มต้นด้วยข้อความต้อนรับ
    setStatus('idle');
    setMessage(`สวัสดีครับ! ผมคือ MeeBot ผู้ช่วยเครือข่าย Web3 ของคุณ! 
    เห็นว่าคุณต้องการเปลี่ยนไปยัง ${targetNetworkName} ใช่ไหม? 
    ไม่เป็นไร ผมจะช่วยแนะนำให้ครับ! 🤖✨`);
  }, [targetChainId, targetNetworkName, setStatus, setMessage]);

  useEffect(() => {
    if (status === 'success' && onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  }, [status, onSuccess]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-purple-500/30 rounded-full">
              <Wallet className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <span className="text-xl">🔗 เชื่อมต่อ Wallet</span>
              <div className="text-sm text-gray-300 mt-1">
                ต้องการความช่วยเหลือในการเปลี่ยนเครือข่าย
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4">
            <div>
              <p className="text-white font-medium">เครือข่ายปัจจุบัน</p>
              <p className="text-gray-300 text-sm">ไม่ตรงกับที่ต้องการ</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">เครือข่ายที่ต้องการ</p>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mt-1">
                {targetNetworkName}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MeeBot Card */}
      <MeeBotFallbackCard />

      {/* Network Check */}
      <ManualNetworkCheck 
        targetChainId={targetChainId}
        targetNetworkName={targetNetworkName}
      />

      {/* Help Section */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">🆘 MeeBot วิธีช่วยเหลือ</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 font-medium text-sm flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center text-xs">1</span>
                  เปิด Wallet ของคุณ (MetaMask, Trust Wallet, etc.)
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-300 font-medium text-sm flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500/30 rounded-full flex items-center justify-center text-xs">2</span>
                  เลือกเครือข่าย {targetNetworkName}
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-300 font-medium text-sm flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">3</span>
                  กลับมากดปุ่ม "ตรวจสอบอีกครั้ง"
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                คู่มือ Wallet
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
              >
                <Zap className="w-4 h-4 mr-2" />
                ติดต่อ Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}