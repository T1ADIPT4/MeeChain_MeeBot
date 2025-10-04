
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { Wallet } from "lucide-react";
import logoUrl from "@assets/branding/logo.png";

export default function Home() {
  const [location, navigate] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showBrandName, setShowBrandName] = useState(false);
  const [brandText, setBrandText] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const fullBrandName = "MeeChain Wallet";

  useEffect(() => {
    const isCompleted = localStorage.getItem('meechain_onboarding_complete');
    const user = localStorage.getItem('meechain_user');
    
    // ถ้าทำ onboarding เสร็จแล้วและมีข้อมูลผู้ใช้ ให้ไปหน้า dashboard ทันที
    if (isCompleted && user) {
      navigate('/dashboard');
      return;
    }
    
    if (!isCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      // Show logo with scale animation
      setTimeout(() => setShowLogo(true), 500);
      
      // Show brand name after logo appears
      setTimeout(() => setShowBrandName(true), 1500);
      
      // Type brand name letter by letter
      setTimeout(() => {
        let currentText = "";
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index < fullBrandName.length) {
            currentText += fullBrandName[index];
            setBrandText(currentText);
            index++;
          } else {
            clearInterval(typeInterval);
            // Show description after typing is complete
            setTimeout(() => setShowDescription(true), 500);
            // Show button after description
            setTimeout(() => setShowButton(true), 1000);
            // Hide loading state
            setTimeout(() => setIsLoading(false), 1500);
          }
        }, 100);
      }, 2000);
    };

    sequence();
  }, []);

  const handleStartOnboarding = () => {
    // Clear all onboarding-related localStorage completely
    localStorage.removeItem('meechain_onboarding_complete');
    localStorage.removeItem('meechain_onboarding_step');
    localStorage.removeItem('meechain_onboarding_data');
    localStorage.removeItem('meechain_user');
    localStorage.removeItem('meechain_mode');
    
    // Reset to initial state
    localStorage.setItem('meechain_onboarding_step', '1');
    localStorage.setItem('meechain_onboarding_data', '{}');
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('meechain_onboarding_complete', 'true');
    // เปลี่ยนเส้นทางไปหน้า dashboard หลังจบ onboarding
    navigate('/dashboard');
  };

  if (showOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  // Check if user has completed onboarding
  const user = localStorage.getItem('meechain_user');
  const isOnboardingComplete = localStorage.getItem('meechain_onboarding_complete');

  if (isOnboardingComplete && user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <img src={logoUrl} alt="MeeChain Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            ยินดีต้อนรับสู่ MeeChain Wallet
          </h1>
          <p className="text-purple-200 mb-8 max-w-md text-lg">
            กระเป๋าเงินดิจิทัลของคุณพร้อมใช้งานแล้ว
          </p>
          <div className="space-y-4">
            <Link 
              to="/missions"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
              data-testid="link-missions"
            >
              ดูภารกิจ & รางวัล
            </Link>
            <br />
            <button 
              onClick={handleStartOnboarding}
              className="bg-gray-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors"
              data-testid="button-restart-onboarding"
            >
              เริ่มต้นใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      {/* Loading Animation */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center">
          <div className="text-center space-y-8">
            {/* Animated Logo */}
            <div className={`
              transform transition-all duration-1000 ease-out
              ${showLogo ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'}
            `}>
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl relative">
                <img 
                  src={logoUrl} 
                  alt="MeeChain Logo" 
                  className="w-24 h-24 animate-pulse" 
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-3xl animate-pulse"></div>
              </div>
            </div>

            {/* Brand Name Animation */}
            <div className={`
              transform transition-all duration-700 ease-out
              ${showBrandName ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            `}>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent min-h-[60px] flex items-center justify-center">
                {brandText}
                <span className="animate-pulse text-blue-400">|</span>
              </h1>
            </div>

            {/* Description */}
            <div className={`
              transform transition-all duration-500 ease-out
              ${showDescription ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <p className="text-purple-200 text-lg max-w-md mx-auto">
                กระเป๋าเงินดิจิทัลที่ปลอดภัย รองรับ Web3 และ DeFi
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`
        text-center transform transition-all duration-1000 ease-out
        ${!isLoading ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}>
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
          <img src={logoUrl} alt="MeeChain Logo" className="w-16 h-16" />
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
          className={`
            bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold 
            hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg
            transform ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          เริ่มต้นใช้งาน
        </button>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
