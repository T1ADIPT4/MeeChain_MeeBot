/**
 * Quest Manager for MeeChain
 * Main orchestrator for quest verification and badge minting with fallback support
 */
import { BadgeTransaction } from './minting/badgeMinter.js';
export interface QuestCompletionResult {
    success: boolean;
    reason?: string;
    tx?: BadgeTransaction;
    fallback?: boolean;
}
/**
 * Handle quest completion for a user
 * Verifies quest conditions, mints badge with fallback support
 * @param userId - User ID completing the quest
 * @param questId - Quest ID being completed
 * @returns Quest completion result with transaction details
 */
export declare function handleQuestCompletion(userId: string, questId: string): Promise<QuestCompletionResult>;
/**
 * Get quest completion status
 * @param userId - User ID to check
 * @param questId - Quest ID to check
 * @returns Completion status message
 */
export declare function getQuestStatus(userId: string, questId: string): Promise<string>;
//# sourceMappingURL=QuestManager.d.ts.map