
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { switchToFuseNetwork } from '@/lib/token-actions';
import { useMeeBotStatus } from '@/hooks/use-meebot-status';

export default function FuseNetworkHelper() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { setStatus, setMessage } = useMeeBotStatus();

  const handleSwitchToFuse = async () => {
    setIsConnecting(true);
    setStatus('waiting');
    setMessage('🔄 MeeBot กำลังช่วยเปลี่ยนเครือข่าย...');

    try {
      const success = await switchToFuseNetwork();
      
      if (success) {
        setStatus('success');
        setMessage('🎉 เยี่ยม! เปลี่ยนไป Fuse Network เรียบร้อยแล้ว');
      } else {
        setStatus('error');
        setMessage('😅 อุ๊ปส์! เปลี่ยนเครือข่ายไม่ได้ ลองใหม่อีกครั้งนะ');
      }
    } catch (error) {
      setStatus('error');
      setMessage('🤨 มีปัญหาการเชื่อมต่อ กรุณาลองใหม่');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-300/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-yellow-400" />
          Fuse Network Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-100">
            <p className="mb-2">
              🌟 <strong>Fuse Network</strong> เป็นเครือข่ายที่รวดเร็วและค่าธรรมเนียมต่ำ
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-blue-200">
              <li>ค่า Gas ถูกมาก (เกือบฟรี)</li>
              <li>ทำธุรกรรมได้เร็ว ~5 วินาที</li>
              <li>รองรับ FUSE Token และ DeFi ecosystem</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Low Gas Fees
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Fast Transactions
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            EVM Compatible
          </Badge>
        </div>

        <Button 
          onClick={handleSwitchToFuse}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
              กำลังเปลี่ยนเครือข่าย...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              เปลี่ยนไป Fuse Network
            </>
          )}
        </Button>

        <p className="text-xs text-center text-white/60">
          💡 MeeBot แนะนำ: Fuse Network เหมาะสำหรับ DeFi และการโอนเหรียญ
        </p>
      </CardContent>
    </Card>
  );
}
