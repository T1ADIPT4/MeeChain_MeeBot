import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Sparkles,
  ShoppingCart,
  Trophy,
  Bot,
  Wallet,
  Eye,
  Share2,
  Target
} from 'lucide-react';
import { CollectiblesViewer } from '@/components/nft/collectibles-viewer';
import { NFTMarketplace } from '@/components/nft/marketplace';
import { NFTQuestSystem } from '@/components/nft/quest-system';
import { RPGMarketplace } from '@/components/nft/rpg-marketplace';
import { CollectionQuestSystem } from '@/components/nft/collection-quest-system';
import { BadgeMinter } from '@/components/nft/badge-minter';
import { QuestTracker } from '@/components/nft/quest-tracker';
import { useToast } from '@/hooks/use-toast';

export default function NFTCollectionPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('collection');
  const { toast } = useToast();

  // Mock user stats
  const userStats = {
    totalNFTs: 4,
    rareCount: 1,
    epicCount: 1,
    legendaryCount: 1,
    mythicCount: 0,
    totalValue: 325 // in MEE tokens
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <nav className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white bg-slate-800/50 backdrop-blur-sm border border-slate-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">ย้อนกลับ</span>
        </Button>

        <h1 className="text-xl font-bold text-blue-300">NFT Collection & Marketplace</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => {
              toast({
                title: "🤖 MeeBot",
                description: "ฟีเจอร์นี้จะมาเร็ว ๆ นี้ครับ! ติดตามได้เลย 🚀",
              });
            }}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </nav>

      <div className="px-6 pb-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{userStats.totalNFTs}</div>
              <div className="text-sm text-slate-400">Total NFTs</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{userStats.legendaryCount}</div>
              <div className="text-sm text-slate-400">Legendary</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-2">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{userStats.totalValue}</div>
              <div className="text-sm text-slate-400">MEE Value</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-2">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-slate-400">Market Items</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-600/50">
            <TabsTrigger 
              value="collection" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              My Collection
            </TabsTrigger>
            <TabsTrigger 
              value="collection-quests" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Collection Quests
            </TabsTrigger>
            <TabsTrigger 
              value="quests" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
            >
              <Target className="w-4 h-4 mr-2" />
              NFT Quests
            </TabsTrigger>
            <TabsTrigger 
              value="tracker" 
              className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
            >
              <Target className="w-4 h-4 mr-2" />
              Tracker
            </TabsTrigger>
            <TabsTrigger 
              value="minter" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Minter
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            <CollectiblesViewer userAddress="0x123...abc" />
          </TabsContent>

          {/* Collection Quest System Tab */}
          <TabsContent value="collection-quests" className="space-y-6">
            <CollectionQuestSystem />
          </TabsContent>

          {/* Quest System Tab */}
          <TabsContent value="quests" className="space-y-6">
            <NFTQuestSystem />
          </TabsContent>

          {/* Quest Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <QuestTracker />
          </TabsContent>

          {/* Badge Minter Tab */}
          <TabsContent value="minter" className="space-y-6">
            <BadgeMinter />
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <NFTMarketplace />
          </TabsContent>
        </Tabs>

        {/* MeeBot Welcome Banner */}
        <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-300/30 overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">🎨 ยินดีต้อนรับสู่ NFT Universe!</h3>
                  <p className="text-gray-300 leading-relaxed">
                    ยินดีต้อนรับสู่ NFT Universe แบบ RPG! สะสม Badge พร้อมพลังพิเศษ, อัปเกรดได้แบบเกม, และทำ Collection Quest เพื่อปลดล็อก Badge ตำนาน! 
                    MeeBot พร้อมเป็น mentor แนะนำทุกขั้นตอนครับ! 🎮⚡👑
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="border-cyan-500 text-cyan-300 hover:bg-cyan-800/50"
                  onClick={() => {
                    toast({
                      title: "🤖 MeeBot Guide",
                      description: "มาเรียนรู้วิธีใช้ NFT Collection กันครับ! 📚✨",
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Tutorial
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500 text-purple-300 hover:bg-purple-800/50"
                  onClick={() => {
                    toast({
                      title: "🔗 Share Collection",
                      description: "แชร์ collection สุดเท่ของคุณให้เพื่อน ๆ ดูกันเถอะ!",
                    });
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-600/50 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-200 p-2"
            onClick={() => navigate('/dashboard')}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-blue-400 hover:text-cyan-200 p-2 relative"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xs font-semibold">NFTs</span>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-200 p-2"
            onClick={() => navigate('/meebot')}
          >
            <Bot className="w-5 h-5" />
            <span className="text-xs">MeeBot</span>
          </Button>
        </div>
      </div>
    </div>
  );
}