
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, RefreshCw, Smartphone, ArrowRight } from 'lucide-react';
import { switchToFuseNetwork } from '@/lib/token-actions';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<string>('');
  const [meeBotEmotion, setMeeBotEmotion] = useState<'normal' | 'encouraging' | 'success' | 'checking'>('normal');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    checkCurrentNetwork();
  }, []);

  const checkCurrentNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(chainId);
      
      if (chainId === targetChainId) {
        setMeeBotEmotion('success');
        setCurrentStep(3);
        onNetworkChanged?.();
      }
    } catch (error) {
      console.error('Failed to check network:', error);
    }
  };

  const handleRetryCheck = async () => {
    setIsChecking(true);
    setMeeBotEmotion('checking');
    setRetryCount(prev => prev + 1);

    // สำหรับ WalletConnect ต้องเช็คแบบ manual
    if (isWalletConnect) {
      setTimeout(async () => {
        await checkCurrentNetwork();
        setIsChecking(false);
        
        if (currentChainId !== targetChainId) {
          setMeeBotEmotion('encouraging');
        }
      }, 2000);
    } else {
      // สำหรับ MetaMask หรือ injected wallet สามารถลองเปลี่ยนอัตโนมัติได้
      try {
        const success = await switchToFuseNetwork();
        if (success) {
          await checkCurrentNetwork();
          setMeeBotEmotion('success');
          setCurrentStep(3);
        } else {
          setMeeBotEmotion('encouraging');
        }
      } catch (error) {
        setMeeBotEmotion('encouraging');
      }
      setIsChecking(false);
    }
  };

  const getMeeBotMessage = () => {
    switch (meeBotEmotion) {
      case 'encouraging':
        if (retryCount > 0) {
          return "อ๊ะ... ยังไม่ตรงนะครับ ลองตรวจสอบอีกครั้งได้เลย ผมอยู่ตรงนี้ ไม่ไปไหน 💪";
        }
        return "เฮ้! ดูเหมือนเราจะใช้ WalletConnect อยู่นะครับ ระบบไม่สามารถเปลี่ยนเครือข่ายให้อัตโนมัติได้... แต่ไม่เป็นไร! เราทำด้วยกันได้ ✨";
      case 'success':
        return "เยี่ยมมาก! เปลี่ยนเครือข่ายสำเร็จแล้วครับ 🎉 พร้อมลุยภารกิจต่อไปกันเลย!";
      case 'checking':
        return "MeeBot กำลังเช็คเครือข่าย... 🔍";
      default:
        return "มาช่วยกันเปลี่ยนเครือข่ายกันเถอะครับ! 😊";
    }
  };

  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case '0x7A': // 122
        return 'Fuse Network';
      case '0x89': // 137
        return 'Polygon';
      case '0x1': // 1
        return 'Ethereum Mainnet';
      default:
        return 'Unknown Network';
    }
  };

  if (currentChainId === targetChainId && currentStep === 3) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-400 mb-1">สำเร็จแล้ว! 🎉</h3>
              <p className="text-sm text-green-300">{getMeeBotMessage()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* MeeBot Helper Card */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* MeeBot Avatar */}
            <div className="relative">
              <div className={`w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                meeBotEmotion === 'success' ? 'scale-110 animate-bounce' :
                meeBotEmotion === 'checking' ? 'animate-pulse' :
                meeBotEmotion === 'encouraging' ? 'animate-pulse scale-105' : 'scale-100'
              }`}>
                <span className="text-lg">🤖</span>
              </div>
              {meeBotEmotion === 'checking' && (
                <div className="absolute -bottom-1 -right-1">
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Message */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-cyan-300">MeeBot</h3>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 text-xs">
                  เพื่อนร่วมทีม
                </Badge>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                {getMeeBotMessage()}
              </p>
              
              {/* Progress indicator */}
              {isChecking && (
                <div className="mb-3">
                  <Progress value={66} className="h-2" />
                  <p className="text-xs text-cyan-400 mt-1">กำลังตรวจสอบเครือข่าย...</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Switch Guide */}
      {isWalletConnect && currentStep < 3 && (
        <Card className="bg-slate-800/80 border-slate-600/50">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              วิธีเปลี่ยนเครือข่ายใน Wallet App
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">เปิดแอป Wallet ของคุณ</p>
                  <p className="text-sm text-gray-400">เช่น MetaMask, Trust Wallet หรือ Rainbow</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">หาปุ่มเปลี่ยนเครือข่าย</p>
                  <p className="text-sm text-gray-400">มักอยู่ที่มุมบนของหน้าจอ</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">เลือก {getNetworkName(targetChainId)}</p>
                  <p className="text-sm text-gray-400">Chain ID: {parseInt(targetChainId, 16)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-400/30 rounded-lg">
                <ArrowRight className="w-4 h-4 text-orange-400" />
                <p className="text-sm text-orange-300">
                  หลังจากเปลี่ยนเครือข่ายแล้ว กลับมากดปุ่มตรวจสอบด้านล่าง
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Network Status */}
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">เครือข่ายปัจจุบัน</p>
              <p className="font-semibold text-white">
                {currentChainId ? getNetworkName(currentChainId) : 'ไม่ระบุ'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">เป้าหมาย</p>
              <p className="font-semibold text-green-400">{getNetworkName(targetChainId)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retry Button */}
      <Button
        onClick={handleRetryCheck}
        disabled={isChecking}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
      >
        {isChecking ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            กำลังตรวจสอบ...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            เปลี่ยนเครือข่ายแล้วครับ! ตรวจสอบอีกครั้ง
          </>
        )}
      </Button>
    </div>
  );
}
