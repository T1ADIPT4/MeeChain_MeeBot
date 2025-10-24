// pages/Settings.tsx
import React, { useCallback } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingToggle } from '../components/SettingToggle';
import { MeeBot } from '../components/MeeBot';
// Import TTS quest functions for quest triggering
let handleQuestCompletion = null;
let updateTTSProgress = null;
// Lazy load quest modules to avoid circular dependencies
async function triggerTTSQuest(userId) {
    try {
        if (!handleQuestCompletion || !updateTTSProgress) {
            const QuestManager = await import('../src/QuestManager');
            const TTSQuestVerifier = await import('../src/verifiers/TTSQuestVerifier');
            handleQuestCompletion = QuestManager.handleQuestCompletion;
            updateTTSProgress = TTSQuestVerifier.updateTTSProgress;
        }
        // Update TTS progress
        updateTTSProgress(userId, 'tts-enabled', 1);
        // Try to complete the quest
        const result = await handleQuestCompletion(userId, 'quest-tts-001');
        if (result.success) {
            if (result.fallback) {
                MeeBot.setSprite('confused');
                MeeBot.speak('เควส TTS สำเร็จผ่านระบบ fallback!');
            }
            else {
                MeeBot.setSprite('happy');
                MeeBot.speak('ยินดีด้วย! คุณได้รับ badge สำหรับการเปิด TTS แล้ว!');
            }
        }
    }
    catch (error) {
        console.error('Error triggering TTS quest:', error);
    }
}
export default function SettingsPage() {
    const { settings, updateSetting, loading } = useSettings();
    const handleTTSChange = useCallback(async (val) => {
        updateSetting('ttsEnabled', val);
        // Trigger TTS quest when enabling TTS
        if (val) {
            // Get user ID from context or session (using mock for now)
            const userId = 'current-user-id';
            await triggerTTSQuest(userId);
            MeeBot.speak('เปิด TTS แล้วครับ! ตอนนี้ MeeBot สามารถพูดคุยกับคุณได้แล้ว');
        }
        else {
            MeeBot.speak('ปิด TTS แล้วครับ');
        }
    }, [updateSetting]);
    if (loading) {
        MeeBot.setSprite('loading');
        return React.createElement("p", null, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32...");
    }
    MeeBot.setSprite('neutral');
    MeeBot.speak('คุณสามารถปรับแต่งระบบ MeeChain ได้ที่นี่');
    return (React.createElement("div", null,
        React.createElement("h1", null, "Settings"),
        React.createElement(SettingToggle, { label: "\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E2A\u0E35\u0E22\u0E07 TTS", value: settings.ttsEnabled, onChange: handleTTSChange }),
        React.createElement(SettingToggle, { label: "\u0E42\u0E2B\u0E21\u0E14 Sprite MeeBot", value: settings.spriteMode === 'animated', onChange: (val) => updateSetting('spriteMode', val ? 'animated' : 'default') }),
        React.createElement(SettingToggle, { label: "\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E40\u0E04\u0E27\u0E2A\u0E43\u0E2B\u0E21\u0E48", value: settings.notifications, onChange: (val) => updateSetting('notifications', val) })));
}
//# sourceMappingURL=Settings.js.map