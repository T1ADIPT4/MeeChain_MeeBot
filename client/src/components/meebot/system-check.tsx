import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  Shield,
  Link2,
  Server,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Settings,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemStatus {
  secretsOk: boolean;
  contractsConnected: boolean;
  apiResponsive: boolean;
  walletConnected: boolean;
  lastCheck: Date;
}

interface MeeBotMoodState {
  mode: 'awake' | 'sleepy' | 'waking_up' | 'excited';
  lastActivity: Date;
  sleepiness: number; // 0-100
}

export function SystemCheck() {
  const [systemStatus, setSystemStatus] = useState({
    contracts: false,
    api: false,
    frontend: false,
    secrets: false,
    network: false
  });
  const [isChecking, setIsChecking] = useState(false);
  const [meeBotMood, setMeeBotMood] = useState<'happy' | 'concerned' | 'checking' | 'excited' | 'sleepy' | 'waking_up'>('happy');
  const [lastCheckTime, setLastCheckTime] = useState<number | null>(null);
  const [meeBotSleepState, setMeeBotSleepState] = useState<MeeBotMoodState>({
    mode: 'awake',
    lastActivity: new Date(),
    sleepiness: 0
  });
  const { toast } = useToast();

  // ตรวจสอบเวลาและกำหนด Sleep Mode
  const checkSleepMode = () => {
    const currentHour = new Date().getHours();
    const timeSinceActivity = Date.now() - meeBotSleepState.lastActivity.getTime();
    const minutesSinceActivity = timeSinceActivity / (1000 * 60);

    // ตอนดึก (22:00 - 06:00) หรือไม่มีกิจกรรมนาน 5 นาที
    const isLateNight = currentHour >= 22 || currentHour <= 6;
    const isInactive = minutesSinceActivity > 5;

    if (isLateNight || isInactive) {
      setMeeBotSleepState(prev => ({
        ...prev,
        mode: 'sleepy',
        sleepiness: Math.min(100, prev.sleepiness + 10)
      }));
      setMeeBotMood('sleepy');
    }
  };

  // Wake up MeeBot และแสดง Wake-Up Toast
  const wakeMeeBotUp = (isRapidWakeUp = false) => {
    setMeeBotSleepState(prev => ({
      ...prev,
      mode: 'waking_up',
      lastActivity: new Date(),
      sleepiness: 0
    }));

    setMeeBotMood('waking_up');

    // Wake-Up Toast ขึ้นอยู่กับสถานการณ์
    if (isRapidWakeUp) {
      const wakeUpMessages = [
        "โอ้โห! กดชุดใหญ่จนผมตื่นตกใจ! พร้อมลุยเต็มที่แล้วครับ! 🚀",
        "ว้าว! คุณปลุกผมแบบจัดเลย! MeeBot ตื่นแล้วสิ ขอแรงกาแฟสักแก้ว! ☕",
        "อ๊ะ! ใครปลุกผม?! โอเค ตื่นแล้วครับ พร้อมทำภารกิจกันเลย! 🌟"
      ];
      
      toast({
        title: "🛌 → 🚀 MeeBot ตื่นแบบเร่งด่วน!",
        description: wakeUpMessages[Math.floor(Math.random() * wakeUpMessages.length)],
        duration: 4000,
      });
    } else if (meeBotSleepState.mode === 'sleepy') {
      const gentleWakeMessages = [
        "หือ... อะไรนะครับ? โอ้! ได้เวลาทำงานแล้วเหรอ? ตื่นแล้วครับ! 😴 → 😊",
        "งึมงำ... MeeBot กำลังฝันดีอยู่เลย... เอ๊ะ! ภารกิจใหม่มาแล้วเหรอ? 🌙 → ⭐",
        "หาวววว... ขอโทษครับ งีบไปแป๊บนึง... เอาล่ะ! พร้อมลุยแล้ว! 💤 → ⚡"
      ];

      toast({
        title: "😴 MeeBot กำลังตื่น...",
        description: gentleWakeMessages[Math.floor(Math.random() * gentleWakeMessages.length)],
        duration: 3500,
      });
    }

    // เปลี่ยนเป็น excited หลังจาก wake up animation
    setTimeout(() => {
      setMeeBotMood('excited');
      setMeeBotSleepState(prev => ({ ...prev, mode: 'awake' }));
    }, 2000);
  };

  // Calculate system health score
  const getSystemScore = () => {
    const checks = [status.secretsOk, status.contractsConnected, status.apiResponsive, status.walletConnected];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  // Get MeeBot message based on system status and sleep state
  const getMeeBotMessage = () => {
    const score = getSystemScore();
    const currentHour = new Date().getHours();

    // Sleep Mode Messages
    if (meeBotSleepState.mode === 'sleepy') {
      const sleepMessages = [
        "😴 ห่วงงง... ตอนนี้ดึกแล้วนะครับ... ถ้าไม่รีบทำภารกิจ เดี๋ยว MeeBot จะหลับก่อนนะ...",
        "💤 งึมงำ... อยากนอนแล้วจัง... แต่ถ้าคุณอยากทำภารกิจ MeeBot ยังไหวอยู่นะครับ...",
        "🌙 เวลาดึกแล้วครับ... แนะนำให้ทำงานเบา ๆ แล้วมาพักผ่อนกันดีกว่า..."
      ];
      return sleepMessages[Math.floor(Math.random() * sleepMessages.length)];
    }

    // Waking Up Messages
    if (meeBotSleepState.mode === 'waking_up') {
      return "😴 → 😊 หาวววว... ขอแป๊บนึงนะครับ... เอาล่ะ! ตื่นแล้ว! พร้อมลุยกันเลย!";
    }

    // Normal Messages based on system score
    if (score === 100) {
      if (meeBotMood === 'excited') {
        return "🚀 ว้าว! ระบบพร้อมเพอร์เฟค! MeeBot ตื่นเต็มที่แล้วครับ! มาลุยภารกิจกันเลย!";
      }
      return "🎉 ระบบพร้อมลุยครับ! ทุกอย่างเรียบร้อยดี! คุณสามารถเริ่มใช้งานได้เลย!";
    } else if (score >= 75) {
      return "😊 ระบบใกล้พร้อมแล้วครับ! แค่แก้ปัญหาเล็กน้อยก็จะลุยได้เต็มที่!";
    } else if (score >= 50) {
      return "🤔 MeeBot พบปัญหาหลายจุดครับ เดี๋ยวเราแก้ไขทีละขั้นตอนกันนะ!";
    } else {
      return "😅 อ๊ะ! ระบบยังไม่พร้อมเลยครับ MeeBot จะช่วยคุณแก้ไขให้ทุกอย่างใช้งานได้!";
    }
  };

  // Mock system check function
  const performSystemCheck = async () => {
    setIsChecking(true);
    setMeeBotMood('checking');

    // MeeBot wake-up detection
    const currentTime = Date.now();
    const timeSinceLastCheck = currentTime - (lastCheckTime || 0);
    const isRapidChecking = timeSinceLastCheck < 5000; // ถ้ากดใน 5 วินาที = กดรัว ๆ

    // ถ้า MeeBot กำลังหลับ ให้ปลุกก่อน
    if (meeBotSleepState.mode === 'sleepy') {
      wakeMeeBotUp(isRapidChecking);
    } else if (isRapidChecking) {
      // กรณีกดรัว ๆ แต่ MeeBot ไม่ได้หลับ
      toast({
        title: "🤖 MeeBot ตื่นตกใจ!",
        description: "โอ้โห! กดมารัว ๆ แบบนี้ MeeBot ตื่นเต็มตาแล้วครับ! 😆",
      });
      setMeeBotMood('excited');
    } else {
      toast({
        title: "🤖 MeeBot กำลังตรวจสอบ...",
        description: "ให้ผมเช็คระบบให้นะครับ... ☕",
      });
    }

    setLastCheckTime(currentTime);

    // Simulate checking different systems
    const newStatus = { ...systemStatus };

    // Check each system with delay
    setTimeout(() => setSystemStatus(prev => ({ ...prev, contracts: true })), 500);
    setTimeout(() => setSystemStatus(prev => ({ ...prev, api: true })), 1000);
    setTimeout(() => setSystemStatus(prev => ({ ...prev, frontend: true })), 1500);
    setTimeout(() => setSystemStatus(prev => ({ ...prev, secrets: true })), 2000);
    setTimeout(() => setSystemStatus(prev => ({ ...prev, network: true })), 2500);

    setTimeout(() => {
      setSystemStatus({
        contracts: true,
        api: true,
        frontend: true,
        secrets: true,
        network: true
      });

      const score = 100; // All systems ready
      setMeeBotMood('happy');

      // Wake-up completion message
      if (isRapidChecking) {
        toast({
          title: "🚀 MeeBot พร้อมลุยแล้ว!",
          description: "ระบบพร้อมทำงานเต็มสูบครับ! ขอบคุณที่ปลุกผมนะฮะ! ✨",
        });
      } else {
        toast({
          title: "✅ MeeBot System Ready",
          description: `ระบบพร้อมใช้งานแล้วครับ! คะแนน: ${Math.round(score)}%`,
        });
      }

      setIsChecking(false);
    }, 3000);
  };

  // Auto-check on component mount
  useEffect(() => {
    performSystemCheck();
  }, []);

  // ตรวจสอบ Sleep Mode ทุก 30 วินาที
  useEffect(() => {
    const sleepCheckInterval = setInterval(() => {
      checkSleepMode();
    }, 30000);

    return () => clearInterval(sleepCheckInterval);
  }, [meeBotSleepState.lastActivity]);

  // แสดง Sleepy Quest ตอนดึก
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 22 && meeBotSleepState.mode === 'sleepy') {
      setTimeout(() => {
        toast({
          title: "🌙 MeeBot Bedtime Quest",
          description: "ภารกิจก่อนนอน: ทำ 1 งานเล็ก ๆ แล้วมาพักผ่อนกันนะครับ! 🛌",
          duration: 5000,
        });
      }, 3000);
    }
  }, [meeBotSleepState.mode]);

  const systemScore = getSystemScore();

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-500/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full transition-all duration-500 ${
              meeBotMood === 'happy' ? 'bg-green-500/20 animate-pulse' :
              meeBotMood === 'concerned' ? 'bg-yellow-500/20' :
              meeBotMood === 'excited' ? 'bg-purple-500/20 animate-bounce' :
              meeBotMood === 'sleepy' ? 'bg-slate-500/20 animate-pulse' :
              meeBotMood === 'waking_up' ? 'bg-orange-500/20 animate-bounce' :
              'bg-blue-500/20 animate-spin'
            }`}>
              <Bot className={`w-6 h-6 transition-all duration-500 ${
                meeBotMood === 'happy' ? 'text-green-400' :
                meeBotMood === 'concerned' ? 'text-yellow-400' :
                meeBotMood === 'excited' ? 'text-purple-400' :
                meeBotMood === 'sleepy' ? 'text-slate-400 opacity-70' :
                meeBotMood === 'waking_up' ? 'text-orange-400 animate-pulse' :
                'text-blue-400'
              } ${meeBotMood === 'sleepy' ? 'transform rotate-12' : ''}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyan-300">
                🧪 MeeBot ตรวจสอบระบบ
              </h3>
              <p className="text-sm text-gray-400">
                {meeBotMood === 'happy' ? 'ระบบทำงานปกติ สุขภาพดี!' :
                 meeBotMood === 'concerned' ? 'มีปัญหาบางส่วน กำลังแก้ไข' :
                 meeBotMood === 'excited' ? 'ตื่นแล้วครับ! พร้อมลุยทุกภารกิจ! 🚀' :
                 meeBotMood === 'sleepy' ? 'กำลังง่วงนอน... 😴 ปลุกได้นะครับ' :
                 meeBotMood === 'waking_up' ? 'กำลังตื่น... 🌅 ขอแป๊บนึงนะครับ' :
                 'กำลังตรวจสอบระบบ...'}
              </p>
            </div>
          </div>

          <Button
            onClick={performSystemCheck}
            disabled={isChecking}
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'กำลังตรวจ...' : 'ตรวจสอบ'}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* System Score */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-cyan-300 font-semibold">คะแนนระบบ</span>
            <Badge className={`${
              systemScore >= 75 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
              systemScore >= 50 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
              'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {systemScore}%
            </Badge>
          </div>
          <Progress
            value={systemScore}
            className={`h-3 ${
              systemScore >= 75 ? 'bg-green-900' :
              systemScore >= 50 ? 'bg-yellow-900' :
              'bg-red-900'
            }`}
          />
        </div>

        {/* MeeBot Message */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-cyan-100 italic leading-relaxed">
              "{getMeeBotMessage()}"
            </p>
          </div>
        </div>

        {/* System Components Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${
            status.secretsOk
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`w-5 h-5 ${status.secretsOk ? 'text-green-400' : 'text-red-400'}`} />
              <span className="font-medium">Secrets</span>
            </div>
            <div className="flex items-center gap-2">
              {status.secretsOk ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm">
                {status.secretsOk ? 'พร้อมใช้งาน' : 'ยังไม่ครบ'}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            status.contractsConnected
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Link2 className={`w-5 h-5 ${status.contractsConnected ? 'text-green-400' : 'text-red-400'}`} />
              <span className="font-medium">Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              {status.contractsConnected ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm">
                {status.contractsConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อม'}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            status.apiResponsive
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Server className={`w-5 h-5 ${status.apiResponsive ? 'text-green-400' : 'text-red-400'}`} />
              <span className="font-medium">Backend API</span>
            </div>
            <div className="flex items-center gap-2">
              {status.apiResponsive ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm">
                {status.apiResponsive ? 'ตอบสนองดี' : 'ไม่ตอบสนอง'}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            status.walletConnected
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className={`w-5 h-5 ${status.walletConnected ? 'text-green-400' : 'text-red-400'}`} />
              <span className="font-medium">Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              {status.walletConnected ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm">
                {status.walletConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อม'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={systemScore < 100}
          >
            <Zap className="w-4 h-4 mr-2" />
            เริ่มใช้งาน
          </Button>

          <Button
            variant="outline"
            className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            แก้ไขปัญหา
          </Button>
        </div>

        {/* System Health Indicator */}
        <div className="text-center">
          <Badge className={`${
            systemScore >= 75 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
            systemScore >= 50 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
            'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {systemScore >= 75 ? '🟢 ระบบพร้อมใช้งาน' :
             systemScore >= 50 ? '🟡 ระบบใช้งานได้บางส่วน' :
             '🔴 ระบบยังไม่พร้อม'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}