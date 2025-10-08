// hooks/useSettings.ts

import { useState, useEffect } from 'react'
import { loadSettings, saveSettings } from '../utils/settingsLoader'

export function useSettings() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      const loaded = await loadSettings()
      setSettings(loaded)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const updateSetting = async (key: string, value: any) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    await saveSettings(updated)
  }

  return { settings, updateSetting, loading }
}
