// utils/settingsLoader.ts
export async function loadSettings() {
    try {
        const res = await fetch('/api/settings');
        return await res.json();
    }
    catch {
        console.warn('Primary settings fetch failed, using fallback');
        return {
            ttsEnabled: true,
            spriteMode: 'default',
            notifications: false
        };
    }
}
export async function saveSettings(settings) {
    try {
        await fetch('/api/settings', {
            method: 'POST',
            body: JSON.stringify(settings),
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch {
        console.warn('Failed to save settings');
    }
}
//# sourceMappingURL=settingsLoader.js.map