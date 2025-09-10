
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Sparkles,
  Target,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestStep {
  id: number;
  title: string;
  description: string;
  meeBotTip: string;
  action?: 'click' | 'input' | 'connect' | 'quiz';
  isCompleted?: boolean;
}

interface QuestDetailModalProps {
  questId: string;
  questTitle: string;
  onComplete: () => void;
  onClose: () => void;
}

export function QuestDetailModal({ questId, questTitle, onComplete, onClose }: QuestDetailModalProps) {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Quest steps based on questId
  const getQuestSteps = (questId: string): QuestStep[] => {
    switch (questId) {
      case 'wallet-setup':
        return [
          {
            id: 1,
            title: "🎯 รู้จัก Wallet",
            description: "Wallet คือกระเป๋าดิจิทัลที่เก็บโทเค็นและ NFT ของคุณ",
            meeBotTip: "คิดง่าย ๆ นะ Wallet เหมือนกระเป๋าเงินดิจิทัล แต่ปลอดภัยกว่าเยอะ! 🔒"
          },
          {
            id: 2,
            title: "🔗 เชื่อมต่อ Wallet",
            description: "เชื่อมต่อ MetaMask หรือ WalletConnect กับ MeeChain",
            meeBotTip: "อย่าเพิ่งกลัวนะ! การเชื่อมต่อ Wallet ปลอดภัยแน่นอน ผมดูแลให้! 👀",
            action: 'connect'
          },
          {
            id: 3,
            title: "⚙️ ตั้งค่าเครือข่าย",
            description: "เลือกเครือข่าย Polygon สำหรับ Gas Fee ถูก",
            meeBotTip: "Polygon เป็นเครือข่ายที่ค่าธรรมเนียมถูกมาก ๆ เหมาะกับมือใหม่! 💰",
            action: 'click'
          },
          {
            id: 4,
            title: "✅ ทดสอบการเชื่อมต่อ",
            description: "ตรวจสอบว่า Wallet เชื่อมต่อกับ MeeChain สำเร็จแล้ว",
            meeBotTip: "เก่งมาก! ตอนนี้คุณพร้อมใช้งาน MeeChain แล้ว! 🎉"
          }
        ];
      
      case 'token-basics':
        return [
          {
            id: 1,
            title: "🪙 โทเค็นคืออะไร?",
            description: "โทเค็นเป็นสกุลเงินดิจิทัลที่ใช้ในระบบ Web3",
            meeBotTip: "โทเค็นเหมือนเหรียญในเกม แต่มีมูลค่าจริงและใช้งานได้หลายที่! 🎮"
          },
          {
            id: 2,
            title: "🎁 รับโทเค็นฟรี",
            description: "ใช้ Faucet เพื่อรับโทเค็นทดลองฟรี",
            meeBotTip: "Faucet เหมือนก๊อกน้ำ แต่ไหลออกมาเป็นโทเค็นฟรี! เอาไว้ทดลองได้เลย! 🚰",
            action: 'click'
          },
          {
            id: 3,
            title: "📤 ส่งโทเค็น",
            description: "เรียนรู้การส่งโทเค็นไปยัง Address อื่น",
            meeBotTip: "ระวังให้ดีนะ! Address ต้องถูกต้อง ไม่งั้นโทเค็นจะหายแบบไม่กลับคืน! ⚠️",
            action: 'input'
          },
          {
            id: 4,
            title: "📊 Quiz: Token Basics",
            description: "ทดสอบความรู้เรื่องโทเค็น",
            meeBotTip: "มาทดสอบความรู้กัน! ถ้าตอบผิดไม่เป็นไร ผมจะอธิบายใหม่ให้! 🧠",
            action: 'quiz'
          }
        ];

      default:
        return [
          {
            id: 1,
            title: "📚 เนื้อหาการเรียนรู้",
            description: "เนื้อหาพิเศษสำหรับเควสนี้",
            meeBotTip: "เควสนี้สนุกแน่นอน! ไปลุยกันเลย! 🚀"
          }
        ];
    }
  };

  const questSteps = getQuestSteps(questId);
  const progressPercentage = (completedSteps.length / questSteps.length) * 100;
  const currentStepData = questSteps[currentStep];

  const completeCurrentStep = () => {
    if (completedSteps.includes(currentStep)) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep]);
      
      toast({
        title: "✅ ขั้นตอนสำเร็จ!",
        description: `เสร็จสิ้น: ${currentStepData.title}`,
      });
      
      setIsAnimating(false);
      
      if (currentStep < questSteps.length - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
      } else {
        setTimeout(() => {
          toast({
            title: "🎉 เควสสำเร็จ!",
            description: `ยินดีด้วย! คุณจบ "${questTitle}" แล้ว!`,
          });
          onComplete();
        }, 1500);
      }
    }, 1500);
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      completeCurrentStep();
    } else {
      toast({
        title: "😅 ลองใหม่นะ!",
        description: "ไม่เป็นไร ผมอธิบายให้ฟังใหม่!",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-500/30 text-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {questTitle}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">
                ขั้นตอน {currentStep + 1} จาก {questSteps.length}
              </span>
              <span className="text-cyan-400">
                {Math.round(progressPercentage)}% เสร็จสิ้น
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Current Step */}
          <div className="space-y-6">
            
            {/* Step Content */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-cyan-300">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {currentStepData.description}
                  </p>
                  
                  {/* Action Area */}
                  {currentStepData.action === 'quiz' && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-yellow-300">
                        📝 คำถาม: โทเค็นคืออะไร?
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="outline"
                          className="text-left border-gray-600 text-gray-300 hover:bg-green-500/20 hover:border-green-500/50"
                          onClick={() => handleQuizAnswer(true)}
                        >
                          A) สกุลเงินดิจิทัลในระบบ Web3
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left border-gray-600 text-gray-300 hover:bg-red-500/20 hover:border-red-500/50"
                          onClick={() => handleQuizAnswer(false)}
                        >
                          B) ไฟล์รูปภาพบนอินเทอร์เน็ต
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left border-gray-600 text-gray-300 hover:bg-red-500/20 hover:border-red-500/50"
                          onClick={() => handleQuizAnswer(false)}
                        >
                          C) รหัสผ่านของ Wallet
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {currentStepData.action === 'connect' && (
                    <Button
                      onClick={completeCurrentStep}
                      disabled={isAnimating}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isAnimating ? "กำลังเชื่อมต่อ..." : "เชื่อมต่อ Wallet"}
                    </Button>
                  )}
                  
                  {currentStepData.action === 'click' && (
                    <Button
                      onClick={completeCurrentStep}
                      disabled={isAnimating}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isAnimating ? "กำลังดำเนินการ..." : "ดำเนินการต่อ"}
                    </Button>
                  )}
                  
                  {!currentStepData.action && (
                    <Button
                      onClick={completeCurrentStep}
                      disabled={isAnimating}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      {isAnimating ? "กำลังเรียนรู้..." : "เข้าใจแล้ว!"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* MeeBot Tip */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-1 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    MeeBot Tip
                  </h4>
                  <p className="text-yellow-100 text-sm italic leading-relaxed">
                    "{currentStepData.meeBotTip}"
                  </p>
                </div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ก่อนหน้า
              </Button>
              
              <div className="text-center">
                <div className="flex items-center gap-2">
                  {questSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        completedSteps.includes(index)
                          ? 'bg-green-400'
                          : index === currentStep
                            ? 'bg-cyan-400'
                            : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.min(questSteps.length - 1, prev + 1))}
                disabled={currentStep === questSteps.length - 1 || !completedSteps.includes(currentStep)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                ถัดไป
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
