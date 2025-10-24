/**
 * Deploy Registry Loader for MeeChain
 * Utility functions for accessing multi-chain contract deployment registry
 */
import { DeployRegistry, NetworkConfig, SupportedNetwork } from './registryTypes.js';
/**
 * Load the deployment registry from file
 * @returns DeployRegistry object
 */
export declare function loadRegistry(): DeployRegistry;
/**
 * Get network configuration by network name
 * @param network - Network name (e.g., 'ethereum', 'polygon', 'arbitrum')
 * @returns NetworkConfig for the specified network
 */
export declare function getNetworkConfig(network: SupportedNetwork): NetworkConfig;
/**
 * Get badge contract address for a specific network
 * @param network - Network name
 * @returns Badge contract address
 */
export declare function getBadgeContract(network: SupportedNetwork): string;
/**
 * Get quest contract address for a specific network
 * @param network - Network name
 * @returns Quest contract address
 */
export declare function getQuestContract(network: SupportedNetwork): string;
/**
 * Get fallback contract address for a specific network
 * @param network - Network name
 * @returns Fallback contract address
 */
export declare function getFallbackContract(network: SupportedNetwork): string;
/**
 * Get all available networks
 * @returns Array of network names
 */
export declare function getAvailableNetworks(): string[];
/**
 * Get registry version
 * @returns Registry version string
 */
export declare function getRegistryVersion(): string;
/**
 * Clear the registry cache (useful for testing)
 */
export declare function clearRegistryCache(): void;
//# sourceMappingURL=registryLoader.d.ts.map