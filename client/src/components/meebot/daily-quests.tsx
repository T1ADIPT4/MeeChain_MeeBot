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
  // รายการเควสแบ่งตามหมวดหมู่ที่หลากหลาย
  const questPool = {
    exploration: [
      {
        title: '🔄 ลองใช้ฟีเจอร์ Swap',
        description: 'สำรวจระบบ Token Swap แล้วรับ Badge "Web3 Explorer"',
        reward: '+10 XP, Badge "Web3 Explorer"',
        xp: 10,
        badge: 'Web3 Explorer',
        difficulty: 'easy' as const
      },
      {
        title: '💰 ตรวจสอบ Wallet Balance',
        description: 'เช็ค Balance ใน Wallet แล้วรู้จักระบบมากขึ้น!',
        reward: '+8 XP, Badge "Wallet Master"',
        xp: 8,
        badge: 'Wallet Master',
        difficulty: 'easy' as const
      },
      {
        title: '📊 ดูสถิติ Transaction',
        description: 'สำรวจประวัติ Transaction ของคุณ!',
        reward: '+12 XP, Badge "Data Explorer"',
        xp: 12,
        badge: 'Data Explorer',
        difficulty: 'medium' as const
      }
    ],
    productivity: [
      {
        title: '🌅 เคลียร์ 3 งานก่อนเที่ยง',
        description: 'เริ่มวันด้วยพลัง! ลุย 3 งานก่อน 12:00 นาฬิกา',
        reward: '+15 XP, Badge "Early Riser"',
        xp: 15,
        badge: 'Early Riser',
        difficulty: 'medium' as const
      },
      {
        title: '⚡ ใช้เทคนิค Pomodoro 3 รอบ',
        description: 'ทำงาน 25 นาที พัก 5 นาที ทำ 3 รอบให้ครบ!',
        reward: '+18 XP, Badge "Focus Master"',
        xp: 18,
        badge: 'Focus Master',
        difficulty: 'medium' as const
      },
      {
        title: '📝 สร้าง Task List วันใหม่',
        description: 'วางแผนวันใหม่ด้วย Task List ที่เป็นระเบียบ!',
        reward: '+10 XP, Badge "Planner Pro"',
        xp: 10,
        badge: 'Planner Pro',
        difficulty: 'easy' as const
      }
    ],
    lifestyle: [
      {
        title: '🧘‍♂️ พัก 5 นาทีหลังทำงาน 1 ชั่วโมง',
        description: 'Productivity ต้องมีความสมดุลนะฮะ! ดูแลสุขภาพจิต',
        reward: '+8 XP, Badge "Zen Pilot"',
        xp: 8,
        badge: 'Zen Pilot',
        difficulty: 'easy' as const
      },
      {
        title: '💧 ดื่มน้ำ 8 แก้วตลอดวัน',
        description: 'ร่างกายต้องการน้ำ! ดูแลสุขภาพไปด้วยกัน',
        reward: '+6 XP, Badge "Hydration Hero"',
        xp: 6,
        badge: 'Hydration Hero',
        difficulty: 'easy' as const
      },
      {
        title: '🚶‍♂️ เดิน 30 นาทีหลังอาหารเที่ยง',
        description: 'ออกแรงเล็กน้อย เพื่อสุขภาพที่แข็งแรง!',
        reward: '+12 XP, Badge "Active Life"',
        xp: 12,
        badge: 'Active Life',
        difficulty: 'medium' as const
      }
    ],
    social: [
      {
        title: '💬 คุยกับ MeeBot 5 ครั้ง',
        description: 'มาเป็นเพื่อนกับผมสิ! ยิงคำถามมาให้ผมตอบ',
        reward: '+12 XP, Badge "Chatty Friend"',
        xp: 12,
        badge: 'Chatty Friend',
        difficulty: 'easy' as const
      },
      {
        title: '🤝 ชวนเพื่อนใช้ TaskPilot',
        description: 'แชร์ความสนุกให้เพื่อน ๆ ได้ลองใช้ด้วยกัน!',
        reward: '+20 XP, Badge "Community Builder"',
        xp: 20,
        badge: 'Community Builder',
        difficulty: 'hard' as const
      },
      {
        title: '📱 แชร์ Achievement ในโซเชียล',
        description: 'โชว์ความสำเร็จของคุณให้โลกได้เห็น!',
        reward: '+15 XP, Badge "Show Off"',
        xp: 15,
        badge: 'Show Off',
        difficulty: 'medium' as const
      }
    ]
  };

  // สุ่มเควสจากแต่ละหมวด (1 เควสต่อหมวด)
  const generateDailyQuests = () => {
    const categories = Object.keys(questPool) as Array<keyof typeof questPool>;
    const selectedQuests = categories.map((category, index) => {
      const categoryQuests = questPool[category];
      const randomQuest = categoryQuests[Math.floor(Math.random() * categoryQuests.length)];
      return {
        id: index + 1,
        ...randomQuest,
        category,
        completed: false
      };
    });
    return selectedQuests;
  };

  const [quests, setQuests] = useState<Quest[]>(() => {
    // เช็คว่ามีเควสของวันนี้ใน localStorage หรือไม่
    const today = new Date().toDateString();
    const savedQuests = localStorage.getItem(`meebot_daily_quests_${today}`);

    if (savedQuests) {
      return JSON.parse(savedQuests);
    } else {
      // สร้างเควสใหม่และบันทึก
      const newQuests = generateDailyQuests();
      localStorage.setItem(`meebot_daily_quests_${today}`, JSON.stringify(newQuests));
      return newQuests;
    }
  });

  const [currentXP, setCurrentXP] = useState(() => {
    return parseInt(localStorage.getItem('meebot_xp') || '0');
  });

  const [currentLevel, setCurrentLevel] = useState(() => {
    return parseInt(localStorage.getItem('meebot_level') || '1');
  });

  const [dailyStreak, setDailyStreak] = useState(() => {
    return parseInt(localStorage.getItem('meebot_daily_streak') || '0');
  });

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const questProgress = (totalQuests > 0) ? (completedQuests / totalQuests) * 100 : 0;

  // XP จำนวนที่ต้องการสำหรับเลเวลถัดไป
  const xpForNextLevel = currentLevel * 50;
  const xpProgress = (xpForNextLevel > 0) ? (currentXP / xpForNextLevel) * 100 : 0;

  useEffect(() => {
    localStorage.setItem('meebot_xp', currentXP.toString());
    localStorage.setItem('meebot_level', currentLevel.toString());
    localStorage.setItem('meebot_daily_streak', dailyStreak.toString());
  }, [currentXP, currentLevel, dailyStreak]);

  // เช็คและอัปเดตเควสรายวันใหม่เมื่อเปลี่ยนวัน
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      const lastQuestDate = localStorage.getItem('meebot_last_quest_date');

      if (lastQuestDate !== today) {
        // วันใหม่! สร้างเควสใหม่
        const newQuests = generateDailyQuests();
        setQuests(newQuests);
        localStorage.setItem(`meebot_daily_quests_${today}`, JSON.stringify(newQuests));
        localStorage.setItem('meebot_last_quest_date', today);

        // เช็ค streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayQuests = localStorage.getItem(`meebot_daily_quests_${yesterday.toDateString()}`);

        if (yesterdayQuests) {
          const parsedYesterdayQuests = JSON.parse(yesterdayQuests);
          const yesterdayCompleted = parsedYesterdayQuests.filter((q: Quest) => q.completed).length;

          if (yesterdayCompleted >= 3) { // ทำเควสครบ 3 เควสขึ้นไป
            setDailyStreak(prev => prev + 1);
          } else {
            setDailyStreak(0); // รีเซ็ต streak
          }
        }
      }
    };

    checkNewDay();
    // เช็คทุก ๆ นาที (สำหรับกรณีเปิดแอปค้างไว้ข้ามวัน)
    const interval = setInterval(checkNewDay, 60000);

    return () => clearInterval(interval);
  }, []);

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
    // เพิ่มการตรวจสอบว่า quest มีอยู่และยังไม่ถูก completed
    if (!quest || quest.completed) return;

    // อัปเดต quest status
    const updatedQuests = quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );
    setQuests(updatedQuests);

    // บันทึกเควสที่อัปเดตลง localStorage
    const today = new Date().toDateString();
    localStorage.setItem(`meebot_daily_quests_${today}`, JSON.stringify(updatedQuests));

    // เพิ่ม XP
    const newXP = currentXP + quest.xp;
    setCurrentXP(newXP);

    // เช็ค level up
    const requiredXP = currentLevel * 50;
    if (newXP >= requiredXP) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      // ตรวจสอบให้แน่ใจว่า newXP - requiredXP ไม่ติดลบ
      setCurrentXP(Math.max(0, newXP - requiredXP)); 

      if (onLevelUp) {
        onLevelUp(newLevel);
      }
    }

    // แสดง toast พร้อมคำพูด MeeBot
    // ตรวจสอบว่า quest.category มีอยู่ใน meeBotComments หรือไม่
    const comments = meeBotComments[quest.category as keyof typeof meeBotComments];
    const randomComment = comments && comments.length > 0 
      ? comments[Math.floor(Math.random() * comments.length)]
      : "เยี่ยมมาก!"; // ข้อความสำรองหากไม่มี category ที่ตรงกัน

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
            <div className="flex items-center gap-2">
              {dailyStreak > 0 && (
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                  🔥 {dailyStreak} วันติด
                </Badge>
              )}
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                {currentXP} / {xpForNextLevel} XP
              </Badge>
            </div>
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
          <CardTitle className="flex items-center justify-between text-cyan-300">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              🎯 เควสรายวันจาก MeeBot
            </div>
            <div className="text-sm text-gray-400">
              สุ่มใหม่ทุกวัน!
            </div>
          </CardTitle>
          <p className="text-gray-300 text-sm mt-2">
            💬 <strong>MeeBot บอก:</strong> "ภารกิจวันนี้แบ่งเป็น 4 หมวด! 
            {completedQuests === 0 && " มาลุยกันเถอะ! 🚀"}
            {completedQuests > 0 && completedQuests < totalQuests && ` ทำไปแล้ว ${completedQuests} เควส เก่งมาก! 💪`}
            {completedQuests === totalQuests && " ครบทุกเควสแล้ว! คุณเจ๋งมาก! 🏆"}
            "
          </p>
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