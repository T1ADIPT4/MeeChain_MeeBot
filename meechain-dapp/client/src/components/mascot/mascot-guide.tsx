import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Hand, 
  BookOpen, 
  CheckCircle,
  Heart,
  Sparkles,
  Play,
  Pause,
  Square,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface MascotGuideProps {
  currentStep?: number;
  totalSteps?: number;
  isTaskRunning?: boolean;
  onGetStarted?: () => void;
  onViewDocs?: () => void;
  onTaskControl?: (action: 'start' | 'pause' | 'stop') => void;
  className?: string;
}

export function MascotGuide({
  currentStep = 0,
  totalSteps = 7,
  isTaskRunning = false,
  onGetStarted,
  onViewDocs,
  onTaskControl,
  className = ""
}: MascotGuideProps) {
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'thinking' | 'celebrating' | 'waving'>('happy');
  const [showEyes, setShowEyes] = useState(true);
  const [isBreathing, setIsBreathing] = useState(true);
  const { toast } = useToast();

  // Welcome messages based on step
  const getWelcomeMessage = () => {
    if (currentStep === 0) {
      return "สวัสดีครับ! ผม MeeChain Bear 🐻 ยินดีต้อนรับสู่ MeeChain Wallet";
    } else if (currentStep < totalSteps) {
      return `เยี่ยมมาก! คุณอยู่ในขั้นตอนที่ ${currentStep} จาก ${totalSteps} แล้วนะครับ`;
    } else {
      return "ยินดีด้วยครับ! คุณผ่าน onboarding เรียบร้อยแล้ว 🎉";
    }
  };

  // Eye blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowEyes(false);
      setTimeout(() => setShowEyes(true), 150);
    }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  // Emotion changes based on progress
  useEffect(() => {
    if (currentStep === totalSteps) {
      setMascotEmotion('celebrating');
      // Celebration animation
      setTimeout(() => {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 100, 100]);
        }
        toast({
          title: "🎉 ยินดีด้วย!",
          description: "คุณผ่าน onboarding ครบทุกขั้นตอนแล้ว!",
        });
      }, 500);
    } else if (currentStep > 0) {
      setMascotEmotion('thinking');
    }
  }, [currentStep, totalSteps, toast]);

  // Wave animation on mount
  useEffect(() => {
    setMascotEmotion('waving');
    setTimeout(() => setMascotEmotion('happy'), 2000);
  }, []);

  const handleTaskControl = (action: 'start' | 'pause' | 'stop') => {
    onTaskControl?.(action);
    
    if (action === 'start') {
      setMascotEmotion('thinking');
      toast({
        title: "เริ่มทำงานแล้วครับ! 🚀",
        description: "MeeChain Bear กำลังติดตามงานให้คุณ",
      });
    } else if (action === 'stop') {
      setMascotEmotion('happy');
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600 text-white ${className}`}>
      <CardContent className="p-8 text-center">
        {/* Mascot Logo with Animations */}
        <div className="relative mb-6">
          <div className={`
            transition-transform duration-1000 ease-in-out
            ${isBreathing ? 'animate-pulse' : ''}
            ${mascotEmotion === 'celebrating' ? 'animate-bounce' : ''}
            ${mascotEmotion === 'waving' ? 'animate-pulse' : ''}
          `}>
            <img 
              src={logoUrl} 
              alt="MeeChain Bear"
              className={`
                w-24 h-24 mx-auto mb-4 rounded-full
                ${isBreathing ? 'scale-100 animate-ping' : ''}
                transition-all duration-700 ease-in-out
              `}
              style={{
                animation: isBreathing ? 'breathe 3s ease-in-out infinite' : 'none'
              }}
              data-testid="mascot-logo"
            />
          </div>

          {/* Emotional indicators */}
          <div className="absolute -top-2 -right-2">
            {mascotEmotion === 'celebrating' && (
              <div className="animate-bounce">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
            )}
            {mascotEmotion === 'waving' && (
              <div className="animate-pulse">
                <Hand className="w-6 h-6 text-blue-400" />
              </div>
            )}
            {mascotEmotion === 'happy' && (
              <div className="animate-pulse">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
            )}
          </div>

          {/* Chain breathing effect */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" 
               style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-ping" 
               style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">
            MeeChain
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {getWelcomeMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep > 0 && currentStep < totalSteps && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">ความคืบหน้า</span>
              <span className="text-blue-400 font-semibold">{currentStep}/{totalSteps}</span>
            </div>
            <Progress 
              value={(currentStep / totalSteps) * 100} 
              className="h-2 bg-slate-700"
              data-testid="progress-onboarding"
            />
          </div>
        )}

        {/* Task Control Buttons */}
        {currentStep === totalSteps && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">Scheduled Tasks</h3>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <Button
                onClick={() => handleTaskControl('start')}
                disabled={isTaskRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-start-task"
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
              
              <Button
                onClick={() => handleTaskControl('pause')}
                disabled={!isTaskRunning}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                data-testid="button-pause-task"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
              
              <Button
                onClick={() => handleTaskControl('stop')}
                disabled={!isTaskRunning}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-stop-task"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
              
              <Button
                variant="outline"
                className="border-slate-500 text-slate-300 hover:bg-slate-700"
                data-testid="button-task-settings"
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>

            {isTaskRunning && (
              <div className="text-center text-slate-400 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  Monitoring in progress...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {currentStep === 0 && (
            <>
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-6 py-2"
                data-testid="button-get-started"
              >
                <Hand className="w-4 h-4 mr-2" />
                Get Started
              </Button>
              
              <Button
                onClick={onViewDocs}
                variant="outline"
                className="border-slate-500 text-slate-300 hover:bg-slate-700 px-6 py-2"
                data-testid="button-view-docs"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Docs
              </Button>
            </>
          )}

          {currentStep === totalSteps && (
            <Button
              onClick={() => {
                setMascotEmotion('celebrating');
                toast({
                  title: "🎊 MeeChain พร้อมใช้งาน!",
                  description: "ยินดีให้บริการครับ ขอให้มีความสุขกับ Web3!",
                });
              }}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-white px-8 py-3"
              data-testid="button-celebrate"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Perfect! 🎉
            </Button>
          )}
        </div>

        {/* Task Completion Status */}
        {currentStep === totalSteps && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Task completed successfully.</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-chain {
          animation: chain-expand 2s ease-in-out infinite;
        }
        
        @keyframes chain-expand {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(1deg); }
          75% { transform: scale(0.95) rotate(-1deg); }
        }

        .mascot-eyes {
          transition: opacity 0.15s ease-in-out;
        }
        
        .mascot-eyes.blink {
          opacity: 0;
        }
      `}</style>
    </Card>
  );
}