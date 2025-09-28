import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import {
  Wallet,
  Send,
  QrCode,
  History,
  TrendingUp,
  GitBranch,
  Calendar,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Bot,
  Sparkles,
  Heart,
  Menu,
  User,
  Eye,
  EyeOff,
  Copy,
  Play,
  Pause,
  Square,
  Coins,
  Download,
  MessageCircle, // Added MessageCircle icon
  BookOpen, // Added BookOpen icon
  ArrowRightLeft, // Added ArrowRightLeft icon
  Target, // Added Target icon
  Trophy, // Added Trophy icon
  RefreshCw, // Added RefreshCw icon
  Bug // Added Bug icon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@/lib/web3-utils';
import { QRCodeGenerator } from '@/components/web3/qr-code-generator';
import logoUrl from '@assets/branding/logo.png';
import { MeeBotSecretsAlert } from '@/components/meebot/secrets-alert';
import { Link } from 'wouter'; // Assuming Link is needed for navigation
import { LoadingSpinner, LoadingDots } from '@/components/ui/loading-spinner';
import ContractHealthMonitor from '@/components/meebot/contract-health-monitor';
import BadgeViewer from '@/components/nft/badge-viewer';
import { useSmartContracts } from '@/hooks/use-smart-contracts';
import { VoiceCoach } from '@/components/meebot/voice-coach';
import { BadgeCollection } from '@/components/nft/badge-collection';
import { BadgeMinter } from '@/components/nft/badge-minter'; // Imported BadgeMinter
import { QuestTracker } from '@/components/nft/quest-tracker'; // Imported QuestTracker
import { TokenManager } from '@/components/web3/token-manager';
import { DeploymentChecker } from '@/components/meebot/deployment-checker';
import { BalanceCardSkeleton, WalletInfoSkeleton } from '@/components/ui/balance-card-skeleton';

// Placeholder for the new FootballZone component
const FootballZone = () => {
  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm mt-6">
      <CardContent>
        <h2 className="text-xl font-semibold text-green-300 mb-4">Football Zone</h2>
        <p className="text-slate-400">Welcome to the Football Zone! Manage your football NFTs and quests here.</p>
        {/* Add football-specific components here */}
      </CardContent>
    </Card>
  );
};


export default function DashboardPage() {
  const [, navigate] = useLocation(); // navigate is used instead of useLocation() directly
  const [showBalance, setShowBalance] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [isTaskRunning, setIsTaskRunning] = useState(false);
  const [taskData, setTaskData] = useState([10, 12, 16, 14, 18, 22, 24]);
  const [chartLabels, setChartLabels] = useState(['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00']);
  const { toast } = useToast();
  const logoRef = useRef<HTMLDivElement>(null);
  const [showDebugModal, setShowDebugModal] = useState(false); // Added state for debug modal

  // State สำหรับปุ่ม มีบอท
  const [isBotReady, setIsBotReady] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [botEmotion, setBotEmotion] = useState<'happy' | 'waving' | 'excited'>('happy');
  const [botStatus, setBotStatus] = useState<'idle' | 'running' | 'paused' | 'stopped'>('idle'); // Added botStatus state

  // Smart Contracts Hook
  const { userAddress, isConnected, connectWallet } = useSmartContracts();

  // Breathing animation for logo
  useEffect(() => {
    let scale = 1;
    let direction = 1;
    let frame: number;

    function animate() {
      if (logoRef.current) {
        scale += direction * 0.005;
        if (scale > 1.05) direction = -1;
        if (scale < 0.95) direction = 1;
        logoRef.current.style.transform = `scale(${scale})`;
      }
      frame = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fetch user wallet data
  const { data: walletData, isLoading } = useQuery({
    queryKey: ['/api/wallet/me'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch wallet');
      }
      return response.json();
    },
  });

  // Fetch token balances
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['/api/wallet/balances'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/balances', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch balances');
      }
      return response.json();
    },
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    // Vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 50, 200]);
    }

    // Toast notification
    toast({
      title: type === 'success' ? "✅ สำเร็จ" : "❌ ข้อผิดพลาด",
      description: msg,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  };

  const startTask = () => {
    setIsTaskRunning(true);
    showToast("เริ่มทำงานแล้วครับ! 🚀");
    // Simulate new data point
    const newTime = new Date().toLocaleTimeString().slice(0, 5);
    const newValue = Math.floor(Math.random() * 30) + 10;
    setTaskData(prev => [...prev.slice(-6), newValue]);
    setChartLabels(prev => [...prev.slice(-6), newTime]);
  }

  const pauseTask = () => {
    setIsTaskRunning(false);
    showToast("หยุดชั่วคราวแล้ว ⏸️");
  }

  const stopTask = () => {
    setIsTaskRunning(false);
    showToast("หยุดการทำงานแล้ว ⏹️");
  }

  const handleCopyAddress = async () => {
    if (!walletData?.address) return;

    try {
      await navigator.clipboard.writeText(walletData.address);
      showToast("ที่อยู่ Wallet ถูกคัดลอกแล้ว");
    } catch (error) {
      showToast("ไม่สามารถคัดลอกที่อยู่ได้", 'error');
    }
  };

  // Function สำหรับปุ่ม มีบอท
  const handleBotClick = () => {
    // เล่นเสียงเอฟเฟกต์ (หากเบราว์เซอร์รองรับ)
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    setBotEmotion('excited');

    toast({
      title: "🎉 เฮ้ย! พร้อมลุยแล้ว!",
      description: "มาเริ่มภารกิจใหม่ไปด้วยกัน! ผมจะเป็นเมนเตอร์ให้เลย! 🧠💪",
    });

    // รีเซ็ต emotion หลัง 2 วินาที
    setTimeout(() => setBotEmotion('happy'), 2000);

    // นำทางไปยังหน้า MeeBot
    navigate('/meebot');
  };

  const getBotMessage = () => {
    if (isHovering) {
      return "พร้อมลุยภารกิจใหม่กันมั้ย? ผมเตรียมพลังไว้ให้แล้ว! ⚡✨";
    }
    return "สวัสดีครับ! วันนี้มีภารกิจอะไรให้ลุยบ้างนะ? 🤖💪";
  };

  const handleTaskControl = (action: 'start' | 'pause' | 'stop') => {
    if (action === 'start') {
      startTask();
    } else if (action === 'pause') {
      pauseTask();
    } else if (action === 'stop') {
      // Ensure confirmation before stopping all tasks
      if (window.confirm('🤖 MeeBot ถาม: แน่ใจไหมว่าจะหยุดทำงานทั้งหมด?')) {
        stopTask();
        toast({
          title: "🛑 MeeBot หยุดทำงานแล้ว",
          description: "ได้พักผ่อนหน่อยนะ! เรียกได้เมื่อไหร่ก็ได้ครับ 😴",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Enhanced Header */}
        <nav className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 p-4">
          <Button variant="ghost" size="sm" className="text-blue-300">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-blue-300">MeeChain Dashboard</h1>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </nav>

        <div className="px-6 pb-6 space-y-6">
          <div className="pt-6">
            <WalletInfoSkeleton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BalanceCardSkeleton />
            <BalanceCardSkeleton />
            <BalanceCardSkeleton />
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <LoadingSpinner size="lg" />
              <p className="text-cyan-400">กำลังโหลดข้อมูล Wallet...</p>
              <LoadingDots />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
        <AppSidebar
          userAddress={userAddress}
          isConnected={isConnected}
          userName={walletData?.name || 'Anonymous User'}
          userLevel={walletData?.level || 1}
          userTier={walletData?.tier || 'Bronze'}
        />

        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with Hamburger Menu */}
          <nav className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 p-4">
            <SidebarTrigger className="text-blue-300" />
            <h1 className="text-xl font-bold text-blue-300">MeeChain Dashboard</h1>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </nav>

          <div className="flex-1 px-6 pb-6 space-y-6 overflow-auto">
        {/* === ส่วนที่ 1: ส่วนหัว (Profile & Quick Stats) === */}

        {/* Profile Header */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-blue-400/50">
                  <AvatarImage src="/api/placeholder/64/64" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                    {walletData?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {walletData?.name || 'Anonymous User'}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {walletData?.email || 'user@meechain.app'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {walletData?.tier || 'Bronze'} Member
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                      Level {walletData?.level || 1}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => connectWallet()}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Connect Wallet
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="h-8 w-8 p-0"
                  title={showBalance ? "ซ่อนยอด" : "แสดงยอด"}
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Compact Contract Health Monitor */}
            <ContractHealthMonitor />

            {/* Deployment Checker */}
            <DeploymentChecker />
          </CardContent>
        </Card>

        {/* MeeBot Secrets Health Check - แถบแจ้งเตือนด้านบน */}
            <MeeBotSecretsAlert />
            {/* Main MeeBot Card with Control Buttons */}
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm mt-6">
              <CardContent className="p-6">
                {/* MeeBot Logo - ลดขนาดลงเล็กน้อย */}
                <div
                  ref={logoRef}
                  className="w-24 h-24 mx-auto mb-3 bg-slate-700/50 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  }}
                >
                  <img
                    src={logoUrl}
                    alt="MeeBot Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
                  MeeBot
                </h2>

                {/* สถานะ MeeBot พร้อม log ล่าสุด */}
                {isTaskRunning ? (
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      <span className="font-medium">กำลังทำงาน</span>
                    </div>
                    <p className="text-xs text-slate-400">Log ล่าสุด: Task completed successfully at {new Date().toLocaleTimeString()}</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <p className="text-slate-400">พร้อมเริ่มทำงาน</p>
                    <p className="text-xs text-slate-500">กดปุ่ม Start เพื่อเริ่มการติดตาม</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MeeBot Control Panel - จัดกลุ่มในกรอบ */}
            <Card className="bg-slate-900/50 border-slate-600/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  MeeBot Control Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ปุ่มควบคุมหลัก - จัดแนวตั้งบนมือถือ, แนวนอนบน desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Button
                    size="lg"
                    className={`${
                      isTaskRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-green-600 hover:bg-green-500 text-white'
                    } font-medium transition-all duration-200 py-3 px-4 h-auto`}
                    onClick={isTaskRunning ? pauseTask : startTask}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {isTaskRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      <span className="text-sm font-medium">
                        {isTaskRunning ? 'หยุดชั่วคราว' : 'เริ่มทำงาน'}
                      </span>
                    </div>
                  </Button>

                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-500 text-white font-medium transition-all duration-200 py-3 px-4 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (window.confirm('🤖 MeeBot ถาม: แน่ใจไหมว่าจะหยุดทำงานทั้งหมด?')) {
                        stopTask();
                        toast({
                          title: "🛑 MeeBot หยุดทำงานแล้ว",
                          description: "ได้พักผ่อนหน่อยนะ! เรียกได้เมื่อไหร่ก็ได้ครับ 😴",
                        });
                      }
                    }}
                    disabled={!isTaskRunning}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Square className="w-5 h-5" />
                      <span className="text-sm font-medium">หยุดทำงาน</span>
                    </div>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white font-medium transition-all duration-200 py-3 px-4 h-auto"
                    onClick={() => {
                      toast({
                        title: "⚙️ MeeBot Settings",
                        description: "การตั้งค่าจะมาเร็ว ๆ นี้! ติดตามได้เลยครับ 🔧",
                      });
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Settings className="w-5 h-5" />
                      <span className="text-sm font-medium">ตั้งค่า</span>
                    </div>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white font-medium transition-all duration-200 py-3 px-4 h-auto"
                    onClick={() => navigate('/meebot')}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm font-medium">MeeBot หน้าหลัก</span>
                    </div>
                  </Button>
                </div>

                {/* Status indicator */}
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isTaskRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-slate-300">
                        สถานะ: {isTaskRunning ? 'กำลังทำงาน' : 'พร้อมเริ่มทำงาน'}
                      </span>
                    </div>
                    <Badge variant="outline" className={`${isTaskRunning ? 'border-green-400 text-green-300' : 'border-gray-400 text-gray-300'}`}>
                      {isTaskRunning ? 'Active' : 'Standby'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Coach Section */}
            <VoiceCoach onVoiceMessage={(message) => {
              console.log('MeeBot Voice:', message);
            }} />

            {/* Token Manager Section */}
            <TokenManager />

            {/* Badge & NFT Zone Section */}
            <BadgeCollection onMarketplaceClick={() => {
              toast({
                title: "🏪 ตลาด NFT",
                description: "กำลังพัฒนา! เร็วๆ นี้จะสามารถแลกเปลี่ยน Badge และซื้อภารกิจพิเศษได้",
              });
            }} />

            {/* === ส่วนที่ 2: ส่วนกลาง (Task Progress & Wallet) === */}

            {/* Task Progress Chart */}
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Task Success Rate
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-300">
                    {Math.round(taskData.reduce((a, b) => a + b, 0) / taskData.length)}% เฉลี่ย
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <div className="flex items-end justify-center gap-1 h-24 mb-3">
                    {taskData.map((value, index) => (
                      <div
                        key={index}
                        className="group relative bg-gradient-to-t from-blue-500 to-blue-300 rounded-t opacity-80 hover:opacity-100 transition-all duration-200 cursor-pointer"
                        style={{
                          height: `${(value / Math.max(...taskData)) * 100}%`,
                          width: '14px',
                          minHeight: '6px'
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {chartLabels[index]}: {value} tasks
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-700"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Labels */}
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{chartLabels[0]}</span>
                    <span className="text-slate-400">เวลา (ชั่วโมง)</span>
                    <span>{chartLabels[chartLabels.length - 1]}</span>
                  </div>

                  {/* Chart Stats */}
                  <div className="flex justify-between mt-3 pt-3 border-t border-slate-600/30">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">สูงสุด</p>
                      <p className="text-sm font-semibold text-green-300">{Math.max(...taskData)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">ต่ำสุด</p>
                      <p className="text-sm font-semibold text-yellow-300">{Math.min(...taskData)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">รวม</p>
                      <p className="text-sm font-semibold text-blue-300">{taskData.reduce((a, b) => a + b, 0)}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleTaskControl('stop')}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 py-3 font-semibold"
                  data-testid="button-cancel"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Cancel All Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Address Card */}
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-blue-300">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>ที่อยู่ Wallet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQR(!showQR)}
                      data-testid="button-show-qr"
                      title="แสดง QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {walletData?.address ? (
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm bg-slate-700/50 px-3 py-2 rounded flex-1 text-slate-300">
                      {truncateAddress(walletData.address)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="button-copy-address"
                      title="คัดลอกที่อยู่"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-400 mb-3">ยังไม่ได้เชื่อมต่อ Wallet</p>
                    <Button
                      onClick={() => navigate('/wallet-connect')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </div>
                )}

                {showQR && walletData?.address && (
                  <div className="mt-4">
                    <QRCodeGenerator
                      value={walletData.address}
                      title="ที่อยู่ Wallet"
                      size={150}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Balance Card พร้อม Toggle Visibility */}
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-blue-300">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span>ยอดคงเหลือ</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    data-testid="button-toggle-balance"
                    title={showBalance ? "ซ่อนยอดคงเหลือ" : "แสดงยอดคงเหลือ"}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoadingBalances ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <BalanceCardSkeleton key={index} />
                    ))
                  ) : balances?.data?.map((token: any) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {token.symbol[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{token.symbol}</div>
                          <div className="text-xs text-slate-400">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-blue-300">
                          {showBalance ? `${parseFloat(token.balance).toFixed(4)}` : '••••'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Coins className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 mb-2">ยังไม่มีโทเค็นในกระเป๋า</p>
                      <p className="text-xs text-slate-500">เริ่มต้นด้วยการรับโทเค็นฟรีก่อน</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* === ส่วนที่ 3: ส่วนท้าย (Badge Collection & Contract Health) === */}

            {/* Badge Collection */}
            <BadgeViewer userAddress={userAddress || undefined} />

            {/* Contract Health Monitor */}
            <ContractHealthMonitor />

            {/* Token Actions Section */}
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Token Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 hover:scale-105 transition-all duration-200 h-16 group"
                    onClick={() => navigate('/receive')}
                    data-testid="button-receive"
                    title="ซื้อหรือรับโทเค็นฟรี"
                  >
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-1 group-hover:animate-bounce" />
                      <div className="text-sm font-medium">Receive</div>
                    </div>
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 hover:scale-105 transition-all duration-200 h-16 group"
                    onClick={() => navigate('/send')}
                    data-testid="button-send"
                    title="ส่งโทเค็นไปยังที่อยู่อื่น"
                  >
                    <div className="text-center">
                      <Send className="w-6 h-6 mx-auto mb-1 group-hover:animate-pulse" />
                      <div className="text-sm font-medium">Send</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => navigate('/swap-bridge')}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 hover:scale-105 transition-all duration-200 h-16 group relative"
                    title="แลกเปลี่ยนโทเค็นหรือย้ายเครือข่าย"
                  >
                    <div className="text-center">
                      <GitBranch className="w-6 h-6 mx-auto mb-1 group-hover:animate-spin" />
                      <span className="text-sm font-semibold">Swap/Bridge</span>
                    </div>
                    {/* Animation hint */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
                  </Button>

                  <Button
                    onClick={() => navigate('/token-actions')}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:scale-105 transition-all duration-200 h-16 group"
                    title="ตัวเลือกขั้นสูงสำหรับโทเค็น"
                  >
                    <div className="text-center">
                      <Coins className="w-6 h-6 mx-auto mb-1 group-hover:animate-wiggle" />
                      <span className="text-sm font-semibold">Advanced</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Network Status & Quick Actions */}
            <div className="space-y-4">
              <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">เครือข่าย Polygon</p>
                        <p className="text-xs text-slate-400">เชื่อมต่อแล้ว • Latency: 45ms</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* รับโทเค็นฟรี และ รายได้ */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 hover:scale-105 transition-all duration-200 h-16 text-slate-300 group"
                  onClick={() => navigate('/faucet')}
                  data-testid="button-faucet"
                  title="รับโทเค็นฟรีเพื่อเริ่มต้น"
                >
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-1 group-hover:animate-bounce" />
                    <span className="text-sm">รับโทเค็นฟรี</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 hover:scale-105 transition-all duration-200 h-16 text-slate-300 group"
                  onClick={() => navigate('/earnings')}
                  data-testid="button-earnings"
                  title="ดูประวัติรายได้ของคุณ"
                >
                  <div className="text-center">
                    <History className="w-6 h-6 mx-auto mb-1 group-hover:animate-pulse" />
                    <span className="text-sm">รายได้</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* NFT Quest Progress */}
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span>NFT Quest Progress</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/nft-collection?tab=quests')}
                    className="border-purple-500 text-purple-300 hover:bg-purple-800/50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    ดูทั้งหมด
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Productivity Master</span>
                        <p className="text-xs text-slate-400">2/3 badges สะสมแล้ว</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-300">67%</div>
                      <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-300">MeeBot บอก:</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      เหลืออีก 1 badge เท่านั้น! ลุย Focus Master แล้วจะได้ LEGENDARY NFT ครับ! 🏆✨
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MeeBot Assistant Banner - แยกจากฟังก์ชันหลัก */}
            <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30 overflow-hidden relative mb-8">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={logoUrl}
                        alt="MeeBot"
                        className={`w-12 h-12 rounded-full transition-all duration-500 ${
                          botEmotion === 'excited' ? 'scale-125 animate-bounce' :
                          botEmotion === 'waving' ? 'animate-pulse scale-110' :
                          'scale-100'
                        }`}
                        style={{
                          filter: botEmotion === 'excited' ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)',
                          animation: botEmotion === 'waving' ? 'gentle-float 2s ease-in-out infinite' : 'none'
                        }}
                      />
                      {isBotReady && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-cyan-300">MeeBot</h3>
                        <Badge variant="outline" className="border-green-500/50 text-green-300 text-xs px-2 py-0">
                          Online
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {getBotMessage()}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleBotClick}
                    onMouseEnter={() => {
                      setIsHovering(true);
                      setBotEmotion('waving');
                    }}
                    onMouseLeave={() => {
                      setIsHovering(false);
                      setBotEmotion('happy');
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>แชท</span>
                    </div>
                  </Button>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
              </CardContent>
            </Card>

      </div>
        </div>
      </div>
    </SidebarProvider>
  );
}