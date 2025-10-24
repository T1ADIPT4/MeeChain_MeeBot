/**
 * Registry Utility for MeeChain Dashboard
 * Simplified interface for accessing deploy-registry.json in UI components
 */
/**
 * Get contract address by chain and type
 * @param chain - Network name (ethereum, polygon, arbitrum, etc.)
 * @param type - Contract type (badge, quest, fallback)
 * @returns Contract address for the specified chain and type
 */
export declare function getContractAddress(chain: string, type: 'badge' | 'quest' | 'fallback'): string;
//# sourceMappingURL=registry.d.ts.map