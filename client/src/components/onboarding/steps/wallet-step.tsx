import { useState } from "react";
import { Wallet, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/hooks/use-onboarding";
import { apiRequest } from "@/lib/queryClient";

interface WalletStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function WalletStep({ onNext, onPrev }: WalletStepProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const { toast } = useToast();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const handleCreateWallet = async () => {
    if (!onboardingData.userId) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาเข้าสู่ระบบก่อนสร้าง Wallet",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiRequest("POST", "/api/wallet/create", {
        userId: onboardingData.userId,
        biometricEnabled: onboardingData.biometricEnabled,
        pinHash: onboardingData.pinHash || null,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      updateOnboardingData({ 
        walletCreated: true, 
        walletAddress: data.wallet.address 
      });
      
      setWalletCreated(true);
      toast({
        title: "Smart Wallet สร้างสำเร็จ",
        description: "กระเป๋าเงินดิจิทัลของคุณพร้อมใช้งานแล้ว",
      });
      
      setTimeout(() => onNext(), 2000);
    } catch (error) {
      console.error('Create wallet error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้าง Smart Wallet ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-xl flex items-center justify-center">
          <Wallet className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">สร้าง Smart Wallet</h3>
        <p className="text-muted-foreground text-sm">
          สร้างกระเป๋าเงินที่รองรับ Account Abstraction
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 mb-6 border border-green-500/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
          <Sparkles className="w-4 h-4 text-green-500" />
          คุณสมบัติพิเศษ
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-500" />
            ไม่ต้องจ่าย Gas Fee ในการทำธุรกรรม
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-500" />
            รองรับการกู้คืนแบบ Social Recovery
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-500" />
            ใช้งานง่าย เหมือนแอปธนาคาร
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-500" />
            รองรับ Multi-Chain
          </li>
        </ul>
      </div>

      <Button
        onClick={handleCreateWallet}
        disabled={isCreating || walletCreated}
        className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 mb-4"
        data-testid="button-create-wallet"
      >
        {isCreating ? "กำลังสร้าง..." : walletCreated ? "✅ สร้างเรียบร้อยแล้ว" : "สร้าง Smart Wallet"}
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          className="flex-1 py-3 rounded-xl font-semibold"
          data-testid="button-wallet-prev"
        >
          ย้อนกลับ
        </Button>
      </div>
    </div>
  );
}
