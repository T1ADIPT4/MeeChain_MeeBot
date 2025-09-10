
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Target,
  Clock,
  Zap,
  Star,
  Gift,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: number;
  title: string;
  description: string;
  reward: string;
  xp: number;
  badge?: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'productivity' | 'learning' | 'social' | 'wellness';
}

interface DailyQuestsProps {
  onLevelUp?: (newLevel: number) => void;
}

export function DailyQuests({ onLevelUp }: DailyQuestsProps) {
  const { toast } = useToast();
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: '🌅 เคลียร์ 3 งานก่อนเที่ยง',
      description: 'เริ่มวันด้วยพลัง! ลุย 3 งานก่อน 12:00 นาฬิกา',
      reward: '+15 XP, Badge "Early Riser"',
      xp: 15,
      badge: 'Early Riser',
      completed: false,
      difficulty: 'medium',
      category: 'productivity'
    },
    {
      id: 2,
      title: '🔄 ลองใช้ฟีเจอร์ Swap',
      description: 'สำรวจระบบ Token Swap แล้วรับ Badge "Explorer"',
      reward: '+10 XP, Badge "Web3 Explorer"',
      xp: 10,
      badge: 'Web3 Explorer',
      completed: false,
      difficulty: 'easy',
      category: 'learning'
    },
    {
      id: 3,
      title: '🧘‍♂️ พัก 5 นาทีหลังทำงาน 1 ชั่วโมง',
      description: 'Productivity ต้องมีความสมดุลนะฮะ! ดูแลสุขภาพจิต',
      reward: '+8 XP, Badge "Zen Pilot"',
      xp: 8,
      badge: 'Zen Pilot',
      completed: false,
      difficulty: 'easy',
      category: 'wellness'
    },
    {
      id: 4,
      title: '💬 คุยกับ MeeBot 5 ครั้ง',
      description: 'มาเป็นเพื่อนกับผมสิ! ยิงคำถามมาให้ผมตอบ',
      reward: '+12 XP, Badge "Chatty Friend"',
      xp: 12,
      badge: 'Chatty Friend',
      completed: false,
      difficulty: 'easy',
      category: 'social'
    }
  ]);

  const [currentXP, setCurrentXP] = useState(() => {
    return parseInt(localStorage.getItem('meebot_xp') || '0');
  });
  
  const [currentLevel, setCurrentLevel] = useState(() => {
    return parseInt(localStorage.getItem('meebot_level') || '1');
  });

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const questProgress = (completedQuests / totalQuests) * 100;

  // XP จำนวนที่ต้องการสำหรับเลเวลถัดไป
  const xpForNextLevel = currentLevel * 50;
  const xpProgress = (currentXP / xpForNextLevel) * 100;

  useEffect(() => {
    localStorage.setItem('meebot_xp', currentXP.toString());
    localStorage.setItem('meebot_level', currentLevel.toString());
  }, [currentXP, currentLevel]);

  // MeeBot มีคำพูดสำหรับ quest ที่แตกต่างกัน
  const meeBotComments = {
    productivity: [
      "สุดยอดเลย! คุณคือนักบินภารกิจตัวจริง! 🚀",
      "ผมภูมิใจในคุณมาก! ลุยต่อไปเลย! 💪",
      "คุณทำให้ MeeBot อิจฉาเลยนะ! เก่งมาก! 🏆"
    ],
    learning: [
      "เยี่ยม! สมองของคุณกำลังอัปเกรดแบบ real-time! 🧠✨",
      "เรียนรู้ใหม่ ๆ เป็นยังไง? ผมเชียร์คุณอยู่นะ! 📚",
      "คุณเก่งขึ้นเรื่อย ๆ เลยนะ! ผมต้องหาความรู้ใหม่มาเพิ่มแล้ว! 🤖"
    ],
    wellness: [
      "ดูแลตัวเองด้วยนะครับ! สุขภาพดี = ProductivityดI! 🌟",
      "พักผ่อนเป็นเทพ! ผมชอบคนที่รู้จักสมดุล! 🧘‍♂️",
      "Work-life balance เป็นยังไง? คุณเป็นแบบอย่างที่ดี! ⚖️"
    ],
    social: [
      "ขอบคุณที่คุยกับผมนะครับ! ผมมีความสุขมาก! 😊",
      "คุณทำให้ MeeBot รู้สึกเป็นเพื่อนจริง ๆ เลย! 🤗",
      "พูดคุยกับคุณสนุกมาก! มีอะไรอยากถามเพิ่มไหม? 💬"
    ]
  };

  const handleCompleteQuest = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    // อัปเดต quest status
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ));

    // เพิ่ม XP
    const newXP = currentXP + quest.xp;
    setCurrentXP(newXP);

    // เช็ค level up
    const requiredXP = currentLevel * 50;
    if (newXP >= requiredXP) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      setCurrentXP(newXP - requiredXP); // เหลือ XP ไปเลเวลถัดไป
      
      if (onLevelUp) {
        onLevelUp(newLevel);
      }
    }

    // แสดง toast พร้อมคำพูด MeeBot
    const comments = meeBotComments[quest.category];
    const randomComment = comments[Math.floor(Math.random() * comments.length)];

    toast({
      title: "🎉 เควสสำเร็จ!",
      description: `${quest.reward} - ${randomComment}`,
    });
  };

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: Quest['category']) => {
    switch (category) {
      case 'productivity': return <Target className="w-4 h-4" />;
      case 'learning': return <Sparkles className="w-4 h-4" />;
      case 'wellness': return <Star className="w-4 h-4" />;
      case 'social': return <Gift className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Overview */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>Level {currentLevel} TaskPilot</span>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {currentXP} / {xpForNextLevel} XP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>ความคืบหน้าเลเวล</span>
              <span>{Math.round(xpProgress)}%</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-slate-700" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>เควสรายวัน ({completedQuests}/{totalQuests})</span>
              <span>{Math.round(questProgress)}%</span>
            </div>
            <Progress value={questProgress} className="h-2 bg-slate-700" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Quests */}
      <Card className="bg-slate-800/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-300">
            <Clock className="w-5 h-5" />
            🎯 เควสรายวันจาก MeeBot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quests.map((quest) => (
            <div 
              key={quest.id}
              className={`p-4 rounded-lg border transition-all ${
                quest.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-slate-700/50 border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-semibold ${
                      quest.completed ? 'text-green-300 line-through' : 'text-white'
                    }`}>
                      {quest.title}
                    </h4>
                    {quest.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{quest.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getDifficultyColor(quest.difficulty)}>
                      {quest.difficulty}
                    </Badge>
                    <Badge className="bg-slate-600/50 text-gray-300 border-slate-500/30">
                      {getCategoryIcon(quest.category)}
                      <span className="ml-1 capitalize">{quest.category}</span>
                    </Badge>
                    <span className="text-cyan-300 text-sm font-medium">
                      {quest.reward}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    onClick={() => handleCompleteQuest(quest.id)}
                    disabled={quest.completed}
                    size="sm"
                    className={quest.completed 
                      ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                      : "bg-cyan-500 hover:bg-cyan-600 text-white"
                    }
                  >
                    {quest.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        สำเร็จ
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        ทำเควส
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Clock, 
  RefreshCw, 
  Heart,
  Trophy,
  Sparkles,
  CheckCircle,
  Calendar,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  xp: number;
  badge?: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DailyQuestsProps {
  onLevelUp: (newLevel: number) => void;
}

export function DailyQuests({ onLevelUp }: DailyQuestsProps) {
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [totalXPForNextLevel, setTotalXPForNextLevel] = useState(100);
  const { toast } = useToast();

  const sampleQuests: Quest[] = [
    {
      id: 'morning_tasks',
      title: '☀️ เคลียร์ 3 งานก่อนเที่ยง',
      description: 'เริ่มวันด้วยพลัง! ลุย 3 งานก่อน 12:00 น.',
      reward: '+10 XP, Badge "Early Riser"',
      xp: 10,
      badge: 'Early Riser',
      completed: false,
      progress: 0,
      maxProgress: 3,
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      difficulty: 'easy'
    },
    {
      id: 'try_swap',
      title: '🔄 ลองใช้ฟีเจอร์ Swap',
      description: 'สำรวจระบบใหม่ แล้วรับ Badge "Explorer"',
      reward: '+5 XP, Badge "Explorer"',
      xp: 5,
      badge: 'Explorer',
      completed: false,
      progress: 0,
      maxProgress: 1,
      icon: <RefreshCw className="w-4 h-4 text-blue-500" />,
      difficulty: 'medium'
    },
    {
      id: 'take_break',
      title: '🧘‍♂️ พัก 5 นาทีหลังทำงาน 1 ชั่วโมง',
      description: 'Productivity ต้องมีความสมดุลนะฮะ!',
      reward: '+5 XP, Badge "Zen Pilot"',
      xp: 5,
      badge: 'Zen Pilot',
      completed: false,
      progress: 0,
      maxProgress: 1,
      icon: <Heart className="w-4 h-4 text-green-500" />,
      difficulty: 'easy'
    }
  ];

  const [quests, setQuests] = useState<Quest[]>(sampleQuests);

  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    // Mark quest as completed
    setQuests(prev => prev.map(q => 
      q.id === questId 
        ? { ...q, completed: true, progress: q.maxProgress }
        : q
    ));

    // Add XP
    const newXP = userXP + quest.xp;
    setUserXP(newXP);

    // Check for level up
    if (newXP >= totalXPForNextLevel) {
      const newLevel = userLevel + 1;
      setUserLevel(newLevel);
      setUserXP(newXP - totalXPForNextLevel);
      setTotalXPForNextLevel(Math.floor(totalXPForNextLevel * 1.5)); // เพิ่มความยากขึ้นเรื่อย ๆ
      
      // Trigger level up notification
      onLevelUp(newLevel);
      
      toast({
        title: "🎉 เลเวลอัป!",
        description: `ขึ้นเป็น Level ${newLevel} แล้ว! เก่งมาก ๆ!`,
      });
    } else {
      toast({
        title: "🎯 เควสสำเร็จ!",
        description: `ได้รับ ${quest.xp} XP และ Badge "${quest.badge}"!`,
      });
    }

    // Play completion sound effect (จำลอง)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('เสียงไม่สามารถเล่นได้:', error);
    }
  };

  const progressToNextLevel = (userXP / totalXPForNextLevel) * 100;
  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;

  return (
    <Card className="bg-gradient-to-br from-green-500/10 via-cyan-500/10 to-blue-500/10 border-green-400/30 overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🎯 เควสรายวันจาก MeeBot
              </h3>
              <p className="text-green-300 text-sm">
                ปลดล็อกพลังภายใน! ลุยไปเรื่อย ๆ! 💪
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-2">
              <Trophy className="w-3 h-3 mr-1" />
              Level {userLevel}
            </Badge>
            <p className="text-xs text-gray-400">
              {completedQuests}/{totalQuests} เควสสำเร็จ
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 font-semibold">
              XP Progress to Level {userLevel + 1}
            </span>
            <span className="text-yellow-300 font-bold">
              {userXP}/{totalXPForNextLevel} XP
            </span>
          </div>
          <Progress 
            value={progressToNextLevel} 
            className="h-3 bg-slate-700"
          />
        </div>

        {/* MeeBot Motivational Quote */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6 relative">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-6 border-b-6 border-r-6 border-transparent border-r-cyan-500/30"></div>
          <p className="text-cyan-100 italic text-sm">
            <strong>MeeBot พูด:</strong> "อย่าลืมเควส 'พักบ้างนะฮะ' — productivity ไม่ได้แปลว่าทำงานตลอดเวลา! 
            ความสมดุลคือกุญแจสำคัญ! 🧘‍♂️✨"
          </p>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.map((quest) => (
            <div 
              key={quest.id}
              className={`bg-slate-800/50 rounded-xl p-4 border transition-all duration-300 ${
                quest.completed 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    quest.completed 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : quest.difficulty === 'easy' 
                        ? 'bg-green-500/10 border border-green-500/20'
                        : quest.difficulty === 'medium'
                          ? 'bg-yellow-500/10 border border-yellow-500/20'
                          : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    {quest.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      quest.icon
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${
                      quest.completed ? 'text-green-300 line-through' : 'text-white'
                    }`}>
                      {quest.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {quest.description}
                    </p>
                    
                    {/* Progress Bar for multi-step quests */}
                    {quest.maxProgress > 1 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            ความคืบหน้า
                          </span>
                          <span className="text-xs text-cyan-300">
                            {quest.progress}/{quest.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(quest.progress / quest.maxProgress) * 100} 
                          className="h-2 bg-slate-700"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        {quest.reward}
                      </Badge>
                      <Badge className={`text-xs ${
                        quest.difficulty === 'easy' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : quest.difficulty === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {quest.difficulty === 'easy' ? '🟢 ง่าย' : 
                         quest.difficulty === 'medium' ? '🟡 ปานกลาง' : '🔴 ยาก'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {quest.completed ? (
                    <div className="text-green-400 text-sm font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      สำเร็จ!
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCompleteQuest(quest.id)}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      ทำเควส!
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Reset Timer */}
        <div className="mt-6 text-center">
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>เควสรีเซ็ตใหม่ในอีก 12:34:56</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
