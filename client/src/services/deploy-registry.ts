
import registryData from "../../../deploy-registry.json";

export interface DeployRegistry {
  network: string;
  timestamp: string;
  deployer: string;
  contracts: {
    MeeToken: string;
    MembershipNFT: string;
    MeeBadgeNFT: string;
    QuestManager: string;
    BadgeNFTUpgrade: string;
    FootballNFT: string;
  };
  metadata: {
    version: string;
    environment: string;
    fallbackEnabled: boolean;
    chainId: string;
    rpcUrl: string;
    explorerUrl: string;
  };
  deploymentStatus: {
    success: boolean;
    failedContracts: string[];
    fallbackRequired: boolean;
    lastAttempt: string | null;
    retryCount: number;
  };
  features: {
    questSystem: boolean;
    nftMinting: boolean;
    tokenRewards: boolean;
    badgeUpgrades: boolean;
    footballPlayers: boolean;
  };
  authorizations: {
    questManagerCanMintTokens: boolean;
    questManagerCanMintBadges: boolean;
    questManagerCanMintFootballNFTs: boolean;
    badgeUpgradeCanBurnTokens: boolean;
    badgeUpgradeCanUpgradeBadges: boolean;
  };
  fallbackConfig: {
    enabled: boolean;
    network: string;
    rpcUrl: string;
    chainId: string;
    explorerUrl: string;
  };
}

const registry = registryData as DeployRegistry;

/**
 * Get contract address by name
 */
export const getContractAddress = (contractName: keyof DeployRegistry["contracts"]): string => {
  const address = registry.contracts[contractName];
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    console.warn(`⚠️ Contract ${contractName} has invalid address: ${address}`);
    return "0x0000000000000000000000000000000000000000";
  }
  return address;
};

/**
 * Get current network name
 */
export const getNetwork = (): string => {
  return registry.network;
};

/**
 * Check if fallback is enabled
 */
export const isFallbackEnabled = (): boolean => {
  return registry.metadata.fallbackEnabled;
};

/**
 * Check if fallback is required
 */
export const isFallbackRequired = (): boolean => {
  return registry.deploymentStatus.fallbackRequired;
};

/**
 * Get chain ID
 */
export const getChainId = (): string => {
  return registry.metadata.chainId;
};

/**
 * Get RPC URL
 */
export const getRpcUrl = (): string => {
  return registry.metadata.rpcUrl;
};

/**
 * Get explorer URL
 */
export const getExplorerUrl = (): string => {
  return registry.metadata.explorerUrl;
};

/**
 * Check if deployment was successful
 */
export const isDeploymentSuccessful = (): boolean => {
  return registry.deploymentStatus.success;
};

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = (feature: keyof DeployRegistry["features"]): boolean => {
  return registry.features[feature];
};

/**
 * Check authorization status
 */
export const isAuthorized = (auth: keyof DeployRegistry["authorizations"]): boolean => {
  return registry.authorizations[auth];
};

/**
 * Get deployment environment
 */
export const getEnvironment = (): string => {
  return registry.metadata.environment;
};

/**
 * Get version
 */
export const getVersion = (): string => {
  return registry.metadata.version;
};

/**
 * Get failed contracts list
 */
export const getFailedContracts = (): string[] => {
  return registry.deploymentStatus.failedContracts;
};

/**
 * Get fallback config
 */
export const getFallbackConfig = () => {
  return registry.fallbackConfig;
};

/**
 * Get full registry data
 */
export const getRegistry = (): DeployRegistry => {
  return registry;
};

/**
 * Validate deployment readiness
 */
export const validateDeployment = () => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check deployment success
  if (!isDeploymentSuccessful()) {
    errors.push("Deployment was not successful");
  }

  // Check contract addresses
  Object.entries(registry.contracts).forEach(([name, address]) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      errors.push(`Contract ${name} has invalid address`);
    }
  });

  // Check authorizations
  if (!isAuthorized("questManagerCanMintTokens")) {
    warnings.push("QuestManager cannot mint tokens");
  }
  if (!isAuthorized("questManagerCanMintBadges")) {
    warnings.push("QuestManager cannot mint badges");
  }
  if (!isAuthorized("questManagerCanMintFootballNFTs")) {
    warnings.push("QuestManager cannot mint football NFTs");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    canProceed: errors.length === 0
  };
};

/**
 * Dynamic chain switching support
 */
export const switchToNetwork = async (networkName: string): Promise<boolean> => {
  try {
    // This would typically fetch a different registry or update environment variables
    console.log(`🔄 Switching to network: ${networkName}`);
    
    // In a real implementation, you might:
    // 1. Fetch new registry from API: /api/deploy-registry?network=${networkName}
    // 2. Update environment variables
    // 3. Reload contract instances
    
    return true;
  } catch (error) {
    console.error("Failed to switch network:", error);
    return false;
  }
};

export default {
  getContractAddress,
  getNetwork,
  isFallbackEnabled,
  isFallbackRequired,
  getChainId,
  getRpcUrl,
  getExplorerUrl,
  isDeploymentSuccessful,
  isFeatureEnabled,
  isAuthorized,
  getEnvironment,
  getVersion,
  getFailedContracts,
  getFallbackConfig,
  getRegistry,
  validateDeployment,
  switchToNetwork
};
