/**
 * Mock Data Utilities for Dashboard
 * Provides sample data for badges and fallback logs
 * In production, this would fetch from a database or blockchain
 */
import type { SupportedNetwork } from '../src/config/registryTypes.js';
export interface UserBadge {
    badgeId: string;
    questId: string;
    userId: string;
    chain?: SupportedNetwork;
    timestamp?: Date;
    txHash?: string;
}
export interface FallbackLogEntry {
    userId: string;
    questId: string;
    chain?: SupportedNetwork;
    timestamp: Date;
    txHash?: string;
    fallbackUsed: boolean;
}
/**
 * Get user badges (mock implementation)
 * In production, this would query from database or blockchain
 * @param userId - User ID to get badges for
 * @returns Array of user badges
 */
export declare function getUserBadges(userId: string): UserBadge[];
/**
 * Get fallback logs from the logging system
 * @returns Array of fallback log entries
 */
export declare function getFallbackLogs(): FallbackLogEntry[];
/**
 * Mint badge with admin override (mock implementation)
 * In production, this would interact with smart contracts
 * @param userId - User ID to mint badge for
 * @param questId - Quest ID for the badge
 * @param contractAddress - Contract address to use
 */
export declare function mintBadge(userId: string, questId: string, contractAddress: string): void;
//# sourceMappingURL=mockData.d.ts.map