
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Wifi, AlertTriangle } from 'lucide-react';
import { useSmartContracts } from '@/hooks/use-smart-contracts';

interface ContractHealthMonitorProps {
  compact?: boolean;
}

export default function ContractHealthMonitor({ compact = false }: ContractHealthMonitorProps) {
  const { contractsHealth, checkContractsHealth, isLoading, meeBotMessage } = useSmartContracts();
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleRefresh = async () => {
    await checkContractsHealth();
    setLastChecked(new Date());
  };

  useEffect(() => {
    if (contractsHealth) {
      setLastChecked(new Date());
    }
  }, [contractsHealth]);

  const StatusIcon = ({ isHealthy }: { isHealthy: boolean }) => 
    isHealthy ? (
      <CheckCircle className="w-6 h-6 text-green-400 drop-shadow-lg" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500 drop-shadow-lg" />
    );

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-600/30">
        <Wifi className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-gray-300">Contracts:</span>
        {contractsHealth ? (
          <div className="flex gap-1">
            <StatusIcon isHealthy={contractsHealth.rpcConnected} />
            <StatusIcon isHealthy={contractsHealth.badgeNFT} />
            <StatusIcon isHealthy={contractsHealth.tokenContract} />
          </div>
        ) : (
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Wifi className="w-6 h-6 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Contract Health Monitor
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="ml-auto h-8 w-8 p-0 hover:bg-slate-700 text-cyan-400"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* MeeBot Status Message */}
        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-2 border-cyan-500/40 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
              🤖
            </div>
            <p className="text-white text-base font-medium leading-relaxed">
              {meeBotMessage}
            </p>
          </div>
        </div>

        {/* Contract Status Grid */}
        {contractsHealth && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-700/60 hover:bg-slate-700/80 rounded-xl border-2 border-slate-600/50 transition-all shadow-md">
              <StatusIcon isHealthy={contractsHealth.rpcConnected} />
              <div>
                <div className="text-base text-white font-bold">RPC Connection</div>
                <div className="text-sm text-slate-300 font-medium">Fuse Network</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-700/60 hover:bg-slate-700/80 rounded-xl border-2 border-slate-600/50 transition-all shadow-md">
              <StatusIcon isHealthy={contractsHealth.badgeNFT} />
              <div>
                <div className="text-base text-white font-bold">Badge NFT</div>
                <div className="text-sm text-slate-300 font-medium">MeeBadgeNFT</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-700/60 hover:bg-slate-700/80 rounded-xl border-2 border-slate-600/50 transition-all shadow-md">
              <StatusIcon isHealthy={contractsHealth.tokenContract} />
              <div>
                <div className="text-base text-white font-bold">MEE Token</div>
                <div className="text-sm text-slate-300 font-medium">ERC-20</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-700/60 hover:bg-slate-700/80 rounded-xl border-2 border-slate-600/50 transition-all shadow-md">
              <StatusIcon isHealthy={contractsHealth.membershipNFT} />
              <div>
                <div className="text-base text-white font-bold">Membership</div>
                <div className="text-sm text-slate-300 font-medium">NFT Contract</div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Status Badge */}
        {contractsHealth && (
          <div className="flex items-center justify-between p-3 bg-slate-700/40 rounded-lg">
            <Badge 
              variant={contractsHealth.rpcConnected && contractsHealth.badgeNFT ? "default" : "destructive"}
              className="flex items-center gap-2 text-base font-bold px-4 py-2"
            >
              {contractsHealth.rpcConnected && contractsHealth.badgeNFT ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Ready for Action
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Needs Attention
                </>
              )}
            </Badge>
            
            {lastChecked && (
              <div className="text-sm text-slate-200 font-medium">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
