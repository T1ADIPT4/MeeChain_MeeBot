
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  TestTube, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Zap,
  Trophy,
  Target,
  Settings,
  Bug
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/branding/logo.png';

interface TestMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  badgeReward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  testCases: string[];
}

interface TestResult {
  success: boolean;
  xp: number;
  badge: string;
  completionTime: number;
  feedback: string[];
  issues: string[];
}

export default function MissionTestMode() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedMission, setSelectedMission] = useState<TestMission | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [meeBotMessage, setMeeBotMessage] = useState('');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Demo missions for testing
  const testMissions: TestMission[] = [
    {
      id: 'demo-swap',
      title: '🔄 Demo: Swap ETH เป็น USDT',
      description: 'ทดสอบการแลกเปลี่ยนโทเค็นในโหมดจำลอง',
      xpReward: 100,
      badgeReward: 'Swap Ninja',
      difficulty: 'easy',
      steps: [
        'เชื่อมต่อ wallet',
        'เลือกโทเค็น ETH',
        'ใส่จำนวน 0.1 ETH',
        'ยืนยันการ swap'
      ],
      testCases: [
        'ตรวจสอบ wallet connection',
        'ตรวจสอบ balance เพียงพอ',
        'ตรวจสอบ slippage tolerance',
        'จำลอง transaction success'
      ]
    },
    {
      id: 'demo-bridge',
      title: '🌉 Demo: Bridge FUSE ไป BSC',
      description: 'ทดสอบการส่งโทเค็นข้ามเครือข่าย',
      xpReward: 150,
      badgeReward: 'Bridge Master',
      difficulty: 'medium',
      steps: [
        'เลือกเครือข่ายต้นทาง (Fuse)',
        'เลือกเครือข่ายปลายทาง (BSC)',
        'ใส่จำนวนโทเค็น',
        'ยืนยันการ bridge'
      ],
      testCases: [
        'ตรวจสอบ network compatibility',
        'ตรวจสอบ bridge fees',
        'ตรวจสอบ minimum amount',
        'จำลอง cross-chain transfer'
      ]
    },
    {
      id: 'demo-faucet',
      title: '💧 Demo: รับโทเค็นฟรี',
      description: 'ทดสอบระบบ faucet และ rate limiting',
      xpReward: 50,
      badgeReward: 'Token Collector',
      difficulty: 'easy',
      steps: [
        'ตรวจสอบสิทธิ์รับโทเค็น',
        'เลือกโทเค็นที่ต้องการ',
        'กดรับโทเค็น',
        'รอ confirmation'
      ],
      testCases: [
        'ตรวจสอบ rate limit (24 ชั่วโมง)',
        'ตรวจสอบ user eligibility',
        'ตรวจสอบ faucet balance',
        'จำลอง token distribution'
      ]
    }
  ];

  const meeBotQuotes = [
    "ภารกิจนี้ยังอยู่ในห้องทดลองนะครับ ลองเล่นแล้วบอก MeeBot ด้วยว่าเวิร์คไหม! 🧪",
    "ถ้า badge นี้ดูง่ายไป ผมจะเพิ่มความยากให้แบบขำ ๆ นะครับ! 😄",
    "คุณผ่านการทดสอบแล้ว! พร้อมปล่อยให้ dev คนอื่นลุยต่อ! 🚀",
    "อุ๊ปส์! เจอบัคตัวน้อย ๆ แต่ไม่เป็นไร แก้ไขแล้วลองใหม่นะครับ! 🐛",
    "Mission นี้ดูจะสนุกดี คุณพร้อมที่จะเป็น beta tester แล้วใช่ไหม? 🎮"
  ];

  useEffect(() => {
    setMeeBotMessage(meeBotQuotes[Math.floor(Math.random() * meeBotQuotes.length)]);
  }, [selectedMission]);

  const runMissionTest = async () => {
    if (!selectedMission) return;

    setIsRunning(true);
    setProgress(0);
    setDebugLogs([]);
    setTestResult(null);

    const logs: string[] = [];
    
    // Simulate test execution
    for (let i = 0; i < selectedMission.testCases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testCase = selectedMission.testCases[i];
      logs.push(`✅ ${testCase} - PASSED`);
      setDebugLogs([...logs]);
      setProgress(((i + 1) / selectedMission.testCases.length) * 100);
    }

    // Simulate result
    const mockResult: TestResult = {
      success: Math.random() > 0.2, // 80% success rate
      xp: selectedMission.xpReward,
      badge: selectedMission.badgeReward,
      completionTime: Math.floor(Math.random() * 30) + 10,
      feedback: [
        'UI/UX flow ดูดี เข้าใจง่าย',
        'Error handling ทำได้ดี',
        'Performance ยอดเยี่ยม'
      ],
      issues: Math.random() > 0.7 ? ['Minor: Button spacing ควรเพิ่มอีกนิด'] : []
    };

    setTestResult(mockResult);
    setIsRunning(false);

    if (mockResult.success) {
      setMeeBotMessage("🎉 ยอดเยี่ยม! ภารกิจนี้พร้อมปล่อยแล้ว MeeBot ให้คะแนน A+ เลยครับ!");
      toast({
        title: "✅ การทดสอบสำเร็จ!",
        description: `ได้รับ ${mockResult.xp} XP และ Badge "${mockResult.badge}"`,
      });
    } else {
      setMeeBotMessage("🤔 อืม... มีจุดที่ต้องปรับปรุงนิดหน่อย แต่โอเคนะครับ แก้แล้วลองใหม่!");
      toast({
        title: "⚠️ พบปัญหาเล็กน้อย",
        description: "ตรวจสอบ debug logs และลองใหม่",
        variant: "destructive"
      });
    }
  };

  const resetTest = () => {
    setTestResult(null);
    setProgress(0);
    setDebugLogs([]);
    setMeeBotMessage(meeBotQuotes[Math.floor(Math.random() * meeBotQuotes.length)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/missions')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-purple-300">🧪 Mission Test Mode</h1>
        </div>

        <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
          <TestTube className="w-3 h-3 mr-1" />
          Beta Testing
        </Badge>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* MeeBot Tips */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <img src={logoUrl} alt="MeeBot" className="w-6 h-6 object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-200 mb-1">MeeBot Tips</div>
                <p className="text-purple-100 text-sm">{meeBotMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="missions" className="data-[state=active]:bg-purple-600">
              <Target className="w-4 h-4 mr-2" />
              ภารกิจทดสอบ
            </TabsTrigger>
            <TabsTrigger value="runner" className="data-[state=active]:bg-purple-600">
              <Play className="w-4 h-4 mr-2" />
              รันการทดสอบ
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-purple-600">
              <Bug className="w-4 h-4 mr-2" />
              Debug Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="space-y-4">
            <div className="grid gap-4">
              {testMissions.map((mission) => (
                <Card 
                  key={mission.id} 
                  className={`bg-slate-800/50 border-slate-600/50 cursor-pointer transition-all hover:border-purple-500/50 ${
                    selectedMission?.id === mission.id ? 'border-purple-500 bg-purple-900/20' : ''
                  }`}
                  onClick={() => setSelectedMission(mission)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-white">{mission.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={
                              mission.difficulty === 'easy' ? 'border-green-500/50 text-green-300' :
                              mission.difficulty === 'medium' ? 'border-yellow-500/50 text-yellow-300' :
                              'border-red-500/50 text-red-300'
                            }
                          >
                            {mission.difficulty}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{mission.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {mission.xpReward} XP
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {mission.badgeReward}
                          </span>
                        </div>
                      </div>
                      {selectedMission?.id === mission.id && (
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="runner" className="space-y-4">
            {selectedMission ? (
              <div className="space-y-6">
                {/* Selected Mission Info */}
                <Card className="bg-slate-800/50 border-slate-600/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Settings className="w-5 h-5" />
                      {selectedMission.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-purple-300 mb-2">ขั้นตอนการทดสอบ</h4>
                        <div className="space-y-1">
                          {selectedMission.steps.map((step, index) => (
                            <div key={index} className="text-sm text-slate-400">
                              {index + 1}. {step}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-300 mb-2">Test Cases</h4>
                        <div className="space-y-1">
                          {selectedMission.testCases.map((testCase, index) => (
                            <div key={index} className="text-sm text-slate-400">
                              • {testCase}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Progress */}
                {(isRunning || testResult) && (
                  <Card className="bg-slate-800/50 border-slate-600/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">ความคืบหน้าการทดสอบ</span>
                          <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Test Result */}
                {testResult && (
                  <Card className={`border-2 ${testResult.success ? 'border-green-500/50 bg-green-900/20' : 'border-yellow-500/50 bg-yellow-900/20'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          testResult.success ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                          {testResult.success ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-2">
                            {testResult.success ? '✅ การทดสอบสำเร็จ!' : '⚠️ พบปัญหาเล็กน้อย'}
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-4">
                              <span className="text-slate-400">เวลาที่ใช้:</span>
                              <span className="text-white">{testResult.completionTime} วินาที</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-400">รางวัล:</span>
                              <span className="text-white">{testResult.xp} XP + Badge "{testResult.badge}"</span>
                            </div>
                          </div>
                          
                          {testResult.feedback.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-green-300 font-medium mb-1">✅ จุดเด่น:</h4>
                              <ul className="text-sm text-slate-300 space-y-1">
                                {testResult.feedback.map((item, index) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {testResult.issues.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-yellow-300 font-medium mb-1">⚠️ ข้อเสนอแนะ:</h4>
                              <ul className="text-sm text-slate-300 space-y-1">
                                {testResult.issues.map((item, index) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={runMissionTest}
                    disabled={isRunning}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isRunning ? (
                      <>
                        <TestTube className="w-4 h-4 mr-2 animate-pulse" />
                        กำลังทดสอบ...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        เริ่มการทดสอบ
                      </>
                    )}
                  </Button>
                  
                  {(testResult || debugLogs.length > 0) && (
                    <Button
                      onClick={resetTest}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      รีเซ็ต
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Alert>
                <Brain className="w-4 h-4" />
                <AlertDescription>
                  กรุณาเลือกภารกิจที่ต้องการทดสอบจากแท็บ "ภารกิจทดสอบ" ก่อน
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bug className="w-5 h-5" />
                  Debug Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-4 min-h-[200px]">
                  {debugLogs.length > 0 ? (
                    <div className="space-y-1 font-mono text-sm">
                      {debugLogs.map((log, index) => (
                        <div key={index} className="text-green-400">
                          [{new Date().toLocaleTimeString()}] {log}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-center py-8">
                      ยังไม่มี debug logs<br />
                      เริ่มการทดสอบเพื่อดู logs
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
