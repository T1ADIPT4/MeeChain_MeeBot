/**
 * Deploy Registry Loader for MeeChain
 * Utility functions for accessing multi-chain contract deployment registry
 */
import { readFileSync } from 'fs';
import { join } from 'path';
let registryCache = null;
/**
 * Load the deployment registry from file
 * @returns DeployRegistry object
 */
export function loadRegistry() {
    if (registryCache) {
        return registryCache;
    }
    try {
        // Use relative path from src/config to config directory
        const registryPath = join(process.cwd(), 'config/deploy-registry.json');
        const registryData = readFileSync(registryPath, 'utf-8');
        registryCache = JSON.parse(registryData);
        return registryCache;
    }
    catch (error) {
        throw new Error(`Failed to load deploy-registry.json: ${error}`);
    }
}
/**
 * Get network configuration by network name
 * @param network - Network name (e.g., 'ethereum', 'polygon', 'arbitrum')
 * @returns NetworkConfig for the specified network
 */
export function getNetworkConfig(network) {
    const registry = loadRegistry();
    const config = registry.networks[network];
    if (!config) {
        throw new Error(`Network ${network} not found in deploy registry`);
    }
    return config;
}
/**
 * Get badge contract address for a specific network
 * @param network - Network name
 * @returns Badge contract address
 */
export function getBadgeContract(network) {
    return getNetworkConfig(network).badgeContract;
}
/**
 * Get quest contract address for a specific network
 * @param network - Network name
 * @returns Quest contract address
 */
export function getQuestContract(network) {
    return getNetworkConfig(network).questContract;
}
/**
 * Get fallback contract address for a specific network
 * @param network - Network name
 * @returns Fallback contract address
 */
export function getFallbackContract(network) {
    return getNetworkConfig(network).fallbackContract;
}
/**
 * Get all available networks
 * @returns Array of network names
 */
export function getAvailableNetworks() {
    const registry = loadRegistry();
    return Object.keys(registry.networks);
}
/**
 * Get registry version
 * @returns Registry version string
 */
export function getRegistryVersion() {
    const registry = loadRegistry();
    return registry.version;
}
/**
 * Clear the registry cache (useful for testing)
 */
export function clearRegistryCache() {
    registryCache = null;
}
//# sourceMappingURL=registryLoader.js.map