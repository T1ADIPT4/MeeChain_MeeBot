
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Smartphone,
  QrCode,
  Monitor,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export type WalletProvider = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
  available: boolean;
  connect: () => Promise<void>;
};

interface WalletProviderSelectorProps {
  onProviderSelect: (provider: WalletProvider) => void;
  isConnecting: boolean;
  selectedProvider: string | null;
}

export function WalletProviderSelector({ 
  onProviderSelect, 
  isConnecting, 
  selectedProvider 
}: WalletProviderSelectorProps) {
  const [showQRCode, setShowQRCode] = useState(false);

  const providers: WalletProvider[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'เชื่อมต่อผ่าน MetaMask Extension',
      icon: <Wallet className="w-5 h-5" />,
      recommended: true,
      available: typeof window !== 'undefined' && !!window.ethereum,
      connect: async () => {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
      }
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'เชื่อมต่อผ่าน QR Code (มือถือ)',
      icon: <QrCode className="w-5 h-5" />,
      recommended: false,
      available: true,
      connect: async () => {
        setShowQRCode(true);
        // WalletConnect implementation would go here
      }
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'เชื่อมต่อผ่าน Coinbase Wallet',
      icon: <Smartphone className="w-5 h-5" />,
      recommended: false,
      available: true,
      connect: async () => {
        // Coinbase Wallet implementation would go here
      }
    },
    {
      id: 'preview',
      name: 'โหมดตัวอย่าง',
      description: 'ทดลองใช้โดยไม่ต้องเชื่อม wallet',
      icon: <Monitor className="w-5 h-5" />,
      recommended: false,
      available: true,
      connect: async () => {
        // Preview mode implementation
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">เลือก Wallet Provider</h3>
        <p className="text-gray-300 text-sm">เลือกวิธีที่คุณต้องการเชื่อมต่อ</p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <Card 
            key={provider.id} 
            className={`cursor-pointer transition-all duration-300 ${
              selectedProvider === provider.id
                ? 'border-cyan-400 bg-cyan-500/10'
                : provider.available
                  ? 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  : 'border-slate-700 bg-slate-800/30 opacity-50'
            }`}
          >
            <CardContent className="p-4">
              <button
                onClick={() => provider.available && onProviderSelect(provider)}
                disabled={!provider.available || isConnecting}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      provider.available 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                        : 'bg-gray-600'
                    }`}>
                      {provider.icon}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{provider.name}</span>
                        {provider.recommended && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            แนะนำ
                          </Badge>
                        )}
                        {!provider.available && (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                            ไม่พร้อมใช้งาน
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{provider.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedProvider === provider.id && (
                      <CheckCircle className="w-5 h-5 text-cyan-400" />
                    )}
                    
                    {isConnecting && selectedProvider === provider.id ? (
                      <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                    ) : (
                      provider.available && (
                        <div className="text-gray-400">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Install MetaMask hint */}
      {!providers.find(p => p.id === 'metamask')?.available && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-yellow-400 mt-0.5">⚠️</div>
            <div>
              <p className="text-yellow-300 text-sm font-medium">ไม่พบ MetaMask</p>
              <p className="text-yellow-200 text-xs mt-1">
                ติดตั้ง MetaMask เพื่อประสบการณ์ที่ดีที่สุด
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                ดาวน์โหลด MetaMask
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WalletConnect QR Code */}
      {showQRCode && (
        <Card className="bg-slate-800/80 border-slate-600">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-white font-medium mb-2">สแกน QR Code</p>
            <p className="text-gray-400 text-sm mb-4">
              เปิดแอป wallet บนมือถือแล้วสแกน QR Code นี้
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQRCode(false)}
              className="border-slate-600 text-gray-300"
            >
              ปิด
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
