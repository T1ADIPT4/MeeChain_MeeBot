
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  Trophy,
  Star,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Bot,
  Gift,
  TrendingUp,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestStep {
  id: string;
  description: string;
  isCompleted: boolean;
  reward?: string;
}

interface ActiveQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  steps: QuestStep[];
  timeLimit?: number; // seconds
  rewards: {
    xp: number;
    tokens: number;
    badge?: string;
  };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'LEGENDARY';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startedAt: Date;
  estimatedTime: number; // minutes
}

export function QuestTracker() {
  const [activeQuests, setActiveQuests] = useState<ActiveQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<ActiveQuest | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const { toast } = useToast();

  // Mock quest data
  const mockQuests: ActiveQuest[] = [
    {
      id: 'daily-productivity',
      title: 'Daily Productivity Master',
      description: 'ทำภารกิจ productivity ให้ครบ 5 รายการในวันนี้',
      progress: 3,
      maxProgress: 5,
      steps: [
        { id: '1', description: 'ตื่นเช้าก่อน 7:00 น.', isCompleted: true },
        { id: '2', description: 'ทำสมาธิ 10 นาที', isCompleted: true },
        { id: '3', description: 'อ่านหนังสือ 30 นาที', isCompleted: true },
        { id: '4', description: 'ออกกำลังกาย 20 นาที', isCompleted: false },
        { id: '5', description: 'เขียน journal', isCompleted: false }
      ],
      timeLimit: 86400, // 24 hours
      rewards: { xp: 500, tokens: 100, badge: 'Daily Champion' },
      difficulty: 'MEDIUM',
      status: 'ACTIVE',
      startedAt: new Date(),
      estimatedTime: 180
    },
    {
      id: 'web3-explorer',
      title: 'Web3 Explorer Journey',
      description: 'สำรวจ features ต่าง ๆ ใน MeeChain ecosystem',
      progress: 2,
      maxProgress: 4,
      steps: [
        { id: '1', description: 'เชื่อมต่อ wallet', isCompleted: true },
        { id: '2', description: 'ส่ง transaction แรก', isCompleted: true },
        { id: '3', description: 'Mint Badge NFT', isCompleted: false },
        { id: '4', description: 'เข้าร่วม community', isCompleted: false }
      ],
      rewards: { xp: 1000, tokens: 250, badge: 'Web3 Pioneer' },
      difficulty: 'HARD',
      status: 'ACTIVE',
      startedAt: new Date(),
      estimatedTime: 60
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'สร้างการเชื่อมต่อกับเพื่อน ๆ ในชุมชน',
      progress: 4,
      maxProgress: 4,
      steps: [
        { id: '1', description: 'ช่วยเพื่อน 3 คน', isCompleted: true },
        { id: '2', description: 'ส่งข้อความให้กำลังใจ', isCompleted: true },
        { id: '3', description: 'แบ่งปันความรู้', isCompleted: true },
        { id: '4', description: 'เข้าร่วม group activity', isCompleted: true }
      ],
      rewards: { xp: 750, tokens: 150, badge: 'Community Hero' },
      difficulty: 'EASY',
      status: 'COMPLETED',
      startedAt: new Date(),
      estimatedTime: 120
    }
  ];

  useEffect(() => {
    setActiveQuests(mockQuests);
    if (mockQuests.length > 0) {
      setSelectedQuest(mockQuests[0]);
    }
  }, []);

  // Timer for time-limited quests
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'from-green-500 to-emerald-500';
      case 'MEDIUM': return 'from-blue-500 to-cyan-500';
      case 'HARD': return 'from-orange-500 to-red-500';
      case 'LEGENDARY': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteStep = (questId: string, stepId: string) => {
    setActiveQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const updatedSteps = quest.steps.map(step => 
          step.id === stepId ? { ...step, isCompleted: true } : step
        );
        const newProgress = updatedSteps.filter(step => step.isCompleted).length;
        const newStatus = newProgress === quest.maxProgress ? 'COMPLETED' : quest.status;
        
        if (newStatus === 'COMPLETED') {
          toast({
            title: "🎉 Quest สำเร็จ!",
            description: `${quest.title} เสร็จสิ้นแล้ว! รับรางวัล ${quest.rewards.xp} XP และ ${quest.rewards.tokens} MEE!`,
          });
        }
        
        return { ...quest, steps: updatedSteps, progress: newProgress, status: newStatus };
      }
      return quest;
    }));
  };

  const handlePauseQuest = (questId: string) => {
    setActiveQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, status: quest.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
        : quest
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-300/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">🎯 Quest Tracker</h2>
              <p className="text-sm text-slate-400">ติดตามความคืบหน้าภารกิจของคุณ</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quest List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/80 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white text-lg">Active Quests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => setSelectedQuest(quest)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedQuest?.id === quest.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  } ${quest.status === 'COMPLETED' ? 'border-green-500/50 bg-green-500/5' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{quest.title}</h3>
                    {quest.status === 'COMPLETED' && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={(quest.progress / quest.maxProgress) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{quest.progress}/{quest.maxProgress} steps</span>
                      <Badge 
                        className={`bg-gradient-to-r ${getDifficultyColor(quest.difficulty)} text-white border-0`}
                      >
                        {quest.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quest Details */}
        <div className="lg:col-span-2">
          {selectedQuest ? (
            <Card className="bg-slate-800/80 border-slate-600/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Target className="w-5 h-5 text-blue-400" />
                    {selectedQuest.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePauseQuest(selectedQuest.id)}
                      disabled={selectedQuest.status === 'COMPLETED'}
                      className="border-slate-600"
                    >
                      {selectedQuest.status === 'PAUSED' ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-slate-400">{selectedQuest.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Quest Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{selectedQuest.progress}/{selectedQuest.maxProgress}</div>
                    <div className="text-xs text-slate-400">Progress</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{selectedQuest.estimatedTime}m</div>
                    <div className="text-xs text-slate-400">Est. Time</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{selectedQuest.rewards.xp}</div>
                    <div className="text-xs text-slate-400">XP Reward</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Zap className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{selectedQuest.rewards.tokens}</div>
                    <div className="text-xs text-slate-400">MEE Tokens</div>
                  </div>
                </div>

                {/* Quest Steps */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Quest Steps
                  </h4>
                  
                  {selectedQuest.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        step.isCompleted 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        step.isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-600 text-slate-300'
                      }`}>
                        {step.isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <span className={`font-medium ${
                          step.isCompleted ? 'text-green-300' : 'text-white'
                        }`}>
                          {step.description}
                        </span>
                        {step.reward && (
                          <div className="text-xs text-slate-400 mt-1">
                            Reward: {step.reward}
                          </div>
                        )}
                      </div>
                      
                      {!step.isCompleted && selectedQuest.status !== 'COMPLETED' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteStep(selectedQuest.id, step.id)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quest Rewards */}
                {selectedQuest.status === 'COMPLETED' && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Quest Completed! 🎉
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{selectedQuest.rewards.xp}</div>
                        <div className="text-xs text-slate-400">XP Gained</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{selectedQuest.rewards.tokens}</div>
                        <div className="text-xs text-slate-400">MEE Tokens</div>
                      </div>
                      {selectedQuest.rewards.badge && (
                        <div>
                          <div className="text-lg font-bold text-white">🏆</div>
                          <div className="text-xs text-slate-400">{selectedQuest.rewards.badge}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MeeBot Encouragement */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-cyan-300 mb-1">🤖 MeeBot Coaching</h3>
                      <p className="text-sm text-gray-300">
                        {selectedQuest.status === 'COMPLETED' 
                          ? "เยี่ยมมาก! คุณทำได้สำเร็จแล้ว! พร้อมรับ quest ใหม่แล้วไหม? 🚀"
                          : selectedQuest.progress > selectedQuest.maxProgress / 2
                          ? "เก่งมาก! คุณผ่านไปครึ่งทางแล้ว ลุยต่อเลย! 💪"
                          : "เริ่มต้นที่ดี! ทำทีละขั้นตอน คุณทำได้แน่นอน! ✨"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/80 border-slate-600/50">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-slate-400">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>เลือก quest เพื่อดูรายละเอียด</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
