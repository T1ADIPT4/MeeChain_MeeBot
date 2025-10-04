import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="p-6 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
        <Rocket className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">ยินดีต้อนรับสู่ MeeChain!</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        เราจะช่วยคุณตั้งค่ากระเป๋าเงินดิจิทัลในไม่กี่ขั้นตอน เพื่อประสบการณ์ Web3 ที่ปลอดภัย
      </p>
      <Button 
        onClick={onNext}
        className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
        data-testid="button-start-setup"
      >
        เริ่มต้นตั้งค่า
      </Button>
    </div>
  );
}
