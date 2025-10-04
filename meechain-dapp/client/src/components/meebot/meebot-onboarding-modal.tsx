import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Sparkles, 
  Trophy,
  Target,
  Rocket,
  Heart,
  X,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WalletConnectionFlow } from './wallet-connection-flow';

interface MeeBotOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MissionStep {
  id: number;
  title: string;
  description: string;
  meeBotSays: string;
  isCompleted: boolean;
  badge?: string;
}

export function MeeBotOnboardingModal({ isOpen, onClose }: MeeBotOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const missionSteps: MissionStep[] = [
    {
      id: 1,
      title: "🎯 ตั้งค่าโปรไฟล์",
      description: "รู้จักกันก่อนลุยภารกิจ",
      meeBotSays: "ก่อนจะขึ้นยาน เราต้องรู้จักกันก่อน! ตั้งชื่อ, เลือก avatar, และบอกผมว่าคุณชอบทำงานแบบไหน",
      isCompleted: false,
      badge: "Profile Master"
    },
    {
      id: 2,
      title: "🔗 เชื่อมระบบงาน",
      description: "เชื่อมต่อ TaskPilot กับงานของคุณ",
      meeBotSays: "เชื่อมต่อ TaskPilot กับภารกิจของคุณ เช่น To-Do, Calendar หรือระบบภายใน ผมจะช่วยจัดการให้คุณลุยได้แบบไม่สะดุด!",
      isCompleted: false,
      badge: "Connection Expert"
    },
    {
      id: 3,
      title: "🚀 ภารกิจแรก",
      description: "เริ่มต้นการผจญภัย Web3",
      meeBotSays: "ภารกิจแรกมาแล้ว! พร้อมรับ Badge 'First Flight' ไหม? เราจะเริ่มจากสิ่งง่าย ๆ แล้วค่อยเพิ่มระดับไปเรื่อย ๆ",
      isCompleted: false,
      badge: "First Flight"
    }
  ];

  const [missions, setMissions] = useState(missionSteps);
  const completedMissions = missions.filter(m => m.isCompleted).length;
  const progressPercentage = (completedMissions / missions.length) * 100;

  const handleCompleteMission = (missionId: number) => {
    setIsAnimating(true);

    setTimeout(() => {
      setMissions(prev => prev.map(mission => 
        mission.id === missionId ? { ...mission, isCompleted: true } : mission
      ));

      const mission = missions.find(m => m.id === missionId);
      if (mission) {
        toast({
          title: "🎉 ภารกิจสำเร็จ!",
          description: `ได้รับ Badge "${mission.badge}" แล้ว! สุดยอดเลย!`,
        });
      }

      setIsAnimating(false);

      if (currentStep < missions.length - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
      }
    }, 1500);
  };

  const currentMission = missions[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-500/30 text-white overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-6 border-b border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* MeeBot Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20 animate-pulse">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-spin" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                    🚀 ยินดีต้อนรับสู่ TaskPilot
                  </h2>
                  <p className="text-cyan-200 text-sm">
                    "อย่าห่วงเลย ถ้าคุณล้ม ผมจะช่วยลุก ถ้าคุณลุย ผมจะลุยไปด้วย!"
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-cyan-300 font-semibold">
                ความคืบหน้าภารกิจ ({completedMissions}/{missions.length})
              </span>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                <Trophy className="w-3 h-3 mr-1" />
                Level 1
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-slate-700" />
            <p className="text-xs text-gray-400 mt-2">
              {progressPercentage === 100 ? "🎉 ครบทุกภารกิจแล้ว!" : "กำลังก้าวหน้าไปเรื่อย ๆ"}
            </p>
          </div>

          {/* Current Mission Content */}
          <div className="p-6">
            {currentStep === 0 ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center relative">
                  <img 
                    src={logoUrl} 
                    alt="MeeBot" 
                    className="w-12 h-12 object-contain"
                  />
                  <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
                    👋
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    สวัสดีครับ! ผม MeeBot
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    ผมจะเป็นผู้ช่วยสุดเท่ของคุณใน MeeChain! 
                    พร้อมเริ่มต้นการผจญภัยในโลก Web3 ไหมครับ?
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-300 font-semibold mb-2">🎯 สิ่งที่คุณจะได้เรียนรู้</h4>
                  <ul className="text-sm text-blue-100 space-y-1 text-left">
                    <li>• การใช้งาน Smart Contracts</li>
                    <li>• การทำธุรกรรม DeFi</li>
                    <li>• การสะสมและอัพเกรด NFT Badge</li>
                    <li>• การรับ rewards จากภารกิจต่างๆ</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setCurrentStep(1)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3 text-lg"
                >
                  เริ่มต้นกันเลย! 🚀
                </Button>
              </div>
            ) : currentStep === 1 ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center relative">
                  <img 
                    src={logoUrl} 
                    alt="MeeBot" 
                    className="w-12 h-12 object-contain"
                  />
                  <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
                    👋
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    สวัสดีครับ! ผม MeeBot
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    ผมจะเป็นผู้ช่วยสุดเท่ของคุณใน MeeChain! 
                    พร้อมเริ่มต้นการผจญภัยในโลก Web3 ไหมครับ?
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-300 font-semibold mb-2">🎯 สิ่งที่คุณจะได้เรียนรู้</h4>
                  <ul className="text-sm text-blue-100 space-y-1 text-left">
                    <li>• การใช้งาน Smart Contracts</li>
                    <li>• การทำธุรกรรม DeFi</li>
                    <li>• การสะสมและอัพเกรด NFT Badge</li>
                    <li>• การรับ rewards จากภารกิจต่างๆ</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3 text-lg"
                >
                  เริ่มต้นกันเลย! 🚀
                </Button>
              </div>
            ) : currentStep === 2 ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">ภารกิจแรก: เชื่อมต่อ Wallet</h3>
                  <p className="text-gray-300 text-sm">
                    เริ่มต้นด้วยการเชื่อมต่อ wallet เพื่อรับ badge แรกของคุณ!
                  </p>
                </div>

                <WalletConnectionFlow />

                <div className="flex gap-3">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-800"
                  >
                    ย้อนกลับ
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white"
                  >
                    ขั้นต่อไป
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Current Mission Content */
              <div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-yellow-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-cyan-300">
                      {currentMission.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {currentMission.description}
                    </p>

                    {/* MeeBot Speech Bubble */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4 relative">
                      <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-cyan-500/30"></div>
                      <div className="flex items-start gap-3">
                        <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <p className="text-cyan-100 italic leading-relaxed">
                          "{currentMission.meeBotSays}"
                        </p>
                      </div>
                    </div>

                    {/* Mission Action */}
                    <div className="flex items-center gap-3">
                      {currentMission.isCompleted ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check className="w-5 h-5" />
                          <span className="font-semibold">ภารกิจสำเร็จ!</span>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {currentMission.badge}
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleCompleteMission(currentMission.id)}
                          disabled={isAnimating}
                          className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400 font-semibold"
                        >
                          {isAnimating ? (
                            <>
                              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                              กำลังดำเนินการ...
                            </>
                          ) : (
                            <>
                              <Rocket className="w-4 h-4 mr-2" />
                              เริ่มภารกิจ!
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mission List */}
            <div className="space-y-3 mb-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                รายการภารกิจทั้งหมด
              </h4>

              {missions.map((mission, index) => (
                <div 
                  key={mission.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    index === currentStep 
                      ? 'bg-cyan-500/10 border-cyan-500/30' 
                      : mission.isCompleted 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    mission.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-slate-700 text-gray-400'
                  }`}>
                    {mission.isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{mission.id}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`font-medium ${
                      mission.isCompleted ? 'text-green-300' : 
                      index === currentStep ? 'text-cyan-300' : 'text-gray-300'
                    }`}>
                      {mission.title}
                    </p>
                  </div>

                  {mission.isCompleted && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      {mission.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {completedMissions === missions.length ? (
                <Button 
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  เริ่มใช้งาน TaskPilot!
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="border-slate-600 text-gray-300 hover:bg-slate-800"
                  >
                    ข้ามไปก่อน
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, missions.length - 1))}
                    disabled={currentStep >= missions.length - 1}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    ภารกิจถัดไป
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}