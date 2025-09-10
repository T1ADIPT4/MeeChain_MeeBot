
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Wifi } from 'lucide-react';
import { useMeeBotStatus } from '@/hooks/use-meebot-status';
import { useToast } from '@/hooks/use-toast';

interface ManualNetworkCheckProps {
  targetChainId: string;
  targetNetworkName?: string;
}

export function ManualNetworkCheck({ 
  targetChainId, 
  targetNetworkName = "เครือข่ายที่ต้องการ" 
}: ManualNetworkCheckProps) {
  const { setStatus, setMessage } = useMeeBotStatus();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const meeBotMessages = {
    checking: [
      "กำลังตรวจสอบเครือข่าย... ผมตื่นเต้นมาก! 🔍",
      "อดใจหน่อยนะครับ กำลังดูว่าเครือข่ายตรงไหม 🤔",
      "MeeBot กำลังคิดอยู่... เดี๋ยวจะรู้ผลแล้ว! 🧠"
    ],
    success: [
      "เยี่ยมเลย! เปลี่ยนเครือข่ายสำเร็จแล้วครับ พร้อมลุยภารกิจต่อไปกันเลย! 🎯",
      "ว้าว! คุณทำได้แล้ว! ผมภูมิใจในตัวคุณมาก! 🌟",
      "สุดยอดมาก! เครือข่ายถูกต้องแล้ว มาลุยกันต่อเถอะ! 🚀"
    ],
    error: [
      "อ๊ะ... ยังไม่ตรงนะครับ ลองตรวจสอบอีกครั้งได้เลย ผมอยู่ตรงนี้ ไม่ไปไหน! 💪",
      "เออ... ยังไม่ใช่เครือข่ายที่เราต้องการนะ แต่ไม่เป็นไร เราลองใหม่กันได้! 😊",
      "ยังไม่ถูกนะครับ แต่อย่าห่วงเลย! ผมจะช่วยจนกว่าจะสำเร็จ! 🤝"
    ],
    walletError: [
      "อุ๊ย... MeeBot งงกับเครือข่ายนี้ ลองใหม่อีกทีนะครับ! 😵",
      "เอ๊ะ? wallet ทำงานแปลก ๆ นะ ลองรีเฟรชแล้วลองใหม่ดูครับ! 🔄",
      "โอ๊ย... มีอะไรผิดปกติกับ wallet สักหน่อย ไม่เป็นไรครับ เราลองใหม่กัน! 😅"
    ]
  };

  const getRandomMessage = (type: keyof typeof meeBotMessages) => {
    const messages = meeBotMessages[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const checkNetwork = async () => {
    setIsChecking(true);
    setStatus('waiting');
    setMessage(getRandomMessage('checking'));

    try {
      if (!window.ethereum) {
        throw new Error('No wallet found');
      }

      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // เพิ่ม delay เพื่อให้ผู้ใช้เห็น animation
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (currentChainId === targetChainId) {
        setStatus('success');
        const successMsg = getRandomMessage('success');
        setMessage(successMsg);
        
        toast({
          title: "🎉 เครือข่ายถูกต้อง!",
          description: "MeeBot ยินดีกับคุณมาก!",
        });
      } else {
        setStatus('error');
        const errorMsg = getRandomMessage('error');
        setMessage(errorMsg);
        
        toast({
          title: "🤨 เครือข่ายยังไม่ตรง",
          description: `ตอนนี้: ${currentChainId}, ต้องการ: ${targetChainId}`,
          variant: "destructive"
        });
      }
    } catch (err) {
      setStatus('error');
      const walletErrorMsg = getRandomMessage('walletError');
      setMessage(walletErrorMsg);
      
      toast({
        title: "😵 เกิดข้อผิดพลาด",
        description: "ไม่สามารถตรวจสอบเครือข่ายได้",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Wifi className="w-5 h-5 text-cyan-400" />
                ตรวจสอบเครือข่าย
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                เปลี่ยนเครือข่ายใน wallet แล้วกดตรวจสอบ
              </p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {targetNetworkName}
            </Badge>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span>กรุณาเปลี่ยนเครือข่ายใน wallet ของคุณก่อน</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-4 h-4 text-center">📱</span>
              <span>Target Chain ID: <code className="bg-slate-600 px-2 py-1 rounded text-cyan-300">{targetChainId}</code></span>
            </div>
          </div>

          <Button
            onClick={checkNetwork}
            disabled={isChecking}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                กำลังตรวจสอบ...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                ✅ เปลี่ยนแล้วครับ! ตรวจสอบอีกครั้ง
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
