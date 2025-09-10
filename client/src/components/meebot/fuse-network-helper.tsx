import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WalletConnectHelper from './wallet-connect-helper';

interface FuseNetworkHelperProps {
  isWalletConnect?: boolean;
}

export default function FuseNetworkHelper({ isWalletConnect = false }: FuseNetworkHelperProps) {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const copyRPCUrl = () => {
    navigator.clipboard.writeText('https://rpc.fuse.io');
    toast({
      title: "คัดลอกแล้ว!",
      description: "RPC URL ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
  };

  const handleNetworkChanged = () => {
    setIsConnected(true);
    toast({
      title: "เชื่อมต่อ Fuse Network สำเร็จ! 🎉",
      description: "ตอนนี้คุณพร้อมใช้งาน Fuse Network แล้ว",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Fuse Network</h3>
              <p className="text-sm text-green-300">
                Fast, low-cost transactions for DeFi and payments
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {isConnected ? 'Connected' : 'Available'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* WalletConnect Helper */}
      {!isConnected && (
        <WalletConnectHelper
          targetChainId="0x7A" // Fuse Network Chain ID (122)
          onNetworkChanged={handleNetworkChanged}
          isWalletConnect={isWalletConnect}
        />
      )}

      {/* Connection Status */}
      {isConnected && (
        <Card className="bg-slate-800/80 border-green-400/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Connected to Fuse Network</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Details */}
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-white mb-3">Network Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Chain ID:</span>
              <span className="text-white">122</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Currency:</span>
              <span className="text-white">FUSE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">RPC URL:</span>
              <button
                onClick={copyRPCUrl}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Explorer:</span>
              <a
                href="https://explorer.fuse.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-white mb-3">Why Fuse Network?</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Ultra-low transaction fees (~$0.001)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Fast confirmation times (5 seconds)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              EVM compatible ecosystem
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Perfect for DeFi and micropayments
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}