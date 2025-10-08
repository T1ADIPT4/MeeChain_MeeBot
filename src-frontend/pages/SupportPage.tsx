import React from 'react'
import './SupportPage.css'

const SupportPage: React.FC = () => {
  return (
    <div className="page-container support-page">
      <header className="page-header">
        <h1>💬 Support</h1>
        <p className="subtitle">Get help with MeeChain MeeBot</p>
      </header>

      <div className="support-content">
        <section className="faq-section">
          <h2>📚 Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h3>What is MeeChain MeeBot?</h3>
            <p>
              MeeChain MeeBot is a fallback-aware multi-chain badge minting system with quest tracking.
              Complete quests to earn NFT badges on the blockchain.
            </p>
          </div>

          <div className="faq-item">
            <h3>How does the fallback mechanism work?</h3>
            <p>
              If minting fails on the primary chain, the system automatically attempts to mint your badge
              on the fallback chain, ensuring you never lose your progress.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I mint a badge?</h3>
            <p>
              Navigate to the Mint Badge page, enter your User ID and Quest ID, then click "Mint Badge".
              The system will process your request and mint your badge on the blockchain.
            </p>
          </div>

          <div className="faq-item">
            <h3>What are NFT Football collectibles?</h3>
            <p>
              NFT Football is a collection of exclusive football-themed NFTs that you can earn by
              completing specific quests and achievements.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <h2>📧 Contact Us</h2>
          <div className="contact-methods">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>support@meechain.io</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>Discord</h3>
              <p>Join our community</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🐦</div>
              <h3>Twitter</h3>
              <p>@MeeChain</p>
            </div>
          </div>
        </section>

        <section className="docs-section">
          <h2>📖 Documentation</h2>
          <div className="docs-links">
            <a href="#" className="doc-link">
              <span className="doc-icon">📄</span>
              Quest System Overview
            </a>
            <a href="#" className="doc-link">
              <span className="doc-icon">🔌</span>
              Integration Guide
            </a>
            <a href="#" className="doc-link">
              <span className="doc-icon">🏗️</span>
              Architecture Documentation
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SupportPage
