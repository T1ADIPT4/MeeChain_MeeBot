import { useState, useEffect } from "react";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { Wallet } from "lucide-react";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const isCompleted = localStorage.getItem('meechain_onboarding_complete');
    if (!isCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('meechain_onboarding_complete', 'true');
  };

  if (showOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          MeeChain Wallet
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          กระเป๋าเงินดิจิทัลที่ปลอดภัย รองรับ Web3 และ DeFi
        </p>
        <button 
          onClick={handleStartOnboarding}
          data-testid="button-start-onboarding"
          className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          เริ่มต้นใช้งาน
        </button>
      </div>
    </div>
  );
}
