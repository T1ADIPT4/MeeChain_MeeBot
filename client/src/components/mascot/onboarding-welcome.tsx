import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Wallet,
  Shield,
  Zap,
  Globe,
  Heart,
  Sparkles 
} from 'lucide-react';
import { MascotGuide } from './mascot-guide';
import logoUrl from '@assets/branding/logo.png';

interface OnboardingWelcomeProps {
  onStartOnboarding: () => void;
  onViewDocs: () => void;
  className?: string;
}

export function OnboardingWelcome({ 
  onStartOnboarding, 
  onViewDocs,
  className = ""
}: OnboardingWelcomeProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "ปลอดภัยสูงสุด",
      description: "ระบบรักษาความปลอดภัยแบบ Web3 พร้อม Biometric"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "ไม่มี Gas Fee",
      description: "Account Abstraction ช่วยให้ไม่ต้องจ่ายค่าธรรมเนียม"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-400" />,
      title: "Multi-Chain",
      description: "รองรับหลายเครือข่าย เชื่อมต่อ DeFi ได้ทันที"
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      title: "เป็นมิตร",
      description: "ออกแบบเพื่อผู้ใช้ไทย ใช้งานง่ายเหมือนแอปธนาคาร"
    }
  ];

  // Auto-rotate features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center p-6 ${className}`}>
      <div className="max-w-lg w-full space-y-6">
        
        {/* Main Mascot Guide */}
        <MascotGuide 
          currentStep={0}
          totalSteps={7}
          onGetStarted={onStartOnboarding}
          onViewDocs={onViewDocs}
        />

        {/* Features Carousel */}
        <Card className="bg-white/5 border-slate-600 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              ทำไมต้อง MeeChain?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {/* Current Feature */}
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-center mb-3">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {features[currentFeature].title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {features[currentFeature].description}
                </p>
              </div>

              {/* Feature Indicators */}
              <div className="flex justify-center gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentFeature 
                        ? 'bg-blue-400 w-6' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    data-testid={`indicator-${index}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/5 border-slate-600 p-4 text-center">
            <div className="text-xl font-bold text-blue-400">7</div>
            <div className="text-xs text-slate-400">ขั้นตอน</div>
          </Card>
          <Card className="bg-white/5 border-slate-600 p-4 text-center">
            <div className="text-xl font-bold text-green-400">Free</div>
            <div className="text-xs text-slate-400">Gas Fee</div>
          </Card>
          <Card className="bg-white/5 border-slate-600 p-4 text-center">
            <div className="text-xl font-bold text-purple-400">Safe</div>
            <div className="text-xs text-slate-400">ปลอดภัย</div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className="bg-slate-700/50 text-slate-300 border-slate-600"
          >
            Made with ❤️ for Thai Developers
          </Badge>
        </div>
      </div>
    </div>
  );
}