import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { WelcomeStep } from "./steps/welcome-step";
import { AuthStep } from "./steps/auth-step";
import { SecurityStep } from "./steps/security-step";
import { WalletStep } from "./steps/wallet-step";
import { MissionStep } from "./steps/mission-step";
import { ModeStep } from "./steps/mode-step";
import { CompletionStep } from "./steps/completion-step";
import { useOnboarding } from "@/hooks/use-onboarding";

interface OnboardingModalProps {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { currentStep, totalSteps, nextStep, prevStep, onboardingData } = useOnboarding();
  const [isOpen] = useState(true);

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return <AuthStep onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <SecurityStep onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <WalletStep onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <MissionStep onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <ModeStep onNext={nextStep} onPrev={prevStep} />;
      case 7:
        return <CompletionStep onComplete={onComplete} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="max-w-lg w-full bg-card border-border rounded-2xl shadow-2xl p-0 overflow-hidden"
        data-testid="modal-onboarding"
        aria-describedby="onboarding-description"
      >
        <VisuallyHidden>
          <DialogTitle>การตั้งค่าเริ่มต้น MeeChain Wallet</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden>
          <div id="onboarding-description">
            กระบวนการตั้งค่าเริ่มต้นสำหรับ MeeChain Wallet ใน 7 ขั้นตอน
          </div>
        </VisuallyHidden>
        {/* Progress Header */}
        <div className="p-6 border-b border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">การตั้งค่าเริ่มต้น</h2>
            <div className="text-sm text-muted-foreground">
              ขั้นตอน <span data-testid="text-current-step">{currentStep}</span> จาก {totalSteps}
            </div>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-1 bg-muted"
            data-testid="progress-onboarding"
          />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
