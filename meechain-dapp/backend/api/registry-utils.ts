
import fs from "fs";
import path from "path";

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

export function loadDeployRegistry(): DeployRegistry | null {
  try {
    const registryPath = path.join(process.cwd(), "deploy-registry.json");
    
    if (!fs.existsSync(registryPath)) {
      console.warn("⚠️ Deploy registry not found");
      return null;
    }

    const registryData = fs.readFileSync(registryPath, "utf-8");
    const registry = JSON.parse(registryData) as DeployRegistry;
    
    return registry;
  } catch (error) {
    console.error("❌ Failed to load deploy registry:", error);
    return null;
  }
}

export function validateDeployRegistry(registry: DeployRegistry): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if deployment was successful
  if (!registry.deploymentStatus.success) {
    errors.push("Deployment was not successful");
  }

  // Check if all contracts have addresses
  const contracts = registry.contracts;
  Object.entries(contracts).forEach(([name, address]) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      errors.push(`Contract ${name} has invalid address: ${address}`);
    }
  });

  // Check authorization status
  const auths = registry.authorizations;
  if (!auths.questManagerCanMintTokens) {
    warnings.push("QuestManager cannot mint tokens - quest rewards may fail");
  }
  if (!auths.questManagerCanMintBadges) {
    warnings.push("QuestManager cannot mint badges - badge rewards may fail");
  }
  if (!auths.questManagerCanMintFootballNFTs) {
    warnings.push("QuestManager cannot mint football NFTs - player rewards may fail");
  }

  // Check if fallback is required
  if (registry.deploymentStatus.fallbackRequired && !registry.fallbackConfig.enabled) {
    errors.push("Fallback is required but not enabled");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function updateDeployRegistry(updates: Partial<DeployRegistry>): boolean {
  try {
    const registry = loadDeployRegistry();
    if (!registry) {
      console.error("❌ Cannot update registry: registry not found");
      return false;
    }

    const updatedRegistry = { ...registry, ...updates };
    
    const registryPath = path.join(process.cwd(), "deploy-registry.json");
    fs.writeFileSync(registryPath, JSON.stringify(updatedRegistry, null, 2));
    
    console.log("✅ Deploy registry updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to update deploy registry:", error);
    return false;
  }
}

export function getContractAddress(contractName: keyof DeployRegistry["contracts"]): string | null {
  const registry = loadDeployRegistry();
  if (!registry) return null;
  
  return registry.contracts[contractName] || null;
}

export function isFeatureEnabled(featureName: keyof DeployRegistry["features"]): boolean {
  const registry = loadDeployRegistry();
  if (!registry) return false;
  
  return registry.features[featureName] || false;
}
