import { useState } from "react";
import { Trophy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/hooks/use-onboarding";
import { apiRequest } from "@/lib/queryClient";

interface MissionStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function MissionStep({ onNext, onPrev }: MissionStepProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const handleStartMission = async () => {
    setIsStarting(true);
    
    // Simulate mission progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        completeMission();
      }
    }, 200);
  };

  const completeMission = async () => {
    if (!onboardingData.userId) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาเข้าสู่ระบบก่อนทำภารกิจ",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/mission/complete", {
        userId: onboardingData.userId,
        missionId: "first",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      updateOnboardingData({ firstMissionCompleted: true });
      
      setIsCompleted(true);
      toast({
        title: "ภารกิจสำเร็จ! 🎉",
        description: `ได้รับรางวัล ${data.reward.amount} ${data.reward.token}`,
      });
      
      setTimeout(() => onNext(), 2000);
    } catch (error) {
      console.error('Complete mission error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกผลภารกิจได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/10 rounded-xl flex items-center justify-center">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">ภารกิจแรก</h3>
        <p className="text-muted-foreground text-sm">
          ทำภารกิจง่ายๆ เพื่อรับรางวัลต้อนรับ
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-xl p-4 mb-6 border border-green-500/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Gift className="w-4 h-4 text-yellow-500" />
          เรียนรู้เกี่ยวกับ MeeChain
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          ดูวิดีโอแนะนำและทำความเข้าใจฟีเจอร์พื้นฐาน
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground">
              ความคืบหน้า: <span data-testid="text-mission-progress">{isCompleted ? "1/1 สำเร็จ ✅" : "0/1"}</span>
            </span>
            <span className="text-yellow-500 font-semibold">+100 MEE</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-muted"
            data-testid="progress-mission"
          />
        </div>

        <Button
          onClick={handleStartMission}
          disabled={isStarting || isCompleted}
          className="w-full bg-yellow-500 text-yellow-900 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50"
          data-testid="button-start-mission"
        >
          {isStarting ? "กำลังดำเนินการ..." : isCompleted ? "✅ ภารกิจสำเร็จ" : "เริ่มภารกิจ"}
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          className="flex-1 py-3 rounded-xl font-semibold"
          data-testid="button-mission-prev"
        >
          ย้อนกลับ
        </Button>
      </div>
    </div>
  );
}
