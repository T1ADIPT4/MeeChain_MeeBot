
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMeeBotStatus } from '@/hooks/use-meebot-status';

interface WalletConnectHelperProps {
  targetChainId: string;
  onNetworkChanged?: () => void;
  isWalletConnect?: boolean;
}

export default function WalletConnectHelper({ 
  targetChainId, 
  onNetworkChanged,
  isWalletConnect = false 
}: WalletConnectHelperProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'correct' | 'wrong'>('checking');
  const { toast } = useToast();
  const { setStatus, setMessage } = useMeeBotStatus();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setWalletAddress(accounts[0]);
          await checkNetwork();
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const checkNetwork = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === targetChainId) {
          setNetworkStatus('correct');
          setStatus('success');
          setMessage('🎉 Wallet เชื่อมต่อและเครือข่ายถูกต้องแล้ว!');
          if (onNetworkChanged) {
            onNetworkChanged();
          }
        } else {
          setNetworkStatus('wrong');
          setStatus('warning');
          setMessage('⚠️ เครือข่าย Wallet ไม่ตรงกับที่ต้องการ กรุณาเปลี่ยนเครือข่าย');
        }
      }
    } catch (error) {
      console.error('Error checking network:', error);
      setNetworkStatus('wrong');
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      if (typeof window.ethereum === 'undefined') {
        toast({
          variant: "destructive",
          title: "ไม่พบ Wallet",
          description: "กรุณาติดตั้ง MetaMask หรือ wallet อื่น",
        });
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        setStatus('success');
        setMessage('✅ Wallet เชื่อมต่อสำเร็จ! กำลังตรวจสอบเครือข่าย...');
        
        await checkNetwork();
        
        toast({
          title: "เชื่อมต่อสำเร็จ! 🎉",
          description: "Wallet ของคุณเชื่อมต่อแล้ว",
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setStatus('error');
      setMessage('❌ ไม่สามารถเชื่อมต่อ Wallet ได้');
      
      toast({
        variant: "destructive",
        title: "เชื่อมต่อไม่สำเร็จ",
        description: error.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
      
      setTimeout(() => {
        checkNetwork();
      }, 1000);
    } catch (error: any) {
      console.error('Error switching network:', error);
      
      toast({
        variant: "destructive",
        title: "ไม่สามารถเปลี่ยนเครือข่ายได้",
        description: "กรุณาเปลี่ยนเครือข่ายในแอป Wallet ของคุณ",
      });
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "คัดลอกแล้ว!",
      description: "ที่อยู่ Wallet ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
  };

  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className={`p-2 rounded-full ${
            isConnected 
              ? networkStatus === 'correct'
                ? 'bg-green-500/30' 
                : 'bg-yellow-500/30'
              : 'bg-slate-500/30'
          }`}>
            <Wallet className={`w-5 h-5 ${
              isConnected 
                ? networkStatus === 'correct'
                  ? 'text-green-300' 
                  : 'text-yellow-300'
                : 'text-slate-300'
            }`} />
          </div>
          <div>
            <span className="text-lg">
              {isWalletConnect ? '🔗 WalletConnect' : '👛 เชื่อมต่อ Wallet'}
            </span>
            <div className="text-sm text-gray-300 mt-1">
              {isConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center">
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold py-3"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  กำลังเชื่อมต่อ...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  เชื่อมต่อ Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
              <div>
                <p className="text-white font-medium text-sm">ที่อยู่ Wallet</p>
                <p className="text-gray-300 text-xs font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-gray-300 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {networkStatus === 'correct' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                )}
                <span className="text-white text-sm">
                  {networkStatus === 'correct' ? 'เครือข่ายถูกต้อง' : 'เครือข่ายไม่ถูกต้อง'}
                </span>
              </div>
              
              {networkStatus === 'wrong' && (
                <Button
                  onClick={switchNetwork}
                  size="sm"
                  className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30"
                >
                  เปลี่ยนเครือข่าย
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-gray-300 hover:bg-slate-800"
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            ดาวน์โหลด MetaMask
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
