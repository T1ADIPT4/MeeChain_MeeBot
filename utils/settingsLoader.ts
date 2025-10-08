// utils/settingsLoader.ts

export async function loadSettings(): Promise<any> {
  try {
    const res = await fetch('/api/settings')
    return await res.json()
  } catch {
    console.warn('Primary settings fetch failed, using fallback')
    return {
      ttsEnabled: true,
      spriteMode: 'default',
      notifications: false
    }
  }
}

export async function saveSettings(settings: any): Promise<void> {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: { 'Content-Type': 'application/json' }
    })
  } catch {
    console.warn('Failed to save settings')
  }
}
