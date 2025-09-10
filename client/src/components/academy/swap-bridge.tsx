
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  ArrowLeftRight, 
  Coins, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Trophy,
  Zap,
  Network,
  ChevronDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface SwapBridgeProps {
  onNext: () => void;
  onPrev: () => void;
}

export function SwapBridge({ onNext, onPrev }: SwapBridgeProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [coinSpinning, setCoinSpinning] = useState(false);

  const steps = [
    {
      title: "🔄 Swap คืออะไร?",
      description: "แลกเปลี่ยนโทเค็นชนิดหนึ่งเป็นอีกชนิดหนึ่ง",
      action: "เริ่มเรียนรู้ Swap"
    },
    {
      title: "🌉 Bridge คืออะไร?", 
      description: "ส่งโทเค็นข้ามเครือข่ายต่าง ๆ",
      action: "เรียนรู้ Bridge"
    },
    {
      title: "⚡ ลองใช้งานจริง",
      description: "ทดลอง Swap ETH เป็น USDC",
      action: "ทดลอง Swap"
    }
  ];

  const startCoinAnimation = () => {
    setCoinSpinning(true);
    setTimeout(() => {
      setShowBadge(true);
      setTimeout(() => {
        setAnimationComplete(true);
      }, 1500);
    }, 2000);
  };

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      toast({
        title: "🎯 เก่งมาก!",
        description: `เรียนรู้ ${steps[currentStep].title} แล้ว!`,
      });
    } else {
      // Final step - start coin animation
      startCoinAnimation();
      toast({
        title: "🎉 ยอดเยี่ยม!",
        description: "คุณเรียนรู้ Swap & Bridge สำเร็จแล้ว!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-3 mb-8">
          <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-slate-900" />
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-slate-900" />
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-slate-900" />
          </div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-purple-500/30 backdrop-blur-sm overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
          
          {/* Floating sparkles */}
          <Sparkles className="absolute top-6 right-12 w-4 h-4 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute bottom-12 left-16 w-3 h-3 text-purple-400 animate-pulse" />

          <CardContent className="p-8 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center border-2 border-white/20">
                <ArrowLeftRight className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Swap & Bridge
              </h1>
              <p className="text-gray-300 text-lg">
                แลกเปลี่ยนและโอนข้ามเครือข่าย
              </p>
            </div>

            {/* Success State with Badge */}
            {showBadge ? (
              <div className="text-center space-y-6">
                
                {/* MeeBot with spinning coin */}
                <div className="relative">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center border-4 border-white/20 relative overflow-hidden">
                    <img 
                      src={logoUrl} 
                      alt="MeeBot" 
                      className="w-20 h-20 object-contain"
                    />
                    
                    {/* Spinning coin */}
                    <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center ${coinSpinning ? 'animate-spin' : ''}`}>
                      <Coins className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Sparkle effects around MeeBot */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkles className="absolute top-8 left-8 w-6 h-6 text-yellow-400 animate-ping" />
                    <Sparkles className="absolute top-12 right-12 w-4 h-4 text-purple-400 animate-bounce" />
                    <Sparkles className="absolute bottom-8 left-12 w-5 h-5 text-pink-400 animate-pulse" />
                    <Sparkles className="absolute bottom-12 right-8 w-4 h-4 text-cyan-400 animate-ping" />
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 relative max-w-md mx-auto">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l border-t border-purple-500/30 rotate-45"></div>
                  
                  <p className="text-purple-100 text-lg italic leading-relaxed text-center">
                    "สุดยอดเลย! คุณเป็น Swap Ninja แล้ว! 🥷✨ 
                    ได้ badge พิเศษด้วยนะ!"
                  </p>
                </div>

                {/* Swap Ninja Badge */}
                <div className={`transition-all duration-1000 ${animationComplete ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 max-w-sm mx-auto border-2 border-purple-400/50 shadow-2xl">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/30 relative">
                        <Zap className="w-8 h-8 text-white" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <img 
                            src={logoUrl} 
                            alt="MeeBot" 
                            className="w-4 h-4 object-contain"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">🥷 Swap Ninja</h3>
                        <p className="text-purple-100 text-sm">เชี่ยวชาญการ Swap & Bridge</p>
                      </div>
                      
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        +200 EXP
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                {animationComplete && (
                  <div className="mt-8">
                    <Button
                      onClick={onNext}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <span>ไปขั้นต่อไป</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Learning Steps */
              <div className="space-y-6">
                
                {/* Current Step */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 border-2 border-white/20">
                    {currentStep === 0 && <ArrowLeftRight className="w-10 h-10 text-white" />}
                    {currentStep === 1 && <Network className="w-10 h-10 text-white" />}
                    {currentStep === 2 && <Zap className="w-10 h-10 text-white" />}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* MeeBot Speech Bubble */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 mb-6 relative">
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l border-b border-purple-500/30 rotate-45"></div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                      <img 
                        src={logoUrl} 
                        alt="MeeBot" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-purple-100 text-sm italic leading-relaxed">
                        {currentStep === 0 && "Swap ง่าย ๆ นะครับ แค่แลกโทเค็นให้เป็นชนิดที่เราต้องการ! 🔄"}
                        {currentStep === 1 && "Bridge เป็นการส่งโทเค็นข้ามเครือข่าย เหมือนสะพานเชื่อมต่อ! 🌉"}
                        {currentStep === 2 && "มาลองจริง ๆ กันเถอะ! แลก ETH เป็น USDC ดูครับ! ⚡"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo Area */}
                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                  <div className="space-y-4">
                    
                    {/* From Token */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">ETH</span>
                          </div>
                          <span className="text-white font-medium">Ethereum</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">1.0</div>
                          <div className="text-gray-400 text-sm">≈ $2,500</div>
                        </div>
                      </div>
                    </div>

                    {/* Swap Arrow */}
                    <div className="flex justify-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <ChevronDown className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* To Token */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">USDC</span>
                          </div>
                          <span className="text-white font-medium">USD Coin</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">2,485.50</div>
                          <div className="text-gray-400 text-sm">≈ $2,485</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <Button
                    onClick={handleStepComplete}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    {steps[currentStep].action}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>ความคืบหน้า</span>
                    <span>{currentStep + 1}/{steps.length}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {!showBadge && (
              <div className="flex gap-3 mt-8">
                <Button
                  variant="ghost"
                  onClick={onPrev}
                  className="flex-1 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ย้อนกลับ
                </Button>
              </div>
            )}

            {/* Hint */}
            <div className="mt-6 pt-4 border-t border-slate-600/30">
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-400" />
                <p className="leading-relaxed">
                  <strong>เคล็ดลับ:</strong> Swap = แลกเปลี่ยนในเครือข่ายเดียวกัน, Bridge = ส่งข้ามเครือข่าย
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress hint */}
        <p className="text-gray-500 text-sm text-center">
          ขั้นที่ 4 จาก 5 • เรียนรู้ Swap & Bridge แล้วได้ +200 EXP + Badge "Swap Ninja"
        </p>
      </div>
    </div>
  );
}
