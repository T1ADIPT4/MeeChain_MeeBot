/**
 * Quest Verifier for MeeChain
 * Verifies if a user has met all conditions for completing a quest
 */
export interface QuestCondition {
    type: string;
    required: number;
    completed: number;
}
export interface Quest {
    id: string;
    name: string;
    conditions: QuestCondition[];
}
/**
 * Verify if a user has met all quest conditions
 * @param userId - User ID to verify
 * @param questId - Quest ID to check
 * @returns true if all conditions are met, false otherwise
 */
export declare function verifyQuestConditions(userId: string, questId: string): Promise<boolean>;
/**
 * Update user progress for a quest condition
 * @param userId - User ID
 * @param questId - Quest ID
 * @param conditionType - Type of condition being updated
 * @param increment - Amount to increment (defaults to 1)
 */
export declare function updateUserProgress(userId: string, questId: string, conditionType: string, increment?: number): void;
/**
 * Get user's current progress for a quest
 * @param userId - User ID
 * @param questId - Quest ID
 * @returns User's progress record
 */
export declare function getUserProgress(userId: string, questId: string): Record<string, number>;
//# sourceMappingURL=questVerifier.d.ts.map