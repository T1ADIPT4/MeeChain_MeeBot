import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface DeployConfig {
  contracts: {
    QuestManager: string;
    MeeToken?: string;
    MeeBadgeNFT?: string;
    FootballNFT?: string;
    MembershipNFT?: string;
    BadgeNFTUpgrade?: string;
  };
  metadata?: {
    version?: string;
    environment?: string;
    fallbackEnabled?: boolean;
    chainId?: string;
    rpcUrl?: string;
  };
  authorizations?: Record<string, boolean>;
}

let cachedConfig: DeployConfig | null = null;

export function getDeployConfig(): DeployConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const registryPath = join(process.cwd(), 'deploy-registry.json');
    
    if (existsSync(registryPath)) {
      const data = readFileSync(registryPath, 'utf-8');
      const parsedConfig = JSON.parse(data);
      cachedConfig = parsedConfig;
      console.log('[Deploy Config] Loaded from deploy-registry.json');
      return parsedConfig;
    }
  } catch (error) {
    console.warn('[Deploy Config] Failed to load deploy-registry.json:', error);
  }

  const envConfig: DeployConfig = {
    contracts: {
      QuestManager: process.env.VITE_QUEST_MANAGER_ADDRESS || '0x8EF99743F8e2c4C0f14C3Fc0E2925250D4F7Ad6e',
      MeeBadgeNFT: process.env.VITE_BADGE_NFT_ADDRESS || '0x1266b73564178415f48C1D9736Dc5bf427503AA2',
    },
    metadata: {
      chainId: process.env.VITE_CHAIN_ID || '11155420',
      rpcUrl: process.env.RPC_URL || 'https://sepolia.optimism.io',
      environment: process.env.NODE_ENV || 'production',
      fallbackEnabled: true,
    },
    authorizations: {
      questManagerCanMintTokens: true,
      questManagerCanMintBadges: true,
      questManagerCanMintFootballNFTs: true,
      badgeUpgradeCanBurnTokens: false,
      badgeUpgradeCanUpgradeBadges: false,
    }
  };

  console.log('[Deploy Config] Using environment variables fallback');
  cachedConfig = envConfig;
  return cachedConfig;
}

export function saveDeployConfig(config: DeployConfig): boolean {
  try {
    const registryPath = join(process.cwd(), 'deploy-registry.json');
    const data = JSON.stringify(config, null, 2);
    require('fs').writeFileSync(registryPath, data);
    cachedConfig = config;
    return true;
  } catch (error) {
    console.error('[Deploy Config] Failed to save:', error);
    return false;
  }
}
