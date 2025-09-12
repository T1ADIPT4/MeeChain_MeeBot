
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/hooks/use-web3';
import { useMeebot } from '@/hooks/use-meebot';
import { WalletConnector } from '@/components/web3/wallet-connector';
import { MeeBotChat } from '@/components/meebot/meebot-chat';
import { TokenBalance } from '@/components/web3/token-balance';
import { Link } from 'wouter';
import { 
  Coins, 
  Trophy, 
  Sparkles, 
  Users,
  ArrowRight 
} from 'lucide-react';

export default function Home() {
  const { isConnected, address } = useWeb3();
  const { isActive, messages } = useMeebot();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-cyan-500/20 to-blue-600/20" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-float mb-8">
            <img 
              src="/assets/mascot.png" 
              alt="MeeChain Mascot" 
              className="w-24 h-24 mx-auto mb-6"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 meechain-gradient bg-clip-text text-transparent">
            MeeChain
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Web3 wallet ที่ออกแบบมาสำหรับผู้ใช้ไทย พร้อมระบบ NFT, Gaming และ DeFi ที่ง่ายต่อการใช้งาน
          </p>
          
          {!isConnected ? (
            <WalletConnector />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                เชื่อมต่อแล้ว: {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
              <Link href="/dashboard">
                <Button size="lg" className="meechain-gradient text-white">
                  เข้าสู่แดชบอร์ด <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ฟีเจอร์หลักของ MeeChain
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Coins className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <CardTitle>MeeToken</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  เหรียญ MEE สำหรับการทำภารกิจและการอัปเกรด NFT
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <CardTitle>NFT Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  สะสม Badge NFT จากการทำภารกิจและอัปเกรดระดับความหายาก
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
                <CardTitle>MeeBot AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  AI Assistant ที่คอยช่วยเหลือและแนะนำการใช้งาน
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  เข้าร่วมชุมชน MeeChain และรับรางวัลจากกิจกรรมต่างๆ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MeeBot Section */}
      {isConnected && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 animate-glow" />
                  MeeBot Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MeeBotChat />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Token Balance Section */}
      {isConnected && (
        <section className="py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <TokenBalance />
          </div>
        </section>
      )}
    </div>
  );
}
