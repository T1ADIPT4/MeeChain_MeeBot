/**
 * Badge Minter for MeeChain
 * Handles badge minting with fallback mechanism for resilience
 */
import type { SupportedNetwork } from '../config/registryTypes.js';
export interface BadgeTransaction {
    txHash: string;
    userId: string;
    questId: string;
    badgeId: string;
    timestamp: Date;
    chain: 'primary' | 'fallback';
    contractAddress?: string;
    network?: SupportedNetwork;
}
/**
 * Mint a badge on the primary chain
 * @param userId - User ID receiving the badge
 * @param questId - Quest ID that was completed
 * @param network - Optional network to use (defaults to primaryNetwork)
 * @returns Badge transaction details
 * @throws Error if minting fails
 */
export declare function mintBadge(userId: string, questId: string, network?: SupportedNetwork): Promise<BadgeTransaction>;
/**
 * Mint a badge on the fallback chain
 * @param userId - User ID receiving the badge
 * @param questId - Quest ID that was completed
 * @param network - Optional network to use (defaults to fallbackNetwork)
 * @returns Badge transaction details
 * @throws Error if fallback minting also fails
 */
export declare function fallbackMintBadge(userId: string, questId: string, network?: SupportedNetwork): Promise<BadgeTransaction>;
/**
 * Verify if a badge exists for a user
 * @param userId - User ID to check
 * @param questId - Quest ID to check
 * @returns true if badge exists, false otherwise
 */
export declare function verifyBadgeExists(userId: string, questId: string): Promise<boolean>;
/**
 * Set primary chain minting status (for testing)
 * @param success - Whether primary minting should succeed
 */
export declare function setPrimaryMintingStatus(success: boolean): void;
/**
 * Set fallback chain minting status (for testing)
 * @param success - Whether fallback minting should succeed
 */
export declare function setFallbackMintingStatus(success: boolean): void;
/**
 * Set primary network for minting
 * @param network - Network to use for primary minting
 */
export declare function setPrimaryNetwork(network: SupportedNetwork): void;
/**
 * Set fallback network for minting
 * @param network - Network to use for fallback minting
 */
export declare function setFallbackNetwork(network: SupportedNetwork): void;
/**
 * Get current primary network
 * @returns Current primary network
 */
export declare function getPrimaryNetwork(): SupportedNetwork;
/**
 * Get current fallback network
 * @returns Current fallback network
 */
export declare function getFallbackNetwork(): SupportedNetwork;
//# sourceMappingURL=badgeMinter.d.ts.map