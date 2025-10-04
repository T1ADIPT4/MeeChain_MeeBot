
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  ShoppingCart, 
  Send, 
  Download,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Wallet,
  Target,
  ArrowDown,
  ArrowUp,
  Coins
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface TokenBasicsProps {
  onNext: () => void;
  onPrev: () => void;
}

interface TokenAction {
  id: 'buy' | 'send' | 'receive';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  targetZone: string;
  completed: boolean;
}

export function TokenBasics({ onNext, onPrev }: TokenBasicsProps) {
  const { toast } = useToast();
  const [draggedAction, setDraggedAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const tokenActions: TokenAction[] = [
    {
      id: 'buy',
      title: '🛒 ซื้อโทเค็น',
      description: 'เติมเงินเข้า Wallet',
      icon: <ArrowDown className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      targetZone: 'wallet-zone',
      completed: completedActions.includes('buy')
    },
    {
      id: 'send',
      title: '✈️ ส่งโทเค็น',
      description: 'โอนให้เพื่อน',
      icon: <Send className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      targetZone: 'friend-zone',
      completed: completedActions.includes('send')
    },
    {
      id: 'receive',
      title: '📥 รับโทเค็น',
      description: 'รับจากผู้อื่น',
      icon: <ArrowUp className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      targetZone: 'wallet-zone',
      completed: completedActions.includes('receive')
    }
  ];

  const meeBotMessages = [
    "ลองลากโทเค็นไปยังปลายทางกัน! 🎯",
    "เก่งมาก! ลองดูการส่งโทเค็นต่อ 🚀",
    "สุดยอด! เรียนรู้การรับโทเค็นกันเถอะ 💎",
    "ยอดเยี่ยม! คุณเข้าใจระบบโทเค็นแล้ว! 🎉"
  ];

  const handleDragStart = (actionId: string) => {
    setDraggedAction(actionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, zone: string) => {
    e.preventDefault();
    
    if (!draggedAction) return;
    
    const action = tokenActions.find(a => a.id === draggedAction);
    if (!action) return;

    if (action.targetZone === zone) {
      // Success!
      setCompletedActions(prev => [...prev, draggedAction]);
      setCurrentStep(prev => prev + 1);
      
      toast({
        title: "🎉 สำเร็จ!",
        description: `เรียนรู้ ${action.title} แล้ว!`,
      });

      // Check if all completed
      if (completedActions.length + 1 === tokenActions.length) {
        setShowSuccess(true);
        setTimeout(() => {
          onNext();
        }, 3000);
      }
    } else {
      // Wrong zone
      toast({
        title: "❌ ลองใหม่",
        description: "ลากไปยังเป้าหมายที่ถูกต้องนะ",
        variant: "destructive",
      });
    }
    
    setDraggedAction(null);
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
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>

        {/* Main Game Card */}
        <Card className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-cyan-500/30 backdrop-blur-sm overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
          
          {/* Floating sparkles */}
          <Sparkles className="absolute top-6 right-12 w-4 h-4 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute bottom-12 left-16 w-3 h-3 text-cyan-400 animate-pulse" />

          <CardContent className="p-8 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center border-2 border-white/20">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Token Basics
              </h1>
              <p className="text-gray-300 text-lg">
                ซื้อ ส่ง และรับโทเค็น
              </p>
            </div>

            {/* MeeBot Speech Bubble */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4 mb-8 relative">
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-l border-b border-cyan-500/30 rotate-45"></div>
              
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                  <img 
                    src={logoUrl} 
                    alt="MeeBot" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <p className="text-cyan-100 text-sm italic leading-relaxed">
                    {showSuccess ? 
                      "🎉 เยี่ยมเลย! คุณเข้าใจการใช้โทเค็นแล้ว! พร้อมไปขั้นต่อไปมั้ย? 🚀" :
                      meeBotMessages[currentStep] || meeBotMessages[0]
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Game Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Token Actions (Draggable) */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  การใช้งานโทเค็น
                </h3>
                
                <div className="space-y-3">
                  {tokenActions.map((action) => (
                    <div
                      key={action.id}
                      draggable={!action.completed}
                      onDragStart={() => handleDragStart(action.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        action.completed
                          ? 'bg-green-500/10 border-green-500/30 opacity-60'
                          : 'bg-gray-800/50 border-gray-600 hover:border-cyan-400/50 cursor-grab active:cursor-grabbing hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{action.title}</h4>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                        {action.completed && (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drop Zones */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  ปลายทาง
                </h3>
                
                <div className="space-y-4">
                  {/* Wallet Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'wallet-zone')}
                    className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 min-h-[120px] flex items-center justify-center ${
                      draggedAction && (draggedAction === 'buy' || draggedAction === 'receive')
                        ? 'border-green-400 bg-green-500/10'
                        : 'border-gray-500 bg-gray-800/30'
                    }`}
                  >
                    <div className="text-center">
                      <Wallet className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <p className="text-white font-medium">💰 กระเป๋าของคุณ</p>
                      <p className="text-gray-400 text-sm">สำหรับเก็บและรับโทเค็น</p>
                    </div>
                  </div>

                  {/* Friend Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'friend-zone')}
                    className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 min-h-[120px] flex items-center justify-center ${
                      draggedAction === 'send'
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-gray-500 bg-gray-800/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-sm">👥</span>
                      </div>
                      <p className="text-white font-medium">🤝 เพื่อนของคุณ</p>
                      <p className="text-gray-400 text-sm">สำหรับส่งโทเค็นไป</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>ความคืบหน้า</span>
                <span>{completedActions.length}/{tokenActions.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedActions.length / tokenActions.length) * 100}%` }}
                ></div>
              </div>
            </div>

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

              {showSuccess && (
                <Button
                  onClick={onNext}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                >
                  <span>ขั้นต่อไป</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Hint */}
            <div className="mt-6 pt-4 border-t border-slate-600/30">
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
                <p className="leading-relaxed">
                  <strong>เคล็ดลับ:</strong> ลากไอคอนการใช้งานไปยังปลายทางที่เหมาะสม - 
                  ซื้อ/รับโทเค็น → กระเป๋า, ส่งโทเค็น → เพื่อน
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress hint */}
        <p className="text-gray-500 text-sm text-center">
          ขั้นที่ 3 จาก 5 • เรียนรู้ Token Basics แล้วได้ +120 EXP
        </p>
      </div>
    </div>
  );
}
