
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  Circle,
  Star,
  Flame,
  Award,
  Users,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'achievement';
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: {
    badgeName: string;
    badgeIcon: string;
    rarity: string;
    xp: number;
    tokens: number;
  };
  requirements: string[];
  timeRemaining?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockQuests: Quest[] = [
  {
    id: 'daily-login',
    title: 'เข้าสู่ระบบทุกวัน',
    description: 'เข้าสู่ระบบ MeeChain เป็นเวลา 7 วันติดต่อกัน',
    type: 'daily',
    progress: 5,
    maxProgress: 7,
    completed: false,
    reward: {
      badgeName: 'Daily Champion',
      badgeIcon: '🗓️',
      rarity: 'RARE',
      xp: 100,
      tokens: 50
    },
    requirements: ['เข้าสู่ระบบแต่ละวัน', 'ไม่ขาดวันในระหว่าง 7 วัน'],
    timeRemaining: '2 ชั่วโมง 15 นาที',
    difficulty: 'easy'
  },
  {
    id: 'badge-collector',
    title: 'นักสะสม Badge',
    description: 'สะสม Badge จาก 5 หมวดหมู่ที่แตกต่างกัน',
    type: 'achievement',
    progress: 3,
    maxProgress: 5,
    completed: false,
    reward: {
      badgeName: 'Badge Master',
      badgeIcon: '🏆',
      rarity: 'LEGENDARY',
      xp: 500,
      tokens: 200
    },
    requirements: [
      'PRODUCTIVITY badge ✅',
      'EXPLORER badge ✅', 
      'SOCIALIZER badge ✅',
      'ACHIEVER badge ❌',
      'SPECIAL badge ❌'
    ],
    difficulty: 'hard'
  },
  {
    id: 'voice-coach',
    title: 'Voice Coach Expert',
    description: 'ใช้ MeeBot Voice Coach 20 ครั้ง',
    type: 'weekly',
    progress: 12,
    maxProgress: 20,
    completed: false,
    reward: {
      badgeName: 'Voice Master',
      badgeIcon: '🎤',
      rarity: 'RARE',
      xp: 200,
      tokens: 100
    },
    requirements: ['ใช้ Voice Coach feature', 'พูดคุยกับ MeeBot'],
    timeRemaining: '3 วัน 12 ชั่วโมง',
    difficulty: 'medium'
  },
  {
    id: 'early-bird',
    title: 'นกแสงแรก',
    description: 'ทำภารกิจก่อน 6 โมงเช้า',
    type: 'special',
    progress: 1,
    maxProgress: 1,
    completed: true,
    reward: {
      badgeName: 'Early Bird',
      badgeIcon: '🌅',
      rarity: 'COMMON',
      xp: 50,
      tokens: 25
    },
    requirements: ['เข้าสู่ระบบก่อน 6:00 AM'],
    difficulty: 'easy'
  }
];

export function QuestTracker() {
  const [activeTab, setActiveTab] = useState('all');
  const [quests, setQuests] = useState<Quest[]>(mockQuests);

  const getQuestsByType = (type: string) => {
    if (type === 'all') return quests;
    if (type === 'completed') return quests.filter(q => q.completed);
    if (type === 'active') return quests.filter(q => !q.completed);
    return quests.filter(q => q.type === type);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-purple-500';
      case 'epic': return 'bg-orange-500';
      case 'legendary': return 'bg-yellow-500';
      case 'mythic': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <Clock className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true, progress: quest.maxProgress }
        : quest
    ));
  };

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{activeQuests.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Quests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedQuests.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((completedQuests.length / quests.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quest Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            🎯 Quest Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="daily">รายวัน</TabsTrigger>
              <TabsTrigger value="weekly">รายสัปดาห์</TabsTrigger>
              <TabsTrigger value="achievement">Achievement</TabsTrigger>
              <TabsTrigger value="completed">เสร็จแล้ว</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {getQuestsByType(activeTab).map((quest) => (
                  <Card 
                    key={quest.id} 
                    className={cn(
                      "transition-all hover:shadow-md",
                      quest.completed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : ""
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Quest Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl">{quest.reward.badgeIcon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{quest.title}</h3>
                                {quest.completed && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{quest.description}</p>
                            </div>
                          </div>

                          {/* Quest Meta */}
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getTypeIcon(quest.type)}
                              {quest.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                              {quest.difficulty.toUpperCase()}
                            </Badge>
                            {quest.timeRemaining && !quest.completed && (
                              <Badge variant="outline" className="text-orange-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {quest.timeRemaining}
                              </Badge>
                            )}
                          </div>

                          {/* Progress */}
                          {!quest.completed && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>ความคืบหน้า</span>
                                <span>{quest.progress}/{quest.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(quest.progress / quest.maxProgress) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}

                          {/* Requirements */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium">เงื่อนไข:</p>
                            <ul className="text-sm space-y-1">
                              {quest.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  {req.includes('✅') ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  ) : req.includes('❌') ? (
                                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  )}
                                  <span className={req.includes('❌') ? 'text-gray-500' : ''}>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Reward Section */}
                        <div className="ml-6 text-right">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-w-[200px]">
                            <p className="text-sm font-medium mb-2">🎁 รางวัล</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Badge:</span>
                                <Badge className={cn("text-white", getRarityColor(quest.reward.rarity))}>
                                  {quest.reward.badgeName}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">XP:</span>
                                <span className="font-medium">+{quest.reward.xp}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">MEE:</span>
                                <span className="font-medium">+{quest.reward.tokens}</span>
                              </div>
                            </div>
                            
                            {!quest.completed && quest.progress === quest.maxProgress && (
                              <Button 
                                size="sm" 
                                className="w-full mt-3"
                                onClick={() => completeQuest(quest.id)}
                              >
                                <Award className="w-4 h-4 mr-1" />
                                รับรางวัล
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getQuestsByType(activeTab).length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>ไม่มี Quest ในหมวดนี้</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
