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
  // Initialize from localStorage if available
  const getInitialStep = () => {
    const saved = localStorage.getItem('meechain_onboarding_step');
    return saved ? parseInt(saved) : 1;
  };

  const getInitialData = () => {
    const saved = localStorage.getItem('meechain_onboarding_data');
    return saved ? JSON.parse(saved) : {};
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(getInitialData);
  
  const totalSteps = 7;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      localStorage.setItem('meechain_onboarding_step', newStep.toString());
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      localStorage.setItem('meechain_onboarding_step', newStep.toString());
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    const newData = { ...onboardingData, ...data };
    setOnboardingData(newData);
    localStorage.setItem('meechain_onboarding_data', JSON.stringify(newData));
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setOnboardingData({});
    // Clear all onboarding-related data
    localStorage.removeItem('meechain_onboarding_complete');
    localStorage.removeItem('meechain_user');
    localStorage.removeItem('meechain_mode');
    localStorage.setItem('meechain_onboarding_step', '1');
    localStorage.setItem('meechain_onboarding_data', '{}');
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
