
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Trophy,
  TrendingUp,
  Clock,
  Zap,
  Star,
  ArrowLeft,
  Menu,
  Bot,
  Target,
  Crown
} from 'lucide-react';
import { Link } from 'wouter';
import { TeamBadgeUnlock } from '@/components/meebot/team-badge-unlock';
import { MeeBotTips } from '@/components/meebot/meebot-tips';
import { useToast } from '@/hooks/use-toast';

export default function TeamDashboard() {
  const { toast } = useToast();
  
  // State สำหรับ team progress
  const [teamProgress, setTeamProgress] = useState({
    completedTasks: 12,
    goal: 20,
    badge: 'Team Spirit Champions',
    badgeIcon: '🏆',
    description: 'ทำงานร่วมกันและช่วยเหลือกันในทีมให้ครบ 20 งาน',
    teamMembers: ['Alice 🚀', 'Bob 💻', 'Charlie ⚡', 'Diana 🌟', 'Eve 🎯'],
    timeLeft: '2 วัน 14 ชม.'
  });

  // State สำหรับ team stats
  const [teamStats, setTeamStats] = useState({
    totalMembers: 5,
    activeMembers: 4,
    totalXP: 2850,
    weeklyTasks: 127,
    averageLevel: 8.4,
    teamRank: 3
  });

  // State สำหรับ ongoing badges
  const [ongoingBadges, setOngoingBadges] = useState([
    {
      completedTasks: 15,
      goal: 25,
      badge: 'Code Warriors',
      badgeIcon: '⚔️',
      description: 'เขียนโค้ดและ review code ร่วมกันให้ครบ 25 ครั้ง',
      teamMembers: ['Alice 🚀', 'Bob 💻', 'Charlie ⚡', 'Diana 🌟'],
      timeLeft: '1 สัปดาห์'
    },
    {
      completedTasks: 8,
      goal: 10,
      badge: 'Learning Masters',
      badgeIcon: '📚',
      description: 'เรียนรู้และแชร์ความรู้ใหม่ให้ครบ 10 หัวข้อ',
      teamMembers: ['Bob 💻', 'Diana 🌟', 'Eve 🎯'],
      timeLeft: '3 วัน'
    }
  ]);

  // จำลอง real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // สุ่มอัปเดต progress
      if (Math.random() > 0.7) {
        setTeamProgress(prev => ({
          ...prev,
          completedTasks: Math.min(prev.completedTasks + 1, prev.goal)
        }));
      }

      // อัปเดต stats
      setTeamStats(prev => ({
        ...prev,
        totalXP: prev.totalXP + Math.floor(Math.random() * 10),
        weeklyTasks: prev.weeklyTasks + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBadgeUnlock = (badge: string) => {
    toast({
      title: "🎉 Badge ปลดล็อกสำเร็จ!",
      description: `ทีมได้รับ Badge "${badge}" แล้ว! MeeBot ภูมิใจมาก!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/meebot">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🤝 ห้องนักบินทีม
          </h1>
          <p className="text-gray-300 text-lg">
            พลังของทีมที่ MeeBot ภูมิใจมากที่สุด! 🚀
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* MeeBot Tips */}
          <MeeBotTips />

          {/* Main Team Badge */}
          <TeamBadgeUnlock 
            progress={teamProgress} 
            onBadgeUnlock={handleBadgeUnlock}
          />

          {/* Ongoing Badges */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
              <Target className="w-5 h-5" />
              🎯 Badge อื่น ๆ ที่กำลังลุย
            </h3>
            {ongoingBadges.map((badge, index) => (
              <TeamBadgeUnlock 
                key={index}
                progress={badge} 
                onBadgeUnlock={handleBadgeUnlock}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Stats & Info */}
        <div className="space-y-6">
          {/* Team Stats */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <TrendingUp className="w-5 h-5" />
                📊 สถิติทีม
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{teamStats.totalMembers}</div>
                  <div className="text-xs text-gray-300">สมาชิกทั้งหมด</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{teamStats.activeMembers}</div>
                  <div className="text-xs text-gray-300">กำลังออนไลน์</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{teamStats.totalXP.toLocaleString()}</div>
                  <div className="text-xs text-gray-300">XP รวมทีม</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-400">{teamStats.weeklyTasks}</div>
                  <div className="text-xs text-gray-300">งานสัปดาห์นี้</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">เลเวลเฉลี่ยทีม:</span>
                  <span className="text-cyan-400 font-semibold">{teamStats.averageLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">อันดับทีม:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    #{teamStats.teamRank}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Clock className="w-5 h-5" />
                🎉 กิจกรรมล่าสุด
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400 text-sm font-medium">Alice 🚀</span>
                  <span className="text-xs text-gray-400">2 นาทีที่แล้ว</span>
                </div>
                <p className="text-gray-300 text-xs">ทำเควส "Code Review Master" สำเร็จ!</p>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400 text-sm font-medium">Bob 💻</span>
                  <span className="text-xs text-gray-400">5 นาทีที่แล้ว</span>
                </div>
                <p className="text-gray-300 text-xs">ปลดล็อก Badge "Learning Enthusiast"</p>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-purple-400 text-sm font-medium">ทีม</span>
                  <span className="text-xs text-gray-400">10 นาทีที่แล้ว</span>
                </div>
                <p className="text-gray-300 text-xs">ครบ milestone 120 งานในสัปดาห์!</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Zap className="w-5 h-5" />
                ⚡ ด่วน! MeeBot แนะนำ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                <Users className="w-4 h-4 mr-2" />
                เริ่ม Pomodoro ทีม
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-purple-500 text-purple-300 hover:bg-purple-800/50"
              >
                <Star className="w-4 h-4 mr-2" />
                ดูเควสใหม่ประจำวัน
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-yellow-500 text-yellow-300 hover:bg-yellow-800/50"
              >
                <Crown className="w-4 h-4 mr-2" />
                ดู Badge Collection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
