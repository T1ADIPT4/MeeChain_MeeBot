
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Bot, TrendingUp, MessageCircle, Award, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

interface CommunityActivity {
  id: string;
  type: 'new_post' | 'achievement' | 'helpful_answer' | 'trending';
  username: string;
  content: string;
  timestamp: string;
  icon: string;
}

export function CommunityWidget() {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Mock community activities
    const mockActivities: CommunityActivity[] = [
      {
        id: '1',
        type: 'achievement',
        username: 'CryptoPilot99',
        content: 'ได้ Badge "Swap Master" แล้ว!',
        timestamp: '5 นาทีที่แล้ว',
        icon: '🏆'
      },
      {
        id: '2',
        type: 'helpful_answer',
        username: 'BlockchainGuru',
        content: 'ตอบคำถามเรื่อง Wallet Security',
        timestamp: '15 นาทีที่แล้ว',
        icon: '💡'
      },
      {
        id: '3',
        type: 'new_post',
        username: 'TokenHunter',
        content: 'แชร์ประสบการณ์การใช้ Faucet',
        timestamp: '1 ชั่วโมงที่แล้ว',
        icon: '📝'
      },
      {
        id: '4',
        type: 'trending',
        username: 'NFTArtist',
        content: 'โพสต์ NFT กำลังฮิต!',
        timestamp: '2 ชั่วโมงที่แล้ว',
        icon: '🔥'
      }
    ];
    
    setActivities(mockActivities);
    setOnlineUsers(247); // Mock online users
  }, []);

  const getActivityColor = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'achievement': return 'text-yellow-300';
      case 'helpful_answer': return 'text-green-300';
      case 'new_post': return 'text-blue-300';
      case 'trending': return 'text-red-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-purple-500/30 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300">🏡 Community Live</span>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            {onlineUsers} คนออนไลน์
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* MeeBot Community Insight */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-cyan-300 font-medium text-sm">MeeBot Insight</p>
              <p className="text-cyan-200 text-xs">วันนี้มีคำถามเรื่อง Wallet Security เยอะ! ลองแชร์ประสบการณ์กันนะ</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            กิจกรรมล่าสุด
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs">
                    <span>
                      {activity.type === 'achievement' && '🏆'}
                      {activity.type === 'helpful_answer' && '💡'}
                      {activity.type === 'new_post' && '📝'}
                      {activity.type === 'trending' && '🔥'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {activity.username}
                  </p>
                  <p className="text-xs text-gray-300 truncate">{activity.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-700/50 rounded-lg p-2">
            <p className="text-lg font-bold text-yellow-300">156</p>
            <p className="text-xs text-gray-400">โพสต์วันนี้</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <p className="text-lg font-bold text-green-300">89</p>
            <p className="text-xs text-gray-400">การช่วยเหลือ</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <p className="text-lg font-bold text-purple-300">23</p>
            <p className="text-xs text-gray-400">Badge ใหม่</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link to="/community">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              เข้าร่วม Community
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            ถามคำถาม
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
