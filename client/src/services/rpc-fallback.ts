import { getContractAddress } from './deploy-registry';

export interface RPCConfig {
  name: string;
  url: string;
  chainId: string;
  priority: number;
}

export interface RPCHealthStatus {
  isHealthy: boolean;
  latency: number;
  error?: string;
}

class RPCFallbackService {
  private rpcs: RPCConfig[] = [
    {
      name: 'OP Sepolia',
      url: import.meta.env.VITE_RPC_URL || 'https://sepolia.optimism.io',
      chainId: import.meta.env.VITE_CHAIN_ID || '11155420',
      priority: 1
    }
  ];

  private currentRPC: RPCConfig = this.rpcs[0];
  private healthCheckInterval: NodeJS.Timeout | null = null;

  async checkHealth(rpcUrl: string): Promise<RPCHealthStatus> {
    const startTime = Date.now();
    
    try {
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
        signal: AbortSignal.timeout(5000)
      });

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
        latency
      };
    } catch (error) {
      return {
        isHealthy: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async findHealthyRPC(): Promise<RPCConfig | null> {
    const sortedRPCs = [...this.rpcs].sort((a, b) => a.priority - b.priority);
    
    for (const rpc of sortedRPCs) {
      const health = await this.checkHealth(rpc.url);
      
      if (health.isHealthy) {
        console.log(`✅ RPC healthy: ${rpc.name} (${health.latency}ms)`);
        return rpc;
      } else {
        console.warn(`❌ RPC unhealthy: ${rpc.name} - ${health.error}`);
      }
    }
    
    return null;
  }

  async switchRPC(): Promise<boolean> {
    const healthyRPC = await this.findHealthyRPC();
    
    if (healthyRPC) {
      this.currentRPC = healthyRPC;
      console.log(`🔄 Switched to RPC: ${healthyRPC.name}`);
      return true;
    }
    
    console.error('🚨 No healthy RPC found!');
    return false;
  }

  getCurrentRPC(): RPCConfig {
    return this.currentRPC;
  }

  async getAllRPCHealth(): Promise<Record<string, RPCHealthStatus>> {
    const healthMap: Record<string, RPCHealthStatus> = {};
    
    await Promise.all(
      this.rpcs.map(async (rpc) => {
        healthMap[rpc.name] = await this.checkHealth(rpc.url);
      })
    );
    
    return healthMap;
  }

  private failureCount: number = 0;
  private maxFailures: number = 3;
  private baseInterval: number = 30000;

  private getNextInterval(): number {
    const backoff = Math.min(this.baseInterval * Math.pow(2, this.failureCount), 300000);
    const jitter = Math.random() * 1000;
    return backoff + jitter;
  }

  startHealthMonitoring(intervalMs: number = 30000) {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.baseInterval = intervalMs;
    
    const monitorHealth = async () => {
      const currentHealth = await this.checkHealth(this.currentRPC.url);
      
      if (!currentHealth.isHealthy) {
        this.failureCount++;
        console.warn(`⚠️ Current RPC ${this.currentRPC.name} is unhealthy (failure ${this.failureCount}/${this.maxFailures})`);
        
        if (this.failureCount >= this.maxFailures) {
          console.warn(`🔄 Attempting RPC fallback after ${this.failureCount} failures...`);
          const switched = await this.switchRPC();
          if (switched) {
            this.failureCount = 0;
            window.dispatchEvent(new CustomEvent('rpc-switched', { 
              detail: { rpc: this.currentRPC } 
            }));
          }
        }
        
        const nextInterval = this.getNextInterval();
        if (this.healthCheckInterval) {
          clearInterval(this.healthCheckInterval);
        }
        this.healthCheckInterval = setTimeout(monitorHealth, nextInterval);
      } else {
        console.log(`✅ RPC Health Check: ${this.currentRPC.name} OK (${currentHealth.latency}ms)`);
        this.failureCount = 0;
        
        if (this.healthCheckInterval) {
          clearInterval(this.healthCheckInterval);
        }
        this.healthCheckInterval = setTimeout(monitorHealth, this.baseInterval);
      }
    };
    
    monitorHealth();
  }

  stopHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  async executeWithFallback<T>(
    fn: (rpcUrl: string) => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn(this.currentRPC.url);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`❌ RPC call failed on ${this.currentRPC.name}:`, lastError.message);
        
        if (i < maxRetries - 1) {
          const switched = await this.switchRPC();
          if (!switched) break;
        }
      }
    }
    
    throw lastError || new Error('All RPC attempts failed');
  }
}

export const rpcFallbackService = new RPCFallbackService();
export default rpcFallbackService;
