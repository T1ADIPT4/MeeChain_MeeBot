/**
 * TTS Quest Verifier for MeeChain
 * Verifies if a user has completed the TTS enabling quest
 */
export interface TTSQuestCondition {
    type: 'tts-enabled' | 'tts-used';
    required: number;
    completed: number;
}
export interface TTSQuest {
    id: string;
    name: string;
    conditions: TTSQuestCondition[];
}
/**
 * Verify if a user has met TTS quest conditions
 * @param userId - User ID to verify
 * @returns true if all conditions are met, false otherwise
 */
export declare function verifyTTSQuestConditions(userId: string): Promise<boolean>;
/**
 * Update user progress for TTS quest
 * @param userId - User ID
 * @param conditionType - Type of condition being updated ('tts-enabled' or 'tts-used')
 * @param increment - Amount to increment (defaults to 1)
 */
export declare function updateTTSProgress(userId: string, conditionType: 'tts-enabled' | 'tts-used', increment?: number): void;
/**
 * Get user's current progress for TTS quest
 * @param userId - User ID
 * @returns User's progress record
 */
export declare function getTTSProgress(userId: string): Record<string, number>;
/**
 * Get TTS quest definition
 * @returns TTS quest object
 */
export declare function getTTSQuest(): TTSQuest;
//# sourceMappingURL=TTSQuestVerifier.d.ts.map