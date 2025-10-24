#!/usr/bin/env ts-node
/**
 * Update Registry Script for MeeChain
 * Programmatically updates deploy-registry.json with new contract addresses
 */
import type { SupportedNetwork } from '../src/config/registryTypes.js';
interface UpdateOptions {
    network: SupportedNetwork;
    badgeContract?: string;
    questContract?: string;
    fallbackContract?: string;
    chainId?: number;
}
/**
 * Update the deploy registry with new configuration
 */
declare function updateRegistry(options: UpdateOptions): void;
/**
 * Batch update multiple networks
 */
declare function batchUpdateRegistry(updates: UpdateOptions[]): void;
export { updateRegistry, batchUpdateRegistry };
//# sourceMappingURL=updateRegistry.d.ts.map