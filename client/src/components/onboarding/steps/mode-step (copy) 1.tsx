import { ToggleRight, Play, Rocket, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/hooks/use-onboarding";

interface ModeStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function ModeStep({ onNext, onPrev }: ModeStepProps) {
  const { toast } = useToast();
  const { updateOnboardingData } = useOnboarding();

  const handleSelectMode = (mode: "demo" | "live") => {
    updateOnboardingData({ mode });
    localStorage.setItem('meechain_mode', mode);
    
    const modeText = mode === "demo" ? "โหมดทดลองใช้" : "โหมดใช้งานจริง";
    toast({
      title: `เข้าสู่${modeText}`,
      description: `คุณได้เลือก${modeText}เรียบร้อยแล้ว`,
    });
    
    setTimeout(() => onNext(), 1000);
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <ToggleRight className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">เลือกโหมดการใช้งาน</h3>
        <p className="text-muted-foreground text-sm">
          เริ่มต้นด้วยโหมดที่เหมาะสมกับคุณ
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Demo Mode */}
        <div 
          onClick={() => handleSelectMode("demo")}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 cursor-pointer hover:bg-blue-500/20 transition-all duration-200"
          data-testid="card-demo-mode"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1 text-foreground">โหมดทดลองใช้</h4>
              <p className="text-sm text-muted-foreground mb-2">
                เหมาะสำหรับผู้เริ่มต้น ใช้งานได้ทันทีโดยไม่มีความเสี่ยง
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-500">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>ไม่ใช้เงินจริง</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>เรียนรู้ได้อย่างปลอดภัย</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mode */}
        <div 
          onClick={() => handleSelectMode("live")}
          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 cursor-pointer hover:bg-green-500/20 transition-all duration-200"
          data-testid="card-live-mode"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1 text-foreground">โหมดใช้งานจริง</h4>
              <p className="text-sm text-muted-foreground mb-2">
                เหมาะสำหรับผู้ที่มีประสบการณ์ใช้งาน crypto
              </p>
              <div className="flex items-center gap-4 text-xs text-green-500">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>ใช้เงินจริง</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>ฟีเจอร์ครบทุกอย่าง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          className="flex-1 py-3 rounded-xl font-semibold"
          data-testid="button-mode-prev"
        >
          ย้อนกลับ
        </Button>
      </div>
    </div>
  );
}
