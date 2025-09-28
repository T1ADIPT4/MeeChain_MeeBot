
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Eye,
  Trophy,
  Sparkles
} from 'lucide-react';
import { useWalletConnectionFlow } from '@/hooks/use-wallet-connection-flow';
import logoUrl from '@assets/branding/logo.png';

export function WalletConnectionFlow() {
  const {
    state,
    provider,
    address,
    isConnected,
    meeBotReaction,
    questProgress,
    actions
  } = useWalletConnectionFlow();

  const getStateIcon = () => {
    switch (state) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'requesting': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'rejected': 
      case 'error': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'preview-mode': return <Eye className="w-5 h-5 text-purple-400" />;
      default: return <Wallet className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStateColor = () => {
    switch (state) {
      case 'connected': return 'border-green-500/50 bg-green-500/5';
      case 'requesting': return 'border-blue-500/50 bg-blue-500/5';
      case 'rejected': 
      case 'error': return 'border-yellow-500/50 bg-yellow-500/5';
      case 'preview-mode': return 'border-purple-500/50 bg-purple-500/5';
      default: return 'border-slate-600/50 bg-slate-800/50';
    }
  };

  const progressPercentage = (questProgress.step / questProgress.total) * 100;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Quest Progress */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-cyan-300">
                Quest #1: เชื่อมต่อ Wallet
              </span>
            </div>
            <Badge className={`text-xs ${questProgress.completed ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
              {questProgress.completed ? 'สำเร็จ' : `${questProgress.step}/${questProgress.total}`}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Connection Card */}
      <Card className={`${getStateColor()} backdrop-blur-sm transition-all duration-300`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-slate-700/50 rounded-full">
              {getStateIcon()}
            </div>
            <div>
              <span className="text-lg">🔗 Wallet Connection</span>
              <div className="text-sm text-gray-300 mt-1">
                {provider === 'preview' ? 'โหมดตัวอย่าง' : 
                 isConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Connected Wallet Info */}
          {address && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">Wallet Address</p>
                  <p className="text-gray-300 text-xs font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {provider === 'preview' && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      Preview
                    </Badge>
                  )}
                  {provider === 'metamask' && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                      MetaMask
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MeeBot Reaction */}
          {meeBotReaction && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 relative">
              {/* Speech bubble tail */}
              <div className="absolute -top-2 left-8 w-4 h-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l border-t border-blue-500/30 rotate-45"></div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 relative">
                  <img 
                    src={logoUrl} 
                    alt="MeeBot" 
                    className="w-6 h-6 object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 text-lg">
                    {meeBotReaction.emoji}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-blue-100 text-sm italic leading-relaxed mb-3">
                    {meeBotReaction.message}
                  </p>
                  
                  {/* MeeBot Action Buttons */}
                  {meeBotReaction.actions && meeBotReaction.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {meeBotReaction.actions.map((action, index) => (
                        <Button
                          key={index}
                          onClick={action.action}
                          variant={action.variant === 'secondary' ? 'outline' : 'default'}
                          size="sm"
                          className={
                            action.variant === 'secondary' 
                              ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                              : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white'
                          }
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {state === 'requesting' && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-300 text-sm">กำลังรอการยืนยันจาก wallet...</p>
            </div>
          )}

          {/* Connection Status */}
          <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 
                state === 'preview-mode' ? 'bg-purple-400 animate-pulse' :
                'bg-gray-500'
              }`}></div>
              <span className="text-white text-sm">
                {isConnected ? 'เชื่อมต่อแล้ว' : 
                 state === 'preview-mode' ? 'โหมดตัวอย่าง' :
                 'ยังไม่ได้เชื่อมต่อ'}
              </span>
            </div>
            
            {(isConnected || state === 'preview-mode') && (
              <Button
                onClick={actions.disconnect}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                ตัดการเชื่อมต่อ
              </Button>
            )}
          </div>

          {/* Rewards Preview */}
          {questProgress.completed && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium text-sm">รางวัลที่ได้รับ</span>
              </div>
              <div className="space-y-1 text-xs text-yellow-200">
                <div>• 100 MEE Tokens</div>
                <div>• Badge "Wallet Master"</div>
                <div>• ปลดล็อกภารกิจขั้นต่อไป</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
