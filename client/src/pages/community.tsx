import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Star, 
  Bot,
  Sparkles,
  Award,
  Users,
  TrendingUp,
  Clock,
  Eye,
  ChevronRight,
  Plus,
  Filter,
  User, // Added for general user icon
  Bug, // Added for Bug Buster
  Wrench, // Added for UX Wizard
  DollarSign, // Added for Swap Ninja
  BookOpen, // Added for Insight Seeker
} from 'lucide-react';
import { Link } from 'wouter';

interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userBadges: string[];
  content: string;
  achievements?: {
    type: 'badge' | 'level' | 'mission' | 'streak';
    title: string;
    description: string;
    icon: string;
  }[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  meeBotReaction?: string;
  tags: string[];
}

interface TrendingTopic {
  id: string;
  title: string;
  posts: number;
  icon: string;
}

export default function CommunityPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [filter, setFilter] = useState<'all' | 'achievements' | 'tips' | 'questions'>('all');

  // Mock community data
  useEffect(() => {
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'CryptoPilot99',
        userAvatar: '',
        userBadges: ['Explorer', 'Security Expert', 'Swap Ninja'],
        content: 'เย้! ผมลองใช้ Swap ครั้งแรกแล้วได้ badge นี้! รู้สึกภูมิใจมาก ❤️ ขอบคุณ MeeBot ที่แนะนำทุกขั้นตอน',
        achievements: [
          {
            type: 'badge',
            title: 'Swap Master',
            description: 'ทำ Token Swap สำเร็จ',
            icon: '🔄'
          }
        ],
        timestamp: '2 ชั่วโมงที่แล้ว',
        likes: 24,
        comments: 8,
        isLiked: false,
        meeBotReaction: 'สุดยอดเลยจ้า! คุณเก่งมาก ๆ เลยนะ! 🎉',
        tags: ['swap', 'beginner', 'achievement']
      },
      {
        id: '2',
        userId: 'user2',
        username: 'BlockchainGuru',
        userAvatar: '',
        userBadges: ['Guardian', 'Helpful Hero', 'Bug Buster'],
        content: 'สำหรับมือใหม่ที่จะเริ่มเรียน Web3: แนะนำให้เริ่มจาก Academy ก่อนนะครับ เนื้อหาดีมาก เข้าใจง่าย MeeBot อธิบายชัดเจนด้วย! 📚',
        timestamp: '5 ชั่วโมงที่แล้ว',
        likes: 156,
        comments: 32,
        isLiked: true,
        meeBotReaction: 'ขอบคุณที่ช่วยแนะนำเพื่อน ๆ นะครับ! คุณเป็น Community Hero จริง ๆ! 🦸‍♂️',
        tags: ['tips', 'academy', 'beginner']
      },
      {
        id: '3',
        userId: 'user3',
        username: 'TokenHunter',
        userAvatar: '',
        userBadges: ['Token Collector', 'Insight Seeker'],
        content: 'มีใครพอจะรู้วิธีเชื่อมต่อ Wallet กับ Fuse Network บ้างไหม? ลองทำตาม Tutorial แล้วแต่ติดขั้นตอนสุดท้าย 🤔',
        timestamp: '1 วันที่แล้ว',
        likes: 12,
        comments: 15,
        isLiked: false,
        meeBotReaction: 'อย่าเครียดนะครับ! ผมมี Tutorial พิเศษให้ ลองไปดูที่ Academy เซคชั่น "Network Setup" นะ! 💪',
        tags: ['question', 'wallet', 'network']
      },
      {
        id: '4',
        userId: 'user4',
        username: 'NFTArtist',
        userAvatar: '',
        userBadges: ['Creative Mind', 'First Flight', 'UX Wizard'],
        content: 'สร้าง NFT ใหม่เสร็จแล้ว! ขอบคุณ MeeChain ที่ทำให้การสร้าง NFT ง่ายขึ้นมาก ใครสนใจมาดูผลงานกันนะ ✨',
        achievements: [
          {
            type: 'mission',
            title: 'NFT Creator',
            description: 'สร้าง NFT แรก',
            icon: '🎨'
          }
        ],
        timestamp: '2 วันที่แล้ว',
        likes: 89,
        comments: 23,
        isLiked: false,
        meeBotReaction: 'ว้าววววว! NFT สวยมาก ๆ เลย! คุณมีพรสวรรค์จริง ๆ นะ! 🎨✨',
        tags: ['nft', 'creative', 'achievement']
      }
    ];

    const mockTrending: TrendingTopic[] = [
      { id: '1', title: 'Wallet Security Tips', posts: 45, icon: '🔒' },
      { id: '2', title: 'First Swap Experience', posts: 38, icon: '🔄' },
      { id: '3', title: 'Academy Feedback', posts: 29, icon: '📚' },
      { id: '4', title: 'NFT Showcase', posts: 22, icon: '🎨' },
      { id: '5', title: 'MeeBot Tips', posts: 18, icon: '🤖' }
    ];

    setPosts(mockPosts);
    setTrendingTopics(mockTrending);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleMeeBotReact = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post?.meeBotReaction) {
      toast({
        title: "🤖 MeeBot พูดว่า:",
        description: post.meeBotReaction,
      });
    }
  };

  const getFilteredPosts = () => {
    switch (filter) {
      case 'achievements':
        return posts.filter(post => post.achievements && post.achievements.length > 0);
      case 'tips':
        return posts.filter(post => post.tags.includes('tips'));
      case 'questions':
        return posts.filter(post => post.tags.includes('question'));
      default:
        return posts;
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      'Explorer': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Guardian': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Security Expert': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Helpful Hero': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Bug Buster': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Token Collector': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Creative Mind': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'First Flight': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Swap Ninja': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'UX Wizard': 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      'Insight Seeker': 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    };
    return colors[badge as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getBadgeIcon = (badge: string) => {
    const icons = {
      'Explorer': <User className="w-3 h-3" />,
      'Guardian': <Award className="w-3 h-3" />,
      'Security Expert': <ShieldCheck className="w-3 h-3" />, // Assuming a ShieldCheck icon
      'Helpful Hero': <Star className="w-3 h-3" />,
      'Bug Buster': <Bug className="w-3 h-3" />,
      'Token Collector': <DollarSign className="w-3 h-3" />,
      'Creative Mind': <Sparkles className="w-3 h-3" />,
      'First Flight': <TrendingUp className="w-3 h-3" />,
      'Swap Ninja': <DollarSign className="w-3 h-3" />,
      'UX Wizard': <Wrench className="w-3 h-3" />,
      'Insight Seeker': <BookOpen className="w-3 h-3" />
    };
    return icons[badge as keyof typeof icons] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/meebot">
              <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-white/10">
                ← กลับ MeeBot
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🏡 MeeChain Community</h1>
              <p className="text-purple-200">แชร์ประสบการณ์ เรียนรู้ และเติบโตไปด้วยกัน</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            แชร์โพสต์
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* MeeBot Recommendations */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  MeeBot แนะนำ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 text-sm font-medium mb-1">โพสต์ฮิตวันนี้</p>
                      <p className="text-yellow-100 text-xs">"Web3 Tips for Beginners" มีคนกดหัวใจเยอะสุด!</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-200 text-sm font-medium mb-1">Achievement ใหม่</p>
                      <p className="text-green-100 text-xs">5 คนได้ "Community Helper" badge วันนี้!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  หัวข้อกำลังฮิต
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div 
                    key={topic.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{topic.icon}</span>
                      <span className="text-white text-sm font-medium">{topic.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-xs">{topic.posts}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-black/50 border-orange-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-300 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  สถิติชุมชน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-300">1,247</p>
                  <p className="text-sm text-gray-300">สมาชิกทั้งหมด</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-300">89</p>
                  <p className="text-sm text-gray-300">โพสต์วันนี้</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-300">456</p>
                  <p className="text-sm text-gray-300">Badge แจกไปแล้ว</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg border border-slate-600">
              {[
                { key: 'all', label: 'ทั้งหมด', icon: Eye },
                { key: 'achievements', label: 'Achievement', icon: Trophy },
                { key: 'tips', label: 'เทคนิค', icon: Star },
                { key: 'questions', label: 'คำถาม', icon: MessageCircle }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(key as any)}
                  className={filter === key 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {getFilteredPosts().map((post) => (
                <Card key={post.id} className="bg-black/50 border-slate-600 hover:border-purple-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                          {post.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{post.username}</h4>
                          <div className="flex items-center gap-1">
                            {post.userBadges.map((badge) => (
                              <Badge key={badge} className={`text-xs ${getBadgeColor(badge)} flex items-center gap-1`}>
                                <span>{getBadgeIcon(badge)}</span>
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">{post.content}</p>

                    {/* Achievements Display */}
                    {post.achievements && post.achievements.length > 0 && (
                      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <h5 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Achievement ใหม่!
                        </h5>
                        {post.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div>
                              <p className="font-semibold text-yellow-300">{achievement.title}</p>
                              <p className="text-sm text-yellow-200">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* MeeBot Reaction */}
                    {post.meeBotReaction && (
                      <div 
                        className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 cursor-pointer hover:bg-cyan-500/20 transition-colors"
                        onClick={() => handleMeeBotReact(post.id)}
                      >
                        <div className="flex items-start gap-2">
                          <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-cyan-300 font-medium text-sm">MeeBot React</p>
                            <p className="text-cyan-200 text-sm italic">คลิกเพื่อดูความคิดเห็นของ MeeBot</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`text-gray-400 hover:text-red-400 ${post.isLiked ? 'text-red-400' : ''}`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                        <Share2 className="w-4 h-4 mr-1" />
                        แชร์
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}