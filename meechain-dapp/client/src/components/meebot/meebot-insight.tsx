
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  TrendingUp,
  Clock,
  Target,
  Zap,
  ChartBar,
  Lightbulb,
  Star,
  Eye,
  Bot
} from 'lucide-react';

interface UserInsight {
  category: string;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  recommendation?: string;
}

export function MeeBotInsight() {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Mock user behavior insights
  const insights: UserInsight[] = [
    {
      category: "การใช้งาน",
      title: "คุณเป็น Night Owl นักลงทุน! 🦉",
      description: "ผมสังเกตเห็นว่าคุณมักทำ transaction ช่วง 21:00-01:00 มากที่สุด",
      confidence: 87,
      actionable: true,
      priority: "medium",
      icon: "🌙",
      recommendation: "ลองตั้ง alert สำหรับราคาในช่วงนี้เพื่อใช้ประโยชน์จากการวิเคราะห์นี้"
    },
    {
      category: "ความปลอดภัย",
      title: "Security Champion! 🛡️",
      description: "คุณตรวจสอบ gas fee ทุกครั้งก่อนทำ transaction - นิสัยที่ดีมาก!",
      confidence: 94,
      actionable: false,
      priority: "high",
      icon: "🏆",
      recommendation: "Keep it up! ความระมัดระวังนี้จะช่วยประหยัดเงินได้มาก"
    },
    {
      category: "Trading Pattern",
      title: "DCA Master 📈",
      description: "คุณมีแนวโน้มซื้อเป็นจำนวนเล็กๆ แต่สม่ำเสมอ - กลยุทธ์ที่ฉลาด!",
      confidence: 76,
      actionable: true,
      priority: "high",
      icon: "💎",
      recommendation: "ลองใช้ Auto-DCA feature เพื่อให้การลงทุนสม่ำเสมอยิ่งขึ้น"
    },
    {
      category: "Network Usage",
      title: "Gas Fee Optimizer 🔥",
      description: "คุณชอบทำ transaction ตอนที่ gas fee ต่ำ ประหยัดได้ถึง 40%!",
      confidence: 91,
      actionable: true,
      priority: "medium",
      icon: "⛽",
      recommendation: "ติดตั้ง Gas Price Tracker เพื่อแจ้งเตือนเมื่อราคา gas ลด"
    },
    {
      category: "Learning Progress",
      title: "Quick Learner! 🎓",
      description: "คุณจบ Academy modules เร็วกว่าเฉลี่ย 3 เท่า - สุดยอด!",
      confidence: 88,
      actionable: true,
      priority: "low",
      icon: "🚀",
      recommendation: "พร้อมสำหรับ Advanced DeFi Courses แล้ว!"
    }
  ];

  const analyzeUserBehavior = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
      setIsAnalyzing(false);
    }, 2000);
  };

  const currentData = insights[currentInsight];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'medium': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'low': return 'from-green-500/20 to-blue-500/20 border-green-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <Card className={`bg-gradient-to-r ${getPriorityColor(currentData.priority)} transition-all duration-500 hover:scale-[1.02]`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/30 rounded-full">
              <Brain className={`w-5 h-5 text-purple-300 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <span className="text-lg">🧠 MeeBot Insight</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  AI Analysis
                </Badge>
                <Badge className={`text-xs ${
                  currentData.confidence >= 90 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  currentData.confidence >= 75 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                }`}>
                  {getConfidenceLabel(currentData.confidence)}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeUserBehavior}
            disabled={isAnalyzing}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Bot className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Insight */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl flex-shrink-0 mt-1">
              {currentData.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-cyan-300 font-medium text-sm">{currentData.category}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{currentData.title}</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                {currentData.description}
              </p>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Confidence Level</span>
              <span className="text-cyan-300 font-semibold">{currentData.confidence}%</span>
            </div>
            <Progress 
              value={currentData.confidence} 
              className="h-2 bg-gray-700"
            />
          </div>

          {/* Recommendation */}
          {currentData.recommendation && (
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-300 text-sm font-medium mb-1">💡 MeeBot แนะนำ:</p>
                  <p className="text-blue-200 text-xs leading-relaxed">
                    {currentData.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {currentData.actionable && (
            <Button 
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              ลองใช้ฟีเจอร์นี้
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
          >
            <ChartBar className="w-4 h-4 mr-1" />
            {showDetailedView ? 'ซ่อน' : 'ดู'} Details
          </Button>
        </div>

        {/* Detailed Analytics View */}
        {showDetailedView && (
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 animate-fadeIn">
            <h4 className="text-white font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Behavioral Analytics
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-700/50 rounded p-2">
                <div className="text-gray-400">Active Hours</div>
                <div className="text-cyan-300 font-semibold">21:00 - 01:00</div>
              </div>
              <div className="bg-slate-700/50 rounded p-2">
                <div className="text-gray-400">Avg Transaction</div>
                <div className="text-green-300 font-semibold">12.5 / day</div>
              </div>
              <div className="bg-slate-700/50 rounded p-2">
                <div className="text-gray-400">Success Rate</div>
                <div className="text-yellow-300 font-semibold">97.2%</div>
              </div>
              <div className="bg-slate-700/50 rounded p-2">
                <div className="text-gray-400">Gas Saved</div>
                <div className="text-purple-300 font-semibold">₹ 127.40</div>
              </div>
            </div>
          </div>
        )}

        {/* Insight Counter */}
        <div className="flex justify-center">
          <Badge className="bg-slate-700/50 text-gray-300 border-slate-600 text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Insight {currentInsight + 1} / {insights.length}
          </Badge>
        </div>
      </CardContent>

      {/* Loading overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Brain className="w-8 h-8 text-purple-400 animate-pulse mx-auto mb-2" />
            <p className="text-white text-sm">MeeBot กำลังวิเคราะห์...</p>
          </div>
        </div>
      )}
    </Card>
  );
}
