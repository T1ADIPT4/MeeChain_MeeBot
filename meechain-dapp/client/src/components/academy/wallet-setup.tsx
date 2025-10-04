
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Wallet, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface WalletSetupProps {
  onNext: () => void;
  onPrev: () => void;
}

export function WalletSetup({ onNext, onPrev }: WalletSetupProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'polygon' | 'ethereum' | null>(null);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "🎉 Wallet เชื่อมต่อสำเร็จ!",
        description: "MeeBot ดีใจด้วย! พร้อมไปขั้นต่อไปแล้ว 🚀",
      });
      
      // Auto proceed after success
      setTimeout(() => {
        onNext();
      }, 2000);
    }, 2000);
  };

  const networks = [
    {
      id: 'polygon' as const,
      name: 'Polygon',
      description: 'แนะนำโดย MeeBot - Gas Fee ต่ำ',
      recommended: true,
      color: 'from-purple-500 to-indigo-500',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'ethereum' as const,
      name: 'Ethereum',
      description: 'เครือข่ายหลัก - Gas Fee สูงกว่า',
      recommended: false,
      color: 'from-blue-500 to-cyan-500',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8 text-center">
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-3 mb-8">
          <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-slate-900" />
          </div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>

        {/* Main Setup Card */}
        <Card className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-cyan-500/30 backdrop-blur-sm overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-4 -translate-x-4"></div>
          
          {/* Floating sparkles */}
          <Sparkles className="absolute top-4 right-8 w-4 h-4 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute bottom-8 left-12 w-3 h-3 text-cyan-400 animate-pulse" />

          <CardContent className="p-8 relative z-10">
            
            {/* Header */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center border-2 border-white/20">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Wallet Setup
              </h1>
              <p className="text-gray-300">
                เชื่อมต่อ Wallet ของคุณ
              </p>
            </div>

            {/* MeeBot Speech Bubble */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 relative">
              {/* Speech bubble tail */}
              <div className="absolute -top-2 left-8 w-4 h-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-l border-t border-cyan-500/30 rotate-45"></div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <img 
                    src={logoUrl} 
                    alt="MeeBot" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-cyan-100 text-sm italic leading-relaxed">
                    "สวัสดีจ้า! ผมแนะนำ Polygon นะครับ Gas Fee ต่ำ เร็ว และเหมาะกับมือใหม่มาก! 
                    Polygon ดีไหมจ๊ะ? 🌟"
                  </p>
                </div>
              </div>
            </div>

            {/* Network Selection */}
            <div className="space-y-3 mb-6">
              <h3 className="text-white font-semibold text-left flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                เลือกเครือข่าย
              </h3>
              
              <div className="space-y-2">
                {networks.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => setSelectedNetwork(network.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedNetwork === network.id
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${network.color} rounded-lg flex items-center justify-center`}>
                          {network.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{network.name}</span>
                            {network.recommended && (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                แนะนำ
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">{network.description}</p>
                        </div>
                      </div>
                      
                      {selectedNetwork === network.id && (
                        <CheckCircle className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Connect Button */}
            <div className="space-y-4">
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting || isConnected || !selectedNetwork}
                className={`w-full font-semibold py-4 text-lg transition-all duration-300 ${
                  isConnected 
                    ? 'bg-green-500 hover:bg-green-500 text-white'
                    : isConnecting
                      ? 'bg-gray-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>กำลังเชื่อมต่อ...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>เชื่อมต่อสำเร็จ!</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </div>
              </Button>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={onPrev}
                  className="flex-1 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ย้อนกลับ
                </Button>

                {isConnected && (
                  <Button
                    onClick={onNext}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                  >
                    <span>ขั้นต่อไป</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-slate-600/30">
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
                <div>
                  <p className="leading-relaxed">
                    MeeChain ไม่เก็บ Private Key ของคุณ การเชื่อมต่อผ่าน MetaMask หรือ WalletConnect มีความปลอดภัยสูง
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress hint */}
        <p className="text-gray-500 text-sm">
          ขั้นที่ 2 จาก 5 • เชื่อมต่อ Wallet แล้วได้ +100 EXP
        </p>
      </div>
    </div>
  );
}
