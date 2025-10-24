/**
 * MeeBot component for sprite and TTS integration
 * This is a placeholder implementation that will be replaced with actual MeeBot sprite rendering
 */
declare class MeeBotClass {
    private currentSprite;
    private lastMessage;
    setSprite(emotion: string): void;
    speak(message: string): void;
    getCurrentSprite(): string;
    getLastMessage(): string;
    /**
     * Provide TTS feedback for quest completion
     * @param questId - The quest that was completed
     * @param success - Whether the quest was successful
     * @param fallback - Whether fallback minting was used
     */
    questFeedback(questId: string, success: boolean, fallback?: boolean): void;
    /**
     * Provide TTS feedback for TTS quest specifically
     * @param enabled - Whether TTS was enabled or disabled
     */
    ttsFeedback(enabled: boolean): void;
}
export declare const MeeBot: MeeBotClass;
export {};
//# sourceMappingURL=MeeBot.d.ts.map