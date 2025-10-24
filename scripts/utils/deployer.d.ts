/**
 * Contract Deployment Utilities for MeeChain
 * Simulates contract deployment across multiple blockchain networks
 */
import type { SupportedNetwork } from '../../src/config/registryTypes.js';
export interface DeploymentResult {
    address: string;
    network: SupportedNetwork;
    contractType: string;
    txHash: string;
    timestamp: Date;
}
/**
 * Deploy a contract to a specific blockchain network
 * @param contractType - Type of contract to deploy (Badge, Quest, Fallback)
 * @param network - Target blockchain network
 * @returns Deployment result with contract address
 */
export declare function deployContract(contractType: string, network: SupportedNetwork): Promise<DeploymentResult>;
/**
 * Verify a deployed contract
 * @param address - Contract address to verify
 * @param network - Network where the contract is deployed
 * @returns true if contract is valid, false otherwise
 */
export declare function verifyContract(address: string, network: SupportedNetwork): Promise<boolean>;
/**
 * Deploy all contracts for a specific network
 * @param network - Target blockchain network
 * @returns Object with all deployed contract addresses
 */
export declare function deployAllContracts(network: SupportedNetwork): Promise<{
    badgeContract: string;
    questContract: string;
    fallbackContract: string;
}>;
//# sourceMappingURL=deployer.d.ts.map