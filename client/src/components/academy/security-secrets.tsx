
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Shield, 
  Lock, 
  Key, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Eye,
  EyeOff,
  Settings,
  Database,
  Zap,
  Network
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface SecuritySecretsProps {
  onNext: () => void;
  onPrev: () => void;
}

interface SecretsStatus {
  ok: boolean;
  missing: string[];
  warnings: string[];
  status: 'healthy' | 'warning' | 'critical';
  message: string;
}

export function SecuritySecrets({ onNext, onPrev }: SecuritySecretsProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSecrets, setShowSecrets] = useState(false);
  const [secretsStatus, setSecretsStatus] = useState<SecretsStatus | null>(null);
  const [isCheckingSecrets, setIsCheckingSecrets] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [treasureBoxOpen, setTreasureBoxOpen] = useState(false);

  const steps = [
    {
      title: "🔒 ความปลอดภัยใน Web3",
      description: "เรียนรู้หลักการรักษาความปลอดภัย",
      action: "เรียนรู้หลักการ"
    },
    {
      title: "🔑 Environment Secrets",
      description: "ตั้งค่า API Keys และ Secrets อย่างปลอดภัย",
      action: "ตรวจสอบ Secrets"
    },
    {
      title: "🛡️ MeeBot Guardian",
      description: "เปิดใช้ระบบเฝ้าระวังของ MeeBot",
      action: "เปิดใช้ Guardian"
    }
  ];

  useEffect(() => {
    if (currentStep === 1) {
      checkSecretsStatus();
    }
  }, [currentStep]);

  const checkSecretsStatus = async () => {
    setIsCheckingSecrets(true);
    try {
      const response = await fetch('/api/secrets/health');
      const result = await response.json();
      
      if (result.success) {
        setSecretsStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to check secrets status:', error);
      setSecretsStatus({
        ok: false,
        missing: ['DATABASE_URL', 'VITE_TOKEN_CONTRACT_ADDRESS'],
        warnings: ['PINATA_API_KEY'],
        status: 'warning',
        message: 'ไม่สามารถตรวจสอบ secrets ได้'
      });
    } finally {
      setIsCheckingSecrets(false);
    }
  };

  const startTreasureAnimation = () => {
    setTreasureBoxOpen(true);
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
      // Final step - start treasure animation
      startTreasureAnimation();
      toast({
        title: "🎉 ยอดเยี่ยม!",
        description: "คุณเป็น Security Guardian แล้ว!",
      });
    }
  };

  const getSecretsStatusColor = () => {
    if (!secretsStatus) return 'gray';
    switch (secretsStatus.status) {
      case 'healthy': return 'green';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
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
          <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-slate-900" />
          </div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-indigo-500/30 backdrop-blur-sm overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
          
          {/* Floating sparkles */}
          <Sparkles className="absolute top-6 right-12 w-4 h-4 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute bottom-12 left-16 w-3 h-3 text-indigo-400 animate-pulse" />

          <CardContent className="p-8 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center border-2 border-white/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Security & Secrets
              </h1>
              <p className="text-gray-300 text-lg">
                รักษาความปลอดภัยกับ MeeBot Guardian
              </p>
            </div>

            {/* Success State with Badge */}
            {showBadge ? (
              <div className="text-center space-y-6">
                
                {/* MeeBot with treasure box */}
                <div className="relative">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center border-4 border-white/20 relative overflow-hidden">
                    <img 
                      src={logoUrl} 
                      alt="MeeBot" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  
                  {/* Treasure box below MeeBot */}
                  <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg border-2 border-yellow-400/50 relative transition-all duration-1000 ${treasureBoxOpen ? 'animate-bounce' : ''}`}>
                    {/* Lock/keyhole */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-700 rounded-full"></div>
                    </div>
                    
                    {/* Treasure sparkles when open */}
                    {treasureBoxOpen && (
                      <div className="absolute inset-0 pointer-events-none">
                        <Sparkles className="absolute -top-2 -left-1 w-3 h-3 text-yellow-300 animate-ping" />
                        <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-gold-400 animate-bounce" />
                        <Key className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-300 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Sparkle effects around MeeBot */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkles className="absolute top-8 left-8 w-6 h-6 text-yellow-400 animate-ping" />
                    <Sparkles className="absolute top-12 right-12 w-4 h-4 text-indigo-400 animate-bounce" />
                    <Sparkles className="absolute bottom-8 left-12 w-5 h-5 text-purple-400 animate-pulse" />
                    <Sparkles className="absolute bottom-12 right-8 w-4 h-4 text-cyan-400 animate-ping" />
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6 relative max-w-md mx-auto">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l border-t border-indigo-500/30 rotate-45"></div>
                  
                  <p className="text-indigo-100 text-lg italic leading-relaxed text-center">
                    "อย่าลืมเก็บความลับไว้นะ! 🔐✨ 
                    คุณเป็น Security Guardian แล้ว!"
                  </p>
                </div>

                {/* Security Guardian Badge */}
                <div className={`transition-all duration-1000 ${animationComplete ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 max-w-sm mx-auto border-2 border-indigo-400/50 shadow-2xl">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/30 relative">
                        <Shield className="w-8 h-8 text-white" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <img 
                            src={logoUrl} 
                            alt="MeeBot" 
                            className="w-4 h-4 object-contain"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">🛡️ Security Guardian</h3>
                        <p className="text-indigo-100 text-sm">ผู้พิทักษ์ความปลอดภัย MeeChain</p>
                      </div>
                      
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        +250 EXP
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Done Button */}
                {animationComplete && (
                  <div className="mt-8">
                    <Button
                      onClick={onNext}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <span>จบ Academy! 🎓</span>
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
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 border-2 border-white/20">
                    {currentStep === 0 && <Shield className="w-10 h-10 text-white" />}
                    {currentStep === 1 && <Key className="w-10 h-10 text-white" />}
                    {currentStep === 2 && <Bot className="w-10 h-10 text-white" />}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* MeeBot Speech Bubble */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6 relative">
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l border-b border-indigo-500/30 rotate-45"></div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                      <img 
                        src={logoUrl} 
                        alt="MeeBot" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-indigo-100 text-sm italic leading-relaxed">
                        {currentStep === 0 && "ความปลอดภัยสำคัญที่สุดในโลก Web3 นะครับ! 🔒 เราต้องเก็บข้อมูลสำคัญให้ดี!"}
                        {currentStep === 1 && "API Keys และ Secrets เหมือนกุญแจบ้านเรา ห้ามให้คนอื่นเห็นเด็ดขาด! 🔑"}
                        {currentStep === 2 && "ให้ผมเป็น Guardian เฝ้าระบบให้คุณนะครับ! จะดูแลทุกอย่างให้ปลอดภัย! 🛡️"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Demo Area */}
                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold mb-3">📋 Security Checklist</h3>
                      <div className="space-y-3">
                        {[
                          "ไม่แชร์ Private Key หรือ Seed Phrase",
                          "ใช้ Environment Variables สำหรับ API Keys", 
                          "ตรวจสอบ URL ก่อนเชื่อมต่อ Wallet",
                          "เปิดใช้ Two-Factor Authentication"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">🔍 Secrets Status Check</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={checkSecretsStatus}
                          disabled={isCheckingSecrets}
                          className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                        >
                          {isCheckingSecrets ? (
                            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Settings className="w-4 h-4" />
                          )}
                          {isCheckingSecrets ? 'กำลังตรวจสอบ...' : 'ตรวจสอบใหม่'}
                        </Button>
                      </div>

                      {secretsStatus && (
                        <div className={`p-4 rounded-lg border ${
                          getSecretsStatusColor() === 'green' ? 'bg-green-500/10 border-green-500/30' :
                          getSecretsStatusColor() === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-red-500/10 border-red-500/30'
                        }`}>
                          <div className="flex items-start gap-3">
                            {getSecretsStatusColor() === 'green' ? (
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className={`font-medium ${
                                getSecretsStatusColor() === 'green' ? 'text-green-300' :
                                getSecretsStatusColor() === 'yellow' ? 'text-yellow-300' :
                                'text-red-300'
                              }`}>
                                {secretsStatus.message}
                              </p>
                              
                              {(secretsStatus.missing.length > 0 || secretsStatus.warnings.length > 0) && (
                                <div className="mt-3 space-y-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSecrets(!showSecrets)}
                                    className="text-gray-300 hover:text-white p-0 h-auto"
                                  >
                                    {showSecrets ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {showSecrets ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
                                  </Button>
                                  
                                  {showSecrets && (
                                    <div className="space-y-3 pt-2 border-t border-gray-600">
                                      {secretsStatus.missing.length > 0 && (
                                        <div>
                                          <p className="text-red-300 font-medium text-sm mb-2">🔑 จำเป็น (ขาดหาย):</p>
                                          <div className="grid grid-cols-1 gap-2">
                                            {secretsStatus.missing.map((key) => (
                                              <div key={key} className="flex items-center gap-2 text-red-200 text-sm bg-red-500/10 rounded p-2">
                                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                {key}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {secretsStatus.warnings.length > 0 && (
                                        <div>
                                          <p className="text-yellow-300 font-medium text-sm mb-2">⚠️ เสริม (แนะนำ):</p>
                                          <div className="grid grid-cols-1 gap-2">
                                            {secretsStatus.warnings.map((key) => (
                                              <div key={key} className="flex items-center gap-2 text-yellow-200 text-sm bg-yellow-500/10 rounded p-2">
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                                {key}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 text-center">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20 relative">
                        <img 
                          src={logoUrl} 
                          alt="MeeBot Guardian" 
                          className="w-16 h-16 object-contain"
                        />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">MeeBot Guardian Mode</h4>
                        <p className="text-gray-300">ระบบเฝ้าระวังอัตโนมัติของ MeeBot</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        {[
                          { icon: Database, label: "Monitor Secrets", desc: "เฝ้าระวัง API Keys" },
                          { icon: Network, label: "Network Security", desc: "ตรวจสอบเครือข่าย" },
                          { icon: Zap, label: "Real-time Alerts", desc: "แจ้งเตือนทันที" },
                          { icon: Lock, label: "Auto Protection", desc: "ป้องกันอัตโนมัติ" }
                        ].map((feature, index) => (
                          <div key={index} className="bg-slate-800/50 rounded-lg p-4 text-center">
                            <feature.icon className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                            <h5 className="text-white font-medium text-sm">{feature.label}</h5>
                            <p className="text-gray-400 text-xs mt-1">{feature.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <Button
                    onClick={handleStepComplete}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
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
                      className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
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
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
                <p className="leading-relaxed">
                  <strong>เคล็ดลับ:</strong> ใช้ Replit Secrets tool เพื่อเก็บ API Keys อย่างปลอดภัย
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress hint */}
        <p className="text-gray-500 text-sm text-center">
          ขั้นสุดท้าย! • จบ Security & Secrets แล้วได้ +250 EXP + Badge "Security Guardian"
        </p>
      </div>
    </div>
  );
}
