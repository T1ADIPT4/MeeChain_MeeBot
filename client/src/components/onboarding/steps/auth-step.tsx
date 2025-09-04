import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/hooks/use-onboarding";
import { apiRequest } from "@/lib/queryClient";

interface AuthStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function AuthStep({ onNext, onPrev }: AuthStepProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateOnboardingData } = useOnboarding();

  const handleAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate social auth
      const mockUserData = {
        provider,
        socialId: `${provider}_${Date.now()}`,
        email: `user@${provider.toLowerCase()}.com`,
        firstName: "ผู้ใช้",
        lastName: "ทดสอบ",
        profileImageUrl: `https://via.placeholder.com/150?text=${provider}`
      };

      const response = await apiRequest("POST", "/api/auth/social", mockUserData);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      updateOnboardingData({ 
        provider, 
        userId: data.user.id,
        user: data.user 
      });
      
      setIsAuthenticated(true);
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `เข้าสู่ระบบด้วย ${provider} เรียบร้อยแล้ว`,
      });
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">เข้าสู่ระบบ</h3>
        <p className="text-muted-foreground text-sm">
          เลือกวิธีการเข้าสู่ระบบที่คุณต้องการ
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <Button
          onClick={() => handleAuth("Google")}
          disabled={isLoading}
          className="w-full bg-white text-gray-900 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-200 shadow-sm"
          data-testid="button-auth-google"
        >
          <span className="text-red-500 text-lg">G</span>
          เข้าสู่ระบบด้วย Google
        </Button>
        
        <Button
          onClick={() => handleAuth("Facebook")}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all duration-200 shadow-sm"
          data-testid="button-auth-facebook"
        >
          <span className="text-white text-lg">f</span>
          เข้าสู่ระบบด้วย Facebook
        </Button>
        
        <Button
          onClick={() => handleAuth("LINE")}
          disabled={isLoading}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-green-600 transition-all duration-200 shadow-sm"
          data-testid="button-auth-line"
        >
          <span className="text-white text-lg">L</span>
          เข้าสู่ระบบด้วย LINE
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          className="flex-1 py-3 rounded-xl font-semibold"
          data-testid="button-auth-prev"
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={onNext}
          disabled={!isAuthenticated}
          className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          data-testid="button-auth-next"
        >
          ถัดไป
        </Button>
      </div>
    </div>
  );
}
