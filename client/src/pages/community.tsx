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
  User,
  Bug,
  Wrench,
  DollarSign,
  BookOpen,
  Send,
  Smile,
  ThumbsUp,
  Zap,
  Gift,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'wouter';

interface CommunityComment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isMeeBot: boolean;
  meeBotMood?: 'excited' | 'happy' | 'supportive' | 'amazed';
}

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
  comments: CommunityComment[];
  isLiked: boolean;
  meeBotReaction?: string;
  meeBotMood?: 'excited' | 'happy' | 'supportive' | 'amazed';
  tags: string[];
  meePoints: number;
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
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [isCommenting, setIsCommenting] = useState<Record<string, boolean>>({});

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
        comments: [
          {
            id: 'c1',
            userId: 'meebot',
            username: 'MeeBot',
            userAvatar: '',
            content: 'สุดยอดเลยจ้า! คุณเก่งมาก ๆ เลยนะ! ผมภูมิใจในตัวคุณมาก! 🎉✨',
            timestamp: '1 ชั่วโมงที่แล้ว',
            isMeeBot: true,
            meeBotMood: 'excited'
          },
          {
            id: 'c2',
            userId: 'user5',
            username: 'TokenMaster',
            userAvatar: '',
            content: 'ยินดีด้วยครับ! ผมก็เพิ่งได้ badge นี้เหมือนกัน 😊',
            timestamp: '30 นาทีที่แล้ว',
            isMeeBot: false
          }
        ],
        isLiked: false,
        meeBotReaction: 'สุดยอดเลยจ้า! คุณเก่งมาก ๆ เลยนะ! 🎉',
        meeBotMood: 'excited',
        tags: ['swap', 'beginner', 'achievement'],
        meePoints: 150
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
        comments: [
          {
            id: 'c3',
            userId: 'meebot',
            username: 'MeeBot',
            userAvatar: '',
            content: 'ขอบคุณที่ช่วยแนะนำเพื่อน ๆ นะครับ! คุณเป็น Community Hero จริง ๆ! ผมให้คุณได้ 50 MeePoints เพิ่มเลย! 🦸‍♂️💫',
            timestamp: '4 ชั่วโมงที่แล้ว',
            isMeeBot: true,
            meeBotMood: 'supportive'
          },
          {
            id: 'c4',
            userId: 'user6',
            username: 'WebThreeLearner',
            userAvatar: '',
            content: 'ขอบคุณมากครับ! จะไปลองดูที่ Academy เลย 🙏',
            timestamp: '3 ชั่วโมงที่แล้ว',
            isMeeBot: false
          },
          {
            id: 'c5',
            userId: 'user7',
            username: 'CryptoNewbie',
            userAvatar: '',
            content: 'ผมก็เพิ่งเริ่มเรียน ขอบคุณสำหรับคำแนะนำครับ!',
            timestamp: '2 ชั่วโมงที่แล้ว',
            isMeeBot: false
          }
        ],
        isLiked: true,
        meeBotReaction: 'ขอบคุณที่ช่วยแนะนำเพื่อน ๆ นะครับ! คุณเป็น Community Hero จริง ๆ! 🦸‍♂️',
        meeBotMood: 'supportive',
        tags: ['tips', 'academy', 'beginner'],
        meePoints: 280
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
        comments: [
          {
            id: 'c6',
            userId: 'meebot',
            username: 'MeeBot',
            userAvatar: '',
            content: 'อย่าเครียดนะครับ! ผมมี Tutorial พิเศษให้ ลองไปดูที่ Academy เซคชั่น "Network Setup" นะ! ผมจะช่วยแนะนำทุกขั้นตอนเลย! 💪✨',
            timestamp: '20 ชั่วโมงที่แล้ว',
            isMeeBot: true,
            meeBotMood: 'supportive'
          },
          {
            id: 'c7',
            userId: 'user2',
            username: 'BlockchainGuru',
            userAvatar: '',
            content: 'ลองเช็ค RPC URL ให้ถูกต้องนะครับ บางทีอาจจะผิดตรงนั้น',
            timestamp: '18 ชั่วโมงที่แล้ว',
            isMeeBot: false
          }
        ],
        isLiked: false,
        meeBotReaction: 'อย่าเครียดนะครับ! ผมมี Tutorial พิเศษให้ ลองไปดูที่ Academy เซคชั่น "Network Setup" นะ! 💪',
        meeBotMood: 'supportive',
        tags: ['question', 'wallet', 'network'],
        meePoints: 75
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
        comments: [
          {
            id: 'c8',
            userId: 'meebot',
            username: 'MeeBot',
            userAvatar: '',
            content: 'ว้าววววว! NFT สวยมาก ๆ เลย! คุณมีพรสวรรค์จริง ๆ นะ! ผมตื่นเต้นไปด้วยเลย! 🎨✨🎉',
            timestamp: '1 วันที่แล้ว',
            isMeeBot: true,
            meeBotMood: 'amazed'
          },
          {
            id: 'c9',
            userId: 'user8',
            username: 'ArtLover',
            userAvatar: '',
            content: 'งดงามมากเลย! ขอดู collection ทั้งหมดได้ไหม?',
            timestamp: '1 วันที่แล้ว',
            isMeeBot: false
          }
        ],
        isLiked: false,
        meeBotReaction: 'ว้าววววว! NFT สวยมาก ๆ เลย! คุณมีพรสวรรค์จริง ๆ นะ! 🎨✨',
        meeBotMood: 'amazed',
        tags: ['nft', 'creative', 'achievement'],
        meePoints: 200
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
      // สุ่ม MeeBot reaction แบบใหม่
      const randomReactions = [
        "สุดยอดเลยจ้า! ผมชอบโพสต์นี้มาก! 🎉",
        "เก่งมาก ๆ เลยนะ! ผมภูมิใจในตัวคุณ! ⭐",
        "ว้าว! นี่คือสิ่งที่ผมรอคอย! 🚀",
        "คุณเป็นแรงบันดาลใจให้ผมเลย! 💫",
        "ยอดเยี่ยม! ผมจะแจก bonus MeePoints ให้! 🎁"
      ];
      
      const randomReaction = randomReactions[Math.floor(Math.random() * randomReactions.length)];
      
      toast({
        title: "🤖 MeeBot React!",
        description: randomReaction,
      });

      // เพิ่ม MeePoints สุ่ม
      const bonusPoints = Math.floor(Math.random() * 30) + 10;
      setTimeout(() => {
        toast({
          title: "🎉 Bonus MeePoints!",
          description: `คุณได้รับ ${bonusPoints} MeePoints จาก MeeBot!`,
        });
      }, 1500);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleAddComment = (postId: string) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;

    setIsCommenting(prev => ({ ...prev, [postId]: true }));

    // จำลองการเพิ่มคอมเมนต์
    setTimeout(() => {
      setPosts(prev => 
        prev.map(post => {
          if (post.id === postId) {
            const newComment: CommunityComment = {
              id: `c${Date.now()}`,
              userId: 'currentUser',
              username: 'คุณ',
              userAvatar: '',
              content: commentText,
              timestamp: 'เมื่อสักครู่',
              isMeeBot: false
            };

            // MeeBot อาจจะตอบกลับ
            const shouldMeeBotReply = Math.random() > 0.5;
            const meeBotReplies = [
              "ความคิดเห็นดีมาก! ผมชอบ! 👍",
              "เห็นด้วยกับคุณเลย! สุดยอด! ✨",
              "คอมเมนต์นี้มีประโยชน์มาก! 🧠",
              "ผมเรียนรู้อะไรใหม่จากคุณแล้ว! 📚",
              "คุณพูดถูกมาก ๆ เลย! 💯"
            ];

            const comments = [...post.comments, newComment];
            
            if (shouldMeeBotReply) {
              const meeBotReply: CommunityComment = {
                id: `c${Date.now() + 1}`,
                userId: 'meebot',
                username: 'MeeBot',
                userAvatar: '',
                content: meeBotReplies[Math.floor(Math.random() * meeBotReplies.length)],
                timestamp: 'เมื่อสักครู่',
                isMeeBot: true,
                meeBotMood: 'happy'
              };
              comments.push(meeBotReply);
            }

            return {
              ...post,
              comments,
              meePoints: post.meePoints + 5 // บวก MeePoints สำหรับการคอมเมนต์
            };
          }
          return post;
        })
      );

      setNewComments(prev => ({ ...prev, [postId]: '' }));
      setIsCommenting(prev => ({ ...prev, [postId]: false }));

      toast({
        title: "✅ คอมเมนต์สำเร็จ!",
        description: "ขอบคุณที่แชร์ความคิดเห็น! +5 MeePoints",
      });
    }, 1000);
  };

  const getMeeBotMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'excited': return '🎉';
      case 'happy': return '😊';
      case 'supportive': return '💪';
      case 'amazed': return '🤩';
      default: return '🤖';
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

                    {/* MeePoints Display */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <Coins className="w-3 h-3 mr-1" />
                          {post.meePoints} MeePoints
                        </Badge>
                      </div>
                    </div>

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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-blue-400"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments.length}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                        <Share2 className="w-4 h-4 mr-1" />
                        แชร์
                      </Button>
                    </div>

                    {/* Comments Section */}
                    {expandedComments.has(post.id) && (
                      <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
                        {/* Existing Comments */}
                        {post.comments.map((comment) => (
                          <div key={comment.id} className={`flex gap-3 ${comment.isMeeBot ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={comment.userAvatar} />
                              <AvatarFallback className={comment.isMeeBot 
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' 
                                : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                              }>
                                {comment.isMeeBot ? '🤖' : comment.username.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 ${comment.isMeeBot ? 'text-right' : ''}`}>
                              <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                                comment.isMeeBot 
                                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-100' 
                                  : 'bg-slate-700/50 text-gray-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {comment.isMeeBot ? (
                                      <span className="flex items-center gap-1">
                                        <Bot className="w-3 h-3" />
                                        MeeBot
                                        {comment.meeBotMood && (
                                          <span>{getMeeBotMoodEmoji(comment.meeBotMood)}</span>
                                        )}
                                      </span>
                                    ) : comment.username}
                                  </span>
                                  <span className="text-xs opacity-70">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment Form */}
                        <div className="flex gap-3 mt-4 pt-3 border-t border-slate-600">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              คุณ
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="แสดงความคิดเห็น..."
                                value={newComments[post.id] || ''}
                                onChange={(e) => setNewComments(prev => ({
                                  ...prev,
                                  [post.id]: e.target.value
                                }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !isCommenting[post.id]) {
                                    handleAddComment(post.id);
                                  }
                                }}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 pr-12"
                                disabled={isCommenting[post.id]}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComments[post.id]?.trim() || isCommenting[post.id]}
                                className="absolute right-1 top-1 h-6 w-6 rounded-full bg-purple-500 hover:bg-purple-600 p-0"
                              >
                                {isCommenting[post.id] ? (
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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