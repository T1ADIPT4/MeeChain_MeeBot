
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TestTube, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import logoUrl from '@assets/branding/logo.png';

interface MissionTestHelperProps {
  missionData: {
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    xpReward: number;
    steps: string[];
  };
  onTestComplete?: (result: any) => void;
}

export default function MissionTestHelper({ missionData, onTestComplete }: MissionTestHelperProps) {
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'warning'>('idle');
  const [meeBotTip, setMeeBotTip] = useState('');

  const analyzeMission = () => {
    setTestResult('testing');
    
    // Simulate MeeBot analysis
    setTimeout(() => {
      const analysis = {
        balanceScore: Math.floor(Math.random() * 20) + 80,
        difficultyMatch: missionData.difficulty === 'easy' && missionData.xpReward > 100 ? 'warning' : 'good',
        stepClarity: missionData.steps.length >= 3 ? 'good' : 'warning'
      };

      if (analysis.balanceScore >= 85 && analysis.difficultyMatch === 'good') {
        setTestResult('success');
        setMeeBotTip(`🎯 ภารกิจนี้สมดุลดีมาก! คะแนนความสมดุล: ${analysis.balanceScore}/100`);
      } else {
        setTestResult('warning');
        setMeeBotTip(`🤔 มีจุดที่ควรปรับปรุง: ${analysis.difficultyMatch === 'warning' ? 'XP ไม่เหมาะกับระดับความยาก' : 'ขั้นตอนน้อยไป'}`);
      }

      onTestComplete?.(analysis);
    }, 2000);
  };

  const getMeeBotColor = () => {
    switch (testResult) {
      case 'success': return 'from-green-600/20 to-emerald-600/20 border-green-400/30';
      case 'warning': return 'from-yellow-600/20 to-orange-600/20 border-yellow-400/30';
      case 'testing': return 'from-blue-600/20 to-purple-600/20 border-blue-400/30';
      default: return 'from-purple-600/20 to-pink-600/20 border-purple-400/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* MeeBot Analysis Card */}
      <Card className={`bg-gradient-to-r ${getMeeBotColor()} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <img src={logoUrl} alt="MeeBot" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-purple-200">MeeBot AI Analyzer</span>
                <Badge 
                  variant="outline" 
                  className={
                    testResult === 'success' ? 'border-green-500/50 text-green-300' :
                    testResult === 'warning' ? 'border-yellow-500/50 text-yellow-300' :
                    testResult === 'testing' ? 'border-blue-500/50 text-blue-300' :
                    'border-purple-500/50 text-purple-300'
                  }
                >
                  {testResult === 'success' ? '✅ Optimal' :
                   testResult === 'warning' ? '⚠️ Needs Review' :
                   testResult === 'testing' ? '🧠 Analyzing...' :
                   '🧪 Ready to Test'}
                </Badge>
              </div>
              
              {testResult === 'idle' && (
                <p className="text-purple-100 text-sm">
                  "พร้อมวิเคราะห์ภารกิจแล้วครับ! ผมจะตรวจสอบความสมดุลของ XP, ความยาก, และขั้นตอนให้ 🎯"
                </p>
              )}

              {testResult === 'testing' && (
                <p className="text-blue-100 text-sm">
                  "กำลังวิเคราะห์... ตรวจสอบ balance, difficulty matching, และ user experience 🧠"
                </p>
              )}

              {(testResult === 'success' || testResult === 'warning') && meeBotTip && (
                <p className="text-white text-sm">{meeBotTip}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Button */}
      <Button
        onClick={analyzeMission}
        disabled={testResult === 'testing'}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {testResult === 'testing' ? (
          <>
            <Brain className="w-4 h-4 mr-2 animate-pulse" />
            MeeBot กำลังวิเคราะห์...
          </>
        ) : (
          <>
            <TestTube className="w-4 h-4 mr-2" />
            ให้ MeeBot วิเคราะห์ภารกิจ
          </>
        )}
      </Button>

      {/* Quick Insights */}
      {testResult !== 'idle' && testResult !== 'testing' && (
        <Alert>
          <Lightbulb className="w-4 h-4" />
          <AlertDescription>
            <strong>MeeBot Insights:</strong> ใช้ข้อมูลการวิเคราะห์นี้เพื่อปรับปรุงภารกิจก่อนปล่อยให้ผู้ใช้จริง
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
