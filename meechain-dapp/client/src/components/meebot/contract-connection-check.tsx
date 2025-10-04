
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Loader2, RefreshCw, Settings, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CONTRACT_ADDRESSES, MEE_TOKEN_ABI } from '@/lib/contract-abi-checker';

interface ContractStatus {
  tokenContract: boolean;
  nftContract: boolean;
  rpcConnection: boolean;
  walletConnection: boolean;
  abiLoaded: boolean;
}

export default function ContractConnectionCheck() {
  const [status, setStatus] = useState<ContractStatus>({
    tokenContract: false,
    nftContract: false,
    rpcConnection: false,
    walletConnection: false,
    abiLoaded: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { toast } = useToast();

  const checkContractConnection = async () => {
    setIsChecking(true);
    
    try {
      // Check secrets/environment
      const secretsResponse = await fetch('/api/secrets/health');
      const secretsData = await secretsResponse.json();
      
      // Check if we have required contract addresses
      const hasTokenContract = !!process.env.VITE_TOKEN_CONTRACT_ADDRESS;
      const hasNFTContract = !!process.env.VITE_NFT_CONTRACT_ADDRESS;
      const hasRPCUrl = !!process.env.VITE_FUSE_RPC_URL;
      
      // Check wallet connection
      let walletConnected = false;
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          walletConnected = accounts.length > 0;
        } catch (error) {
          console.log('Wallet check failed:', error);
        }
      }

      // Check RPC connection
      let rpcConnected = false;
      if (hasRPCUrl) {
        try {
          const rpcUrl = process.env.VITE_FUSE_RPC_URL || 'https://rpc.fuse.io';
          const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1,
            }),
          });
          rpcConnected = response.ok;
        } catch (error) {
          console.log('RPC check failed:', error);
        }
      }

      setStatus({
        tokenContract: hasTokenContract,
        nftContract: hasNFTContract,
        rpcConnection: rpcConnected,
        walletConnection: walletConnected,
        abiLoaded: hasTokenContract && hasNFTContract,
      });

      setLastCheck(new Date());
      
      const allGood = hasTokenContract && hasNFTContract && rpcConnected;
      if (allGood) {
        toast({
          title: "🎉 Contract Connection ดี!",
          description: "Smart contracts พร้อมใช้งานแล้ว",
        });
      } else {
        toast({
          title: "⚠️ ต้องตั้งค่า Contracts",
          description: "ยังขาด environment variables บางตัว",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Connection check failed:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถตรวจสอบการเชื่อมต่อได้",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkContractConnection();
  }, []);

  const getStatusColor = (isOk: boolean) => isOk ? 'text-green-400' : 'text-red-400';
  const getStatusBg = (isOk: boolean) => isOk ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30';

  const StatusItem = ({ title, status, icon }: { title: string; status: boolean; icon: React.ReactNode }) => (
    <div className={`p-3 rounded-lg border ${getStatusBg(status)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {status ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <Badge variant={status ? "default" : "destructive"} className="text-xs">
            {status ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อมต่อ'}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-lg">Smart Contract ABI Status</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkContractConnection}
            disabled={isChecking}
            className="text-xs"
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            ตรวจสอบใหม่
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <StatusItem
          title="MeeToken Contract"
          status={status.tokenContract}
          icon={<Wifi className={`w-4 h-4 ${getStatusColor(status.tokenContract)}`} />}
        />
        
        <StatusItem
          title="MembershipNFT Contract"
          status={status.nftContract}
          icon={<Wifi className={`w-4 h-4 ${getStatusColor(status.nftContract)}`} />}
        />
        
        <StatusItem
          title="Fuse RPC Connection"
          status={status.rpcConnection}
          icon={<Wifi className={`w-4 h-4 ${getStatusColor(status.rpcConnection)}`} />}
        />
        
        <StatusItem
          title="Wallet Connection"
          status={status.walletConnection}
          icon={<Wifi className={`w-4 h-4 ${getStatusColor(status.walletConnection)}`} />}
        />

        {lastCheck && (
          <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-700">
            ตรวจสอบล่าสุด: {lastCheck.toLocaleTimeString('th-TH')}
          </div>
        )}

        {/* Contract Info Display */}
        {status.abiLoaded && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-2">✅ Contract ที่เชื่อมต่อแล้ว</h4>
            <div className="text-sm text-green-300 space-y-1">
              <div>• Token Contract: {CONTRACT_ADDRESSES.MEE_TOKEN.slice(0, 10)}...</div>
              <div>• Fuse Network RPC: Connected</div>
              <div>• Chain ID: {CONTRACT_ADDRESSES.CHAIN_ID}</div>
              <div className="text-xs text-green-400 mt-2">
                🔗 ABI loaded successfully with {MEE_TOKEN_ABI.length} functions
              </div>
            </div>
          </div>
        )}

        {/* Quick Setup Guide */}
        {!status.abiLoaded && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h4 className="font-semibold text-yellow-400 mb-2">🔧 ต้องตั้งค่า Environment Variables</h4>
            <div className="text-sm text-yellow-300 space-y-1">
              <div>• VITE_TOKEN_CONTRACT_ADDRESS</div>
              <div>• VITE_NFT_CONTRACT_ADDRESS</div>
              <div>• VITE_FUSE_RPC_URL</div>
              <div>• VITE_CHAIN_ID=122</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
