#!/usr/bin/env ts-node
/**
 * Validate Registry Script for MeeChain
 * Validates the integrity and correctness of deploy-registry.json
 */
import type { NetworkConfig } from '../src/config/registryTypes.js';
interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    networkCount: number;
    networks: string[];
}
/**
 * Validate contract address format
 */
declare function isValidAddress(address: string): boolean;
/**
 * Validate network configuration
 */
declare function validateNetworkConfig(network: string, config: NetworkConfig, errors: string[], warnings: string[]): void;
/**
 * Validate the entire registry
 */
declare function validateRegistry(): ValidationResult;
/**
 * Validate with specific checks
 */
declare function validateWithOptions(options: {
    strict?: boolean;
    verbose?: boolean;
}): ValidationResult;
export { validateRegistry, validateWithOptions, isValidAddress, validateNetworkConfig };
//# sourceMappingURL=validateRegistry.d.ts.map