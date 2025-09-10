
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
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
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
    <Card className="bg-slate-800/80 border-slate-600/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-300 flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Contract Health Monitor
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="ml-auto h-6 w-6 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MeeBot Status Message */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              🤖
            </div>
            <p className="text-blue-100 text-sm italic leading-relaxed">
              {meeBotMessage}
            </p>
          </div>
        </div>

        {/* Contract Status Grid */}
        {contractsHealth && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
              <StatusIcon isHealthy={contractsHealth.rpcConnected} />
              <div>
                <div className="text-sm text-white font-medium">RPC Connection</div>
                <div className="text-xs text-gray-400">Fuse Network</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
              <StatusIcon isHealthy={contractsHealth.badgeNFT} />
              <div>
                <div className="text-sm text-white font-medium">Badge NFT</div>
                <div className="text-xs text-gray-400">MeeBadgeNFT</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
              <StatusIcon isHealthy={contractsHealth.tokenContract} />
              <div>
                <div className="text-sm text-white font-medium">MEE Token</div>
                <div className="text-xs text-gray-400">ERC-20</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
              <StatusIcon isHealthy={contractsHealth.membershipNFT} />
              <div>
                <div className="text-sm text-white font-medium">Membership</div>
                <div className="text-xs text-gray-400">NFT Contract</div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Status Badge */}
        {contractsHealth && (
          <div className="flex items-center justify-between">
            <Badge 
              variant={contractsHealth.rpcConnected && contractsHealth.badgeNFT ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {contractsHealth.rpcConnected && contractsHealth.badgeNFT ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Ready for Action
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Needs Attention
                </>
              )}
            </Badge>
            
            {lastChecked && (
              <div className="text-xs text-gray-400">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
