import { CheckCircle, Shield, Wallet, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  return (
    <div className="p-6 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">เสร็จสิ้น!</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        การตั้งค่าเสร็จสมบูรณ์แล้ว ตอนนี้คุณพร้อมใช้งาน MeeChain Wallet!
      </p>
      
      {/* Summary Cards */}
      <div className="space-y-3 mb-8 text-left">
        <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-foreground">ความปลอดภัยตั้งค่าเรียบร้อย</span>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
          <Wallet className="w-4 h-4 text-green-500" />
          <span className="text-sm text-foreground">Smart Wallet สร้างเสร็จแล้ว</span>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
          <Gift className="w-4 h-4 text-green-500" />
          <span className="text-sm text-foreground">ได้รับรางวัลต้อนรับ 100 MEE</span>
        </div>
      </div>

      <Button
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
        data-testid="button-complete-onboarding"
      >
        เริ่มใช้งาน MeeChain
      </Button>
    </div>
  );
}
