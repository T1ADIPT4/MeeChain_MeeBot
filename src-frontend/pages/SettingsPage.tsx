import React, { useState } from 'react'
import './SettingsPage.css'

const SettingsPage: React.FC = () => {
  const [primaryChain, setPrimaryChain] = useState('MeeChain')
  const [fallbackChain, setFallbackChain] = useState('Polygon')
  const [notifications, setNotifications] = useState(true)
  const [autoMint, setAutoMint] = useState(false)

  const handleSaveSettings = () => {
    // Mock save (replace with actual implementation)
    alert('Settings saved successfully!')
  }

  return (
    <div className="page-container settings-page">
      <header className="page-header">
        <h1>⚙️ Settings</h1>
        <p className="subtitle">Configure your MeeChain preferences</p>
      </header>

      <div className="settings-content">
        <section className="settings-section">
          <h2>🔗 Blockchain Configuration</h2>
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="primary-chain">Primary Chain</label>
              <select
                id="primary-chain"
                value={primaryChain}
                onChange={(e) => setPrimaryChain(e.target.value)}
              >
                <option value="MeeChain">MeeChain</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="fallback-chain">Fallback Chain</label>
              <select
                id="fallback-chain"
                value={fallbackChain}
                onChange={(e) => setFallbackChain(e.target.value)}
              >
                <option value="Polygon">Polygon</option>
                <option value="Ethereum">Ethereum</option>
                <option value="MeeChain">MeeChain</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>🔔 Preferences</h2>
          <div className="settings-group">
            <div className="setting-item toggle">
              <div className="toggle-info">
                <label>Enable Notifications</label>
                <p className="setting-description">
                  Receive notifications for quest completions and badge minting
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item toggle">
              <div className="toggle-info">
                <label>Auto-mint on Quest Completion</label>
                <p className="setting-description">
                  Automatically mint badges when quests are completed
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoMint}
                  onChange={(e) => setAutoMint(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <button onClick={handleSaveSettings} className="save-button">
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
