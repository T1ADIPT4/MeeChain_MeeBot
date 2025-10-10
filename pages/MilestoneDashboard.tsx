/**
 * Milestone Dashboard Page
 * Comprehensive dashboard for milestone tracking, badge minting, and MeeBot feedback
 * Supports Thai/English language switching and fallback viewer integration
 */

import React, { useState, useEffect } from 'react'
import { MilestoneChart } from '../components/MilestoneChart'
import { MeeBotSprite } from '../components/MeeBotSprite'
import { BadgeList } from '../components/BadgeList'
import { MeeBot } from '../components/MeeBot'

interface MetadataInfo {
  name: string
  description: string
  image: string
  questId: string
  badgeId: string
  isFallback: boolean
}

export default function MilestoneDashboard() {
  const [language, setLanguage] = useState<'th' | 'en'>('th')
  const [metadata, setMetadata] = useState<MetadataInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || (navigator as any).userLanguage
    if (browserLang.startsWith('th')) {
      setLanguage('th')
    } else {
      setLanguage('en')
    }
  }, [])

  const handleGenerateMetadata = async () => {
    setLoading(true)
    setError(null)
    MeeBot.setSprite('loading')
    
    try {
      // This would call the actual metadata generation script
      // For now, we'll simulate it
      const response = await fetch('/copilot/ipfs-uploader/metadata/badge-metadata.json')
      
      if (response.ok) {
        const data = await response.json()
        setMetadata(data)
        MeeBot.setSprite('happy')
        MeeBot.speak(language === 'th' 
          ? 'สร้าง metadata สำเร็จแล้วครับ!' 
          : 'Metadata generated successfully!')
      } else {
        throw new Error('Failed to load metadata')
      }
    } catch (err) {
      setError(language === 'th' 
        ? 'ไม่สามารถสร้าง metadata ได้ กรุณาลองใหม่อีกครั้ง' 
        : 'Failed to generate metadata. Please try again.')
      MeeBot.setSprite('sad')
      MeeBot.speak(language === 'th' 
        ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' 
        : 'Error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMintBadge = async () => {
    setLoading(true)
    setError(null)
    MeeBot.setSprite('loading')
    
    try {
      // Simulate badge minting
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      MeeBot.questFeedback('badge-mint', true, false)
      alert(language === 'th' 
        ? '✅ Mint Badge สำเร็จ!' 
        : '✅ Badge minted successfully!')
    } catch (err) {
      MeeBot.questFeedback('badge-mint', false, false)
      setError(language === 'th' 
        ? 'การ mint badge ล้มเหลว' 
        : 'Badge minting failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    const newLang = language === 'th' ? 'en' : 'th'
    setLanguage(newLang)
    MeeBot.speak(newLang === 'th' 
      ? 'เปลี่ยนเป็นภาษาไทยแล้ว' 
      : 'Switched to English')
  }

  const translations = {
    th: {
      title: '🎯 Milestone Dashboard',
      subtitle: 'ระบบติดตาม Milestone และ Badge Minting',
      generateMetadata: 'สร้าง Metadata',
      mintBadge: 'Mint Badge',
      viewBadges: 'ดู Badges ของฉัน',
      languageToggle: 'เปลี่ยนภาษา',
      currentLang: 'ภาษาไทย',
      metadataSection: '📝 Metadata Information',
      badgeSection: '🎖️ Badge Status',
      noMetadata: 'ยังไม่มี metadata กรุณาสร้างก่อน',
      loading: 'กำลังโหลด...',
      fallbackActive: '🟠 ระบบ Fallback ทำงานอยู่'
    },
    en: {
      title: '🎯 Milestone Dashboard',
      subtitle: 'Milestone Tracking and Badge Minting System',
      generateMetadata: 'Generate Metadata',
      mintBadge: 'Mint Badge',
      viewBadges: 'View My Badges',
      languageToggle: 'Switch Language',
      currentLang: 'English',
      metadataSection: '📝 Metadata Information',
      badgeSection: '🎖️ Badge Status',
      noMetadata: 'No metadata found. Please generate first.',
      loading: 'Loading...',
      fallbackActive: '🟠 Fallback System Active'
    }
  }

  const t = translations[language]

  return (
    <div className="milestone-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>
        
        <button 
          className="language-toggle"
          onClick={toggleLanguage}
          title={t.languageToggle}
        >
          🌍 {language === 'th' ? 'TH' : 'EN'}
        </button>
      </header>

      <div className="dashboard-content">
        <section className="milestone-section">
          <MilestoneChart language={language} showSprites={true} />
        </section>

        <section className="actions-section">
          <div className="action-card">
            <h3>{t.metadataSection}</h3>
            
            {metadata ? (
              <div className="metadata-info">
                <p><strong>Name:</strong> {metadata.name}</p>
                <p><strong>Quest ID:</strong> {metadata.questId}</p>
                <p><strong>Badge ID:</strong> {metadata.badgeId}</p>
                {metadata.isFallback && (
                  <div className="fallback-notice">
                    {t.fallbackActive}
                  </div>
                )}
              </div>
            ) : (
              <p className="no-data">{t.noMetadata}</p>
            )}

            <button
              className="btn btn-primary"
              onClick={handleGenerateMetadata}
              disabled={loading}
            >
              {loading ? t.loading : t.generateMetadata}
            </button>
          </div>

          <div className="action-card">
            <h3>{t.badgeSection}</h3>
            
            <MeeBotSprite
              milestoneId="M8"
              status={metadata ? 'celebrate' : 'idle'}
              message={metadata 
                ? (language === 'th' ? 'พร้อม mint badge แล้ว!' : 'Ready to mint badge!')
                : (language === 'th' ? 'สร้าง metadata ก่อนนะครับ' : 'Generate metadata first')}
              language={language}
            />

            <button
              className="btn btn-success"
              onClick={handleMintBadge}
              disabled={loading || !metadata}
            >
              {loading ? t.loading : t.mintBadge}
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>

      <style jsx>{`
        .milestone-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          margin: 0 0 8px 0;
          color: #1f2937;
          font-size: 32px;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }

        .language-toggle {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .language-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .language-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .milestone-section {
          margin-bottom: 32px;
        }

        .actions-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .action-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .action-card h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 20px;
          font-weight: 700;
        }

        .metadata-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .metadata-info p {
          margin: 8px 0;
          color: #4b5563;
          font-size: 14px;
        }

        .no-data {
          color: #9ca3af;
          font-size: 14px;
          font-style: italic;
          margin-bottom: 16px;
        }

        .fallback-notice {
          margin-top: 12px;
          padding: 12px;
          background: #fef3c7;
          border: 2px solid #fbbf24;
          border-radius: 8px;
          color: #92400e;
          font-size: 14px;
          font-weight: 600;
        }

        .btn {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 12px;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-success {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          color: white;
        }

        .error-message {
          background: #fef2f2;
          border: 2px solid #fca5a5;
          color: #991b1b;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
