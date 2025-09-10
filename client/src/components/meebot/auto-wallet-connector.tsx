
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSmartContracts } from '@/hooks/use-smart-contracts';

export default function AutoWalletConnector() {
  const { isConnected, connectWallet, contractsHealth, meeBotMessage, isLoading } = useSmartContracts();
  const [showConnector, setShowConnector] = useState(false);

  useEffect(() => {
    // แสดง connector ถ้ายังไม่ได้เชื่อม wallet
    setShowConnector(!isConnected);
  }, [isConnected]);

  if (!showConnector || isConnected) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* MeeBot Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
            🤖
          </div>

          <div className="flex-1 space-y-3">
            {/* MeeBot Message */}
            <div>
              <h4 className="font-semibold text-blue-300 mb-1">MeeBot แนะนำ</h4>
              <p className="text-blue-100 text-sm italic leading-relaxed">
                {meeBotMessage}
              </p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 text-sm">
              {contractsHealth?.rpcConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Smart Contracts พร้อมใช้งาน</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">กำลังเตรียมระบบ...</span>
                </>
              )}
            </div>

            {/* Connect Button */}
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isLoading ? 'กำลังเชื่อม...' : 'เชื่อม MetaMask'}
            </Button>

            {/* Features Preview */}
            <div className="text-xs text-blue-200/70">
              เมื่อเชื่อมแล้วจะได้: Badge NFTs, Token Rewards, Quest System
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
