import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingData {
  provider?: string;
  userId?: string;
  user?: any;
  pinSet?: boolean;
  pinHash?: string;
  biometricEnabled?: boolean;
  walletCreated?: boolean;
  walletAddress?: string;
  firstMissionCompleted?: boolean;
  mode?: "demo" | "live";
}

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  onboardingData: OnboardingData;
  nextStep: () => void;
  prevStep: () => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  
  const totalSteps = 7;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setOnboardingData({});
  };

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    onboardingData,
    nextStep,
    prevStep,
    updateOnboardingData,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    // Provide default values when used outside provider
    return {
      currentStep: 1,
      totalSteps: 7,
      onboardingData: {},
      nextStep: () => {},
      prevStep: () => {},
      updateOnboardingData: () => {},
      resetOnboarding: () => {},
    };
  }
  return context;
}
