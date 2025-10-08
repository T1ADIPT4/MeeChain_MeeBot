import React from 'react'
import './HomePage.css'

const HomePage: React.FC = () => {
  return (
    <div className="page-container home-page">
      <header className="page-header">
        <h1>🎯 Welcome to MeeChain MeeBot</h1>
        <p className="subtitle">
          Fallback-aware multi-chain minting with quest tracking and badge system
        </p>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Fallback-aware Minting</h3>
          <p>Multi-chain badge minting with automatic fallback mechanism</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>MeeBot Integration</h3>
          <p>Interactive sprite with TTS feedback for quest completion</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Quest Tracker</h3>
          <p>Complete quests and earn badges with full auditability</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>NFT Collections</h3>
          <p>Football and productivity NFT collections</p>
        </div>
      </section>

      <section className="quick-start">
        <h2>🚀 Quick Start</h2>
        <div className="quick-start-content">
          <div className="quick-start-step">
            <span className="step-number">1</span>
            <p>Navigate to <strong>Mint Badge</strong> to start earning badges</p>
          </div>
          <div className="quick-start-step">
            <span className="step-number">2</span>
            <p>Check out <strong>NFT Football</strong> for exclusive collections</p>
          </div>
          <div className="quick-start-step">
            <span className="step-number">3</span>
            <p>Configure your preferences in <strong>Settings</strong></p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
