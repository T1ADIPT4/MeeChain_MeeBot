import { useState } from "react";
import { Lock, Hash, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/hooks/use-onboarding";
import { apiRequest } from "@/lib/queryClient";

interface SecurityStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function SecurityStep({ onNext, onPrev }: SecurityStepProps) {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [pinSet, setPinSet] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`[data-pin-index="${index + 1}"]`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`[data-pin-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleSetPin = async () => {
    const pinValue = pin.join("");
    if (pinValue.length !== 6) {
      toast({
        title: "PIN ไม่ถูกต้อง",
        description: "กรุณาใส่ PIN 6 หลัก",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{6}$/.test(pinValue)) {
      toast({
        title: "PIN ไม่ถูกต้อง",
        description: "PIN ต้องเป็นตัวเลข 6 หลักเท่านั้น",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/security/pin", {
        userId: onboardingData.userId,
        pin: pinValue,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setPinSet(true);
      updateOnboardingData({ pinSet: true, pinHash: data.pinHash });
      toast({
        title: "ตั้งรหัส PIN สำเร็จ",
        description: "รหัส PIN ของคุณได้รับการตั้งค่าเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Set PIN error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถตั้งรหัส PIN ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/security/biometric", {
        userId: onboardingData.userId,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      setBiometricEnabled(true);
      updateOnboardingData({ biometricEnabled: true });
      toast({
        title: "เปิดใช้งาน Biometric สำเร็จ",
        description: "การยืนยันตัวตนด้วยข้อมูลชีวภาพเปิดใช้งานแล้ว",
      });
    } catch (error) {
      console.error('Enable biometric error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปิดใช้งาน Biometric ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = pinSet || biometricEnabled;

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">ความปลอดภัย</h3>
        <p className="text-muted-foreground text-sm">
          ตั้งค่าความปลอดภัยเพื่อปกป้องกระเป๋าเงินของคุณ
        </p>
      </div>

      {/* PIN Setup */}
      <div className="bg-muted/30 rounded-xl p-4 mb-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Hash className="w-4 h-4 text-primary" />
          ตั้งรหัส PIN (6 หลัก)
        </h4>
        <div className="flex gap-2 justify-center mb-3">
          {pin.map((digit, index) => (
            <Input
              key={index}
              type="password"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handlePinKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold bg-background border-border focus:border-primary"
              maxLength={1}
              data-pin-index={index}
              data-testid={`input-pin-${index}`}
            />
          ))}
        </div>
        <Button
          onClick={handleSetPin}
          disabled={isLoading || pinSet}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          data-testid="button-set-pin"
        >
          {pinSet ? "✅ ตั้งรหัส PIN แล้ว" : "ตั้งรหัส PIN"}
        </Button>
      </div>

      {/* Biometric Setup */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Fingerprint className="w-4 h-4 text-accent" />
          ลายนิ้วมือ / Face ID
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          เปิดใช้งานการยืนยันตัวตนด้วยข้อมูลชีวภาพ
        </p>
        <Button
          onClick={handleEnableBiometric}
          disabled={isLoading || biometricEnabled}
          className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-semibold hover:bg-accent/90 disabled:opacity-50"
          data-testid="button-enable-biometric"
        >
          {biometricEnabled ? "✅ เปิดใช้งานแล้ว" : "เปิดใช้งาน Biometric"}
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          className="flex-1 py-3 rounded-xl font-semibold"
          data-testid="button-security-prev"
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          data-testid="button-security-next"
        >
          ถัดไป
        </Button>
      </div>
    </div>
  );
}
