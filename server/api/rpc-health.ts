import { Request, Response } from 'express';

interface RPCConfig {
  name: string;
  url: string;
  chainId: string;
  priority: number;
}

interface RPCHealthStatus {
  isHealthy: boolean;
  latency: number;
  blockNumber?: string;
  error?: string;
}

const RPC_CONFIGS: RPCConfig[] = [
  {
    name: 'OP Sepolia',
    url: process.env.RPC_URL || 'https://sepolia.optimism.io',
    chainId: process.env.VITE_CHAIN_ID || '11155420',
    priority: 1
  }
];

async function checkRPCHealth(rpcUrl: string): Promise<RPCHealthStatus> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'RPC Error');
    }

    const latency = Date.now() - startTime;
    
    return {
      isHealthy: true,
      latency,
      blockNumber: data.result
    };
  } catch (error) {
    return {
      isHealthy: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getRPCHealth(req: Request, res: Response) {
  try {
    const healthChecks = await Promise.all(
      RPC_CONFIGS.map(async (rpc) => ({
        ...rpc,
        health: await checkRPCHealth(rpc.url)
      }))
    );

    const healthyRPC = healthChecks.find(rpc => rpc.health.isHealthy);
    const allHealthy = healthChecks.every(rpc => rpc.health.isHealthy);

    res.json({
      success: true,
      data: {
        rpcs: healthChecks,
        activeRPC: healthyRPC?.name || 'None',
        allHealthy,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('RPC health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check RPC health'
    });
  }
}

export async function switchRPC(req: Request, res: Response) {
  try {
    const { targetRPC } = req.body;
    
    const rpc = RPC_CONFIGS.find(r => r.name === targetRPC);
    
    if (!rpc) {
      return res.status(400).json({
        success: false,
        error: 'Invalid RPC name'
      });
    }

    const health = await checkRPCHealth(rpc.url);
    
    if (!health.isHealthy) {
      return res.status(503).json({
        success: false,
        error: `RPC ${rpc.name} is not healthy: ${health.error}`
      });
    }

    res.json({
      success: true,
      data: {
        switched: true,
        activeRPC: rpc.name,
        health
      }
    });
  } catch (error) {
    console.error('RPC switch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to switch RPC'
    });
  }
}
