
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMeeBotStatus } from '@/hooks/use-meebot-status';

export function MeeBotFallbackCard() {
  const { status, message } = useMeeBotStatus();

  const getEmotion = () => {
    switch (status) {
      case 'waiting':
        return '😅';
      case 'success':
        return '🎉';
      case 'error':
        return '🤨';
      default:
        return '🙂';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'waiting':
        return <Wifi className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Bot className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'waiting':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30';
      case 'success':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/30';
      case 'error':
        return 'from-red-500/10 to-pink-500/10 border-red-500/30';
      default:
        return 'from-cyan-500/10 to-purple-500/10 border-cyan-500/30';
    }
  };

  return (
    <Card className={`bg-gradient-to-r ${getStatusColor()} transition-all duration-500`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className={`p-2 rounded-full bg-white/10 ${
            status === 'waiting' ? 'animate-bounce' : 
            status === 'success' ? 'animate-pulse' : ''
          }`}>
            {getStatusIcon()}
          </div>
          <div>
            <span className="text-lg">{getEmotion()} MeeBot บอกว่า:</span>
            <div className="text-xs text-gray-300 mt-1">
              ผู้ช่วยเครือข่าย Web3 ของคุณ
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <p className="text-gray-200 leading-relaxed">
            {message || "พร้อมช่วยคุณจัดการเครือข่ายแล้วครับ! มีอะไรให้ช่วยไหม? 🚀"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
