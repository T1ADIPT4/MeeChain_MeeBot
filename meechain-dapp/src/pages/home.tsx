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
import { BadgeMinter } from '../components/badge-minter';
import { QuestTracker } from '../components/quest-tracker';

export default function Home() {
  const { isConnected, address, account, balance, connectWallet } = useWeb3();
  const { isActive, messages } = useMeebot();
  const [activeTab, setActiveTab] = useState('dashboard');

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

      {/* Tabbed Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'quests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎮 Quests
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'badges'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔨 Badge Minter
            </button>
            <button
              onClick={() => setActiveTab('meebot')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'meebot'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🤖 MeeBot
            </button>
          </nav>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Wallet Status */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  💼 Wallet Status
                </h3>
                {account ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Connected to:</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Network:</p>
                      <p className="text-green-600 font-medium">Fuse Network</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">No wallet connected</p>
                    <button
                      onClick={connectWallet}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </div>

              {/* Balance */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  💰 Balance
                </h3>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {balance.formatted} {balance.symbol}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Available balance
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  ⚡ Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
                    📤 Send Tokens
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                    📥 Receive Tokens
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">
                    🔄 Swap Tokens
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quests' && (
            <QuestTracker />
          )}

          {activeTab === 'badges' && (
            <BadgeMinter onMinted={(tokenId) => {
              alert(`Badge สร้างสำเร็จ! Token ID: ${tokenId}`);
            }} />
          )}

          {activeTab === 'meebot' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🤖 MeeBot Assistant
              </h3>
              <div className="mb-4">
                <p className="text-gray-600">
                  Hello! I'm MeeBot, your Web3 assistant. How can I help you today?
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>💡 Tip:</strong> You can ask me about wallet connections, 
                    transaction history, or how to use MeeChain features!
                  </p>
                </div>
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-md p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                <MeeBotChat />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MeeBot Section (Remains as is, but is now part of tabs) */}
      {/* Token Balance Section (Remains as is, but is now part of tabs) */}
    </div>
  );
}