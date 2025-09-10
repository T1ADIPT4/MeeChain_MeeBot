import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  Download, 
  History, 
  QrCode, 
  Settings,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Play,
  Pause,
  Square,
  Menu,
  User,
  ArrowRightLeft,
  GitBranch
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@/lib/web3-utils';
import { QRCodeGenerator } from '@/components/web3/qr-code-generator';
import logoUrl from '@assets/branding/logo.png';

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const [showBalance, setShowBalance] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [isTaskRunning, setIsTaskRunning] = useState(false);
  const [taskData, setTaskData] = useState([10, 12, 16, 14, 18, 22, 24]);
  const [chartLabels, setChartLabels] = useState(['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00']);
  const { toast } = useToast();
  const logoRef = useRef<HTMLDivElement>(null);

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
  const { data: balances } = useQuery({
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

  const handleTaskControl = (action: 'start' | 'pause' | 'stop') => {
    switch (action) {
      case 'start':
        setIsTaskRunning(true);
        showToast("เริ่มทำงานแล้วครับ! 🚀");
        // Simulate new data point
        const newTime = new Date().toLocaleTimeString().slice(0, 5);
        const newValue = Math.floor(Math.random() * 30) + 10;
        setTaskData(prev => [...prev.slice(-6), newValue]);
        setChartLabels(prev => [...prev.slice(-6), newTime]);
        break;
      case 'pause':
        setIsTaskRunning(false);
        showToast("หยุดชั่วคราวแล้ว ⏸️");
        break;
      case 'stop':
        setIsTaskRunning(false);
        showToast("หยุดการทำงานแล้ว ⏹️");
        break;
    }
  };

  const handleCopyAddress = async () => {
    if (!walletData?.address) return;

    try {
      await navigator.clipboard.writeText(walletData.address);
      showToast("ที่อยู่ Wallet ถูกคัดลอกแล้ว");
    } catch (error) {
      showToast("ไม่สามารถคัดลอกที่อยู่ได้", 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-blue-300 text-lg animate-pulse">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Enhanced Header with Navigation */}
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
        {/* Main MeeChain Card with Breathing Logo */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm mt-6">
          <CardContent className="p-8 text-center">
            {/* Task Control Buttons */}
            <div className="flex justify-center gap-3 mb-6">
              <Button
                onClick={() => handleTaskControl('start')}
                disabled={isTaskRunning}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                data-testid="button-start-task"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>

              <Button
                onClick={() => handleTaskControl('pause')}
                disabled={!isTaskRunning}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2"
                data-testid="button-pause-task"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>

              <Button
                onClick={() => handleTaskControl('stop')}
                disabled={!isTaskRunning}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                data-testid="button-stop-task"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>

              <Button
                variant="outline"
                className="border-slate-500 text-slate-300 hover:bg-slate-700 px-4 py-2"
                onClick={() => navigate('/settings')}
                data-testid="button-task-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>

            {/* Breathing Logo */}
            <div 
              ref={logoRef}
              className="w-32 h-32 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center shadow-2xl"
              style={{ 
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              }}
            >
              <img 
                src={logoUrl} 
                alt="MeeChain Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MeeChain
            </h2>

            {isTaskRunning ? (
              <div className="flex items-center justify-center gap-2 text-blue-300 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span>Monitoring in progress...</span>
              </div>
            ) : (
              <p className="text-slate-400 mb-4">Ready to start monitoring</p>
            )}

            {/* Simple Chart Visualization */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-300 mb-3">Task Progress</h3>
              <div className="flex items-end justify-center gap-1 h-20">
                {taskData.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    style={{
                      height: `${(value / Math.max(...taskData)) * 100}%`,
                      width: '12px',
                      minHeight: '4px'
                    }}
                    title={`${chartLabels[index]}: ${value}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{chartLabels[0]}</span>
                <span>{chartLabels[chartLabels.length - 1]}</span>
              </div>
            </div>

            <Button
              onClick={() => handleTaskControl('stop')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-3"
              data-testid="button-cancel"
            >
              Cancel All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Wallet Address Card */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-blue-300">
              <span>ที่อยู่ Wallet</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQR(!showQR)}
                data-testid="button-show-qr"
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="font-mono text-sm bg-slate-700/50 px-3 py-2 rounded flex-1 text-slate-300">
                {walletData?.address ? truncateAddress(walletData.address) : 'ไม่พบที่อยู่'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                data-testid="button-copy-address"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

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

        {/* Balance Card */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-blue-300">
              <span>ยอดคงเหลือ</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                data-testid="button-toggle-balance"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {balances?.tokens?.map((token: any) => (
                <div key={token.symbol} className="flex items-center justify-between">
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
                <div className="text-center text-slate-400 py-4">
                  ยังไม่มีโทเค็นในกระเป๋า
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 h-16"
            onClick={() => navigate('/receive')}
            data-testid="button-receive"
          >
            <div className="text-center">
              <Download className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">รับโทเค็น</span>
            </div>
          </Button>

          <Button
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 h-16"
            onClick={() => navigate('/send-tokens')}
            data-testid="button-send"
          >
            <div className="text-center">
              <Send className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">ส่งโทเค็น</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/swap-bridge')}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 h-16"
          >
            <div className="text-center">
              <GitBranch className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">Swap/Bridge</span>
            </div>
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 h-16 text-slate-300"
            onClick={() => navigate('/earnings')}
            data-testid="button-earnings"
          >
            <div className="text-center">
              <History className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">รายได้</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 h-16 text-slate-300"
            onClick={() => navigate('/faucet')}
            data-testid="button-faucet"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">รับโทเค็นฟรี</span>
            </div>
          </Button>
        </div>

        {/* Network Status */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">เครือข่าย</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Polygon
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-600/50 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-blue-300 hover:text-blue-200 p-2"
            onClick={() => navigate('/')}
            data-testid="nav-home"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-200 p-2"
            onClick={() => navigate('/swap')}
            data-testid="nav-swap"
          >
            <Send className="w-5 h-5" />
            <span className="text-xs">Swap</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-blue-400 hover:text-blue-200 p-2"
            data-testid="nav-dashboard"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full mb-1"></div>
            <span className="text-xs font-semibold">Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-200 p-2"
            onClick={() => navigate('/missions')}
            data-testid="nav-meebot"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">MeeBot</span>
          </Button>
        </div>
      </div>
    </div>
  );
}