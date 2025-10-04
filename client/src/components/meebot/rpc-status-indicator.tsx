import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertCircle, CheckCircle2, WifiOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface RPCHealth {
  name: string;
  url: string;
  chainId: string;
  priority: number;
  health: {
    isHealthy: boolean;
    latency: number;
    blockNumber?: string;
    error?: string;
  };
}

interface RPCHealthData {
  rpcs: RPCHealth[];
  activeRPC: string;
  allHealthy: boolean;
  timestamp: string;
}

export function RPCStatusIndicator() {
  const { data, isLoading } = useQuery<{ success: boolean; data: RPCHealthData }>({
    queryKey: ['/api/rpc/health'],
    refetchInterval: 30000,
  });

  if (isLoading || !data?.data) {
    return (
      <Badge variant="outline" className="text-xs bg-slate-700/30 border-slate-600/50">
        <Activity className="w-3 h-3 mr-1 animate-pulse" />
        Checking...
      </Badge>
    );
  }

  const { activeRPC, allHealthy, rpcs } = data.data;
  const activeRPCData = rpcs.find(rpc => rpc.name === activeRPC);

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`text-xs ${
          allHealthy 
            ? 'bg-green-500/10 text-green-400 border-green-500/30' 
            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
        }`}
      >
        {allHealthy ? (
          <CheckCircle2 className="w-3 h-3 mr-1" />
        ) : (
          <AlertCircle className="w-3 h-3 mr-1" />
        )}
        {activeRPC}
        {activeRPCData && ` (${activeRPCData.health.latency}ms)`}
      </Badge>
    </div>
  );
}

export function RPCHealthMonitor() {
  const [isSwitching, setIsSwitching] = useState(false);
  const { data, isLoading, refetch } = useQuery<{ success: boolean; data: RPCHealthData }>({
    queryKey: ['/api/rpc/health'],
    refetchInterval: 15000,
  });

  const handleManualSwitch = async (targetRPC: string) => {
    setIsSwitching(true);
    try {
      const response = await fetch('/api/rpc/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRPC })
      });
      
      if (response.ok) {
        await refetch();
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch RPC:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  if (isLoading || !data?.data) {
    return (
      <Card className="bg-slate-800/80 border-slate-600/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-slate-400">
            <Activity className="w-4 h-4 mr-2 animate-spin" />
            Loading RPC status...
          </div>
        </CardContent>
      </Card>
    );
  }

  const { rpcs, activeRPC, allHealthy } = data.data;

  return (
    <Card className="bg-slate-800/80 border-slate-600/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            RPC Network Status
          </h3>
          <button 
            onClick={() => refetch()}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            data-testid="button-refresh-rpc"
          >
            Refresh
          </button>
        </div>
        
        {!allHealthy && (
          <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Some RPC endpoints are offline. Try switching to a healthy endpoint.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {rpcs.map((rpc) => (
            <div
              key={rpc.name}
              className={`p-3 rounded-lg border transition-all ${
                rpc.name === activeRPC
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-slate-700/30 border-slate-600/30'
              }`}
              data-testid={`rpc-status-${rpc.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  {rpc.health.isHealthy ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      {rpc.name}
                      {rpc.name === activeRPC && (
                        <Badge className="text-xs bg-blue-500 text-white">
                          Active
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-slate-400">
                      Chain ID: {rpc.chainId}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {rpc.health.isHealthy ? (
                      <>
                        <p className="text-xs font-medium text-green-400">
                          {rpc.health.latency}ms
                        </p>
                        <p className="text-xs text-slate-500">
                          Block: {rpc.health.blockNumber ? 
                            parseInt(rpc.health.blockNumber, 16) : 'N/A'}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-red-400">
                        {rpc.health.error || 'Offline'}
                      </p>
                    )}
                  </div>
                  
                  {rpc.name !== activeRPC && rpc.health.isHealthy && (
                    <button
                      onClick={() => handleManualSwitch(rpc.name)}
                      disabled={isSwitching}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded transition-colors"
                      data-testid={`button-switch-to-${rpc.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {isSwitching ? 'Switching...' : 'Switch'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
