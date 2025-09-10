
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Award,
  Sparkles,
  Bot,
  ChevronRight
} from 'lucide-react';
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
              <p className="text-cyan-300 font-medium text-sm mb-1">MeeBot แนะนำ</p>
              <p className="text-cyan-200 text-xs">
                "วันนี้มีสมาชิกใหม่ 12 คน! หัวข้อ 'Web3 Beginner Tips' กำลังฮิตมาก 🔥"
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            กิจกรรมล่าสุด
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <span className="text-lg flex-shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm truncate">
                      {activity.username}
                    </span>
                    <span className={`text-xs ${getActivityColor(activity.type)}`}>
                      {activity.type === 'achievement' && '🏆'}
                      {activity.type === 'helpful_answer' && '💡'}
                      {activity.type === 'new_post' && '📝'}
                      {activity.type === 'trending' && '🔥'}
                    </span>
                  </div>
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
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            แชร์ Achievement
          </Button>
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-orange-300 text-sm font-medium">Fun Fact วันนี้</p>
              <p className="text-orange-200 text-xs">
                สมาชิกที่ช่วยเหลือคนอื่นมากที่สุดได้รับ "Community Hero" badge! 🦸‍♂️
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
