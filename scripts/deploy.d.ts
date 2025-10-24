#!/usr/bin/env ts-node
/**
 * Deploy Script for MeeChain
 * Deploys smart contracts and records their addresses in deploy-registry.json
 */
import type { SupportedNetwork } from '../src/config/registryTypes.js';
interface DeployOptions {
    contractType: 'Badge' | 'Quest' | 'Fallback';
    network: SupportedNetwork;
    address?: string;
    simulate?: boolean;
}
/**
 * Simulate contract deployment
 * In real deployment, this would interact with blockchain
 */
declare function deployContract(contractType: string, network: string): Promise<string>;
/**
 * Update the deploy registry with new contract address
 */
declare function updateRegistryFile(network: SupportedNetwork, contractType: 'Badge' | 'Quest' | 'Fallback', address: string): void;
/**
 * Main deploy function
 */
declare function deploy(options: DeployOptions): Promise<void>;
export { deploy, deployContract, updateRegistryFile };
//# sourceMappingURL=deploy.d.ts.map