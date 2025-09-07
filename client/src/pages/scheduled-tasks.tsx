import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Play,
  Pause,
  Square,
  Settings,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MascotGuide } from '@/components/mascot/mascot-guide';
import logoUrl from '@assets/branding/logo.png';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScheduledTasks() {
  const [location, navigate] = useLocation();
  const [isTaskRunning, setIsTaskRunning] = useState(false);
  const [taskProgress, setTaskProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const { toast } = useToast();

  // Mock task data for charts
  const [taskData, setTaskData] = useState({
    completed: [12, 19, 15, 22, 18, 25, 30],
    failed: [2, 3, 1, 4, 2, 1, 3],
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์']
  });

  // Task control handlers
  const handleTaskControl = (action: 'start' | 'pause' | 'stop') => {
    switch (action) {
      case 'start':
        setIsTaskRunning(true);
        setTaskProgress(0);
        toast({
          title: "เริ่มงานแล้ว! 🚀",
          description: "MeeChain Bear กำลังติดตามงานให้คุณ",
        });
        
        // Simulate task progress
        const progressInterval = setInterval(() => {
          setTaskProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setIsTaskRunning(false);
              setCompletedTasks(prev => prev + 1);
              
              // Success notification with vibration
              if ('vibrate' in navigator) {
                navigator.vibrate([100, 100, 100]);
              }
              
              toast({
                title: "งานสำเร็จ! ✅",
                description: "Task ทำงานเสร็จสมบูรณ์แล้ว",
              });
              
              return 100;
            }
            return prev + Math.random() * 10;
          });
        }, 500);
        break;

      case 'pause':
        setIsTaskRunning(false);
        toast({
          title: "หยุดชั่วคราว ⏸️",
          description: "Task ถูกหยุดชั่วคราวแล้ว",
        });
        break;

      case 'stop':
        setIsTaskRunning(false);
        setTaskProgress(0);
        toast({
          title: "หยุดทำงาน ⏹️",
          description: "Task ถูกหยุดทำงานแล้ว",
        });
        break;
    }
  };

  // Chart configurations
  const lineChartData = {
    labels: taskData.labels,
    datasets: [
      {
        label: 'งานสำเร็จ',
        data: taskData.completed,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'งานล้มเหลว',
        data: taskData.failed,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const barChartData = {
    labels: ['วันนี้', 'เมื่อวาน', '2 วันก่อน', '3 วันก่อน'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [30, 25, 22, 18],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(148, 163, 184)' // slate-400
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgb(148, 163, 184)' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        ticks: { color: 'rgb(148, 163, 184)' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img src={logoUrl} alt="MeeChain" className="w-8 h-8" />
          <h1 className="text-xl font-bold">Scheduled Tasks</h1>
        </div>
        <Button variant="ghost" size="sm" data-testid="button-profile">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">M</span>
          </div>
        </Button>
      </div>

      <div className="px-6 pb-6 space-y-6">
        
        {/* Mascot Task Control */}
        <MascotGuide 
          currentStep={7}
          totalSteps={7}
          isTaskRunning={isTaskRunning}
          onTaskControl={handleTaskControl}
        />

        {/* Current Task Status */}
        {taskProgress > 0 && (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                งานปัจจุบัน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>ความคืบหน้า</span>
                  <span className="text-blue-400 font-semibold">{Math.round(taskProgress)}%</span>
                </div>
                <Progress value={taskProgress} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {isTaskRunning ? 'กำลังดำเนินการ...' : 'หยุดชั่วคราว'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Statistics Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Line Chart - Weekly Trend */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                แนวโน้มรายสัปดาห์
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart - Daily Performance */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5" />
                ผลงานรายวัน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-green-500/10 border-green-500/20 p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{completedTasks + 147}</div>
            <div className="text-xs text-green-300">งานสำเร็จ</div>
          </Card>
          
          <Card className="bg-blue-500/10 border-blue-500/20 p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">23</div>
            <div className="text-xs text-blue-300">กำลังทำ</div>
          </Card>
          
          <Card className="bg-yellow-500/10 border-yellow-500/20 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">5</div>
            <div className="text-xs text-yellow-300">รอดำเนินการ</div>
          </Card>
          
          <Card className="bg-red-500/10 border-red-500/20 p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">2</div>
            <div className="text-xs text-red-300">ล้มเหลว</div>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">งานล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Token Balance Sync', status: 'completed', time: '5 นาทีที่แล้ว' },
                { name: 'Transaction Monitor', status: 'running', time: 'กำลังทำงาน' },
                { name: 'Price Alert Check', status: 'pending', time: 'รอดำเนินการ' },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-400' :
                      task.status === 'running' ? 'bg-blue-400 animate-pulse' :
                      'bg-yellow-400'
                    }`}></div>
                    <span className="text-white font-medium">{task.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={task.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        task.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        task.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }
                    >
                      {task.status === 'completed' ? 'สำเร็จ' :
                       task.status === 'running' ? 'ทำงาน' : 'รอ'}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}