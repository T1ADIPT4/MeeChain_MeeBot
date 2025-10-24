// components/MeeBot.tsx
/**
 * MeeBot component for sprite and TTS integration
 * This is a placeholder implementation that will be replaced with actual MeeBot sprite rendering
 */
class MeeBotClass {
    constructor() {
        this.currentSprite = 'neutral';
        this.lastMessage = '';
    }
    setSprite(emotion) {
        this.currentSprite = emotion;
        console.log(`🤖 MeeBot: Setting sprite to "${emotion}"`);
    }
    speak(message) {
        this.lastMessage = message;
        console.log(`🔊 MeeBot speaks: "${message}"`);
        // In production, this would trigger actual TTS via Gemini or other TTS service
    }
    getCurrentSprite() {
        return this.currentSprite;
    }
    getLastMessage() {
        return this.lastMessage;
    }
    /**
     * Provide TTS feedback for quest completion
     * @param questId - The quest that was completed
     * @param success - Whether the quest was successful
     * @param fallback - Whether fallback minting was used
     */
    questFeedback(questId, success, fallback) {
        if (!success) {
            this.setSprite('sad');
            this.speak('เควสยังไม่สำเร็จนะครับ ลองทำต่อดูนะ');
            return;
        }
        if (fallback) {
            this.setSprite('confused');
            this.speak('ระบบ fallback ทำงานแล้วนะครับ แต่คุณก็ได้ badge แล้ว!');
        }
        else {
            this.setSprite('happy');
            this.speak('เควสสำเร็จ! ได้รับ badge แล้ว ยินดีด้วยครับ!');
        }
    }
    /**
     * Provide TTS feedback for TTS quest specifically
     * @param enabled - Whether TTS was enabled or disabled
     */
    ttsFeedback(enabled) {
        if (enabled) {
            this.setSprite('happy');
            this.speak('เปิด TTS แล้วครับ! ตอนนี้ MeeBot สามารถพูดคุยกับคุณได้แล้ว');
        }
        else {
            this.setSprite('neutral');
            this.speak('ปิด TTS แล้วครับ');
        }
    }
}
export const MeeBot = new MeeBotClass();
//# sourceMappingURL=MeeBot.js.map