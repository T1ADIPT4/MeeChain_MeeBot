import React, { useState, useEffect } from 'react';
import RegistryCard from './components/RegistryCard.jsx';
import MilestoneChart from './components/MilestoneChart.jsx';
import BadgeStatus from './components/BadgeStatus.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';

/**
 * Main App Component
 * Interactive viewer for MeeChain Registry, Milestones, and Badges
 */
export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [translations, setTranslations] = useState({});
  const [registry, setRegistry] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meeBotSprite, setMeeBotSprite] = useState('🤖');

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    const detectedLang = browserLang.startsWith('th') ? 'th' : 'en';
    setCurrentLang(detectedLang);
    loadTranslations(detectedLang);
  }, []);

  // Load translations
  const loadTranslations = async (lang) => {
    try {
      const response = await fetch(`/viewer/i18n/${lang}.json`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      } else {
        // Fallback to embedded translations
        setTranslations(getFallbackTranslations(lang));
      }
    } catch (error) {
      console.warn('Failed to load translations:', error);
      setTranslations(getFallbackTranslations(lang));
    }
  };

  // Fallback translations
  const getFallbackTranslations = (lang) => {
    if (lang === 'th') {
      return {
        registry_status: 'สถานะ Registry',
        milestone_progress: 'ความคืบหน้า Milestone',
        badge_status: 'สถานะ Badge',
        loading: 'กำลังโหลด...',
        error: 'เกิดข้อผิดพลาด',
        no_milestones: 'ยังไม่มี milestone',
        no_badge_found: 'ไม่พบ badge',
        quest_id: 'รหัสเควส',
        badge_id: 'รหัส Badge',
        status: 'สถานะ',
        using_fallback: '🟠 ใช้ระบบ Fallback'
      };
    }
    return {
      registry_status: 'Registry Status',
      milestone_progress: 'Milestone Progress',
      badge_status: 'Badge Status',
      loading: 'Loading...',
      error: 'Error',
      no_milestones: 'No milestones',
      no_badge_found: 'No badge found',
      quest_id: 'Quest ID',
      badge_id: 'Badge ID',
      status: 'Status',
      using_fallback: '🟠 Using Fallback Asset'
    };
  };

  // Translation helper
  const t = (key, fallback = '') => {
    return translations[key] || fallback || key;
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load registry
      await loadRegistry();
      
      // Load milestones
      await loadMilestones();
      
      // Load badge
      await loadBadge();
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const loadRegistry = async () => {
    try {
      const response = await fetch('/config/deploy-registry.json');
      if (response.ok) {
        const data = await response.json();
        setRegistry({
          name: 'MeeChain Registry',
          url: 'https://demo.registry.io',
          version: data.version || '0.0.0',
          hash: data.networks?.polygon?.badgeContract || 'N/A',
          status: 'active'
        });
      } else {
        setRegistry({
          name: 'MeeChain Registry',
          url: 'https://demo.registry.io',
          version: '0.0.0',
          hash: '0x1e2e7e22...5612',
          status: 'active'
        });
      }
    } catch (error) {
      console.warn('Failed to load registry:', error);
      setRegistry({
        name: 'MeeChain Registry',
        url: 'https://demo.registry.io',
        version: '0.0.0',
        hash: '0x1e2e7e22...5612',
        status: 'active'
      });
    }
  };

  const loadMilestones = async () => {
    try {
      const response = await fetch('/copilot/milestone.log');
      if (response.ok) {
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        const milestoneLines = lines.filter(line => 
          line.match(/M\d+:/) || line.includes('Status:') || line.includes('MeeBot:')
        );
        setMilestones(milestoneLines.slice(0, 20)); // Limit to 20 entries
        
        // Update MeeBot sprite based on milestone count
        const completedMilestones = milestoneLines.filter(line => line.includes('✅')).length;
        if (completedMilestones >= 7) {
          setMeeBotSprite('🟢');
        } else if (completedMilestones >= 5) {
          setMeeBotSprite('🟣');
        } else if (completedMilestones >= 3) {
          setMeeBotSprite('🔵');
        } else {
          setMeeBotSprite('🤖');
        }
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.warn('Failed to load milestones:', error);
      setMilestones([]);
    }
  };

  const loadBadge = async () => {
    try {
      // Try to load metadata
      const response = await fetch('/output/metadata.json');
      if (response.ok) {
        const data = await response.json();
        setBadge({
          questId: data.properties?.questId || 'quest-001',
          badgeId: data.properties?.badgeId || 'badge-001',
          name: data.name,
          description: data.description,
          imageUrl: data.image,
          status: 'minted',
          isFallback: data.properties?.isFallback || false
        });
      } else {
        // Use fallback badge
        setBadge({
          questId: 'quest-001',
          badgeId: null,
          name: 'MeeChain Badge',
          description: 'Fallback badge display',
          imageUrl: '/copilot/assets/fallback/badge-placeholder.svg',
          status: 'pending',
          isFallback: true
        });
      }
    } catch (error) {
      console.warn('Failed to load badge:', error);
      setBadge({
        questId: 'quest-001',
        badgeId: null,
        name: 'MeeChain Badge',
        description: 'Fallback badge display',
        imageUrl: '/copilot/assets/fallback/badge-placeholder.svg',
        status: 'pending',
        isFallback: true
      });
    }
  };

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    loadTranslations(lang);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 't') {
        handleLanguageChange('th');
      } else if (e.altKey && e.key === 'e') {
        handleLanguageChange('en');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loading-content">
          <div className="meebot-sprite">{meeBotSprite}</div>
          <h2>{t('loading', 'Loading...')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <div className="meebot-sprite">{meeBotSprite}</div>
          <h1>{t('viewer_title', 'MeeChain Badge Viewer')}</h1>
          <p className="subtitle">
            {currentLang === 'th' 
              ? 'ระบบแสดงผล Registry, Milestone และ Badge แบบ Interactive' 
              : 'Interactive Registry, Milestone, and Badge Viewer'}
          </p>
        </header>

        <LanguageToggle 
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          t={t}
        />

        <main>
          <RegistryCard registry={registry} t={t} />
          <MilestoneChart milestones={milestones} t={t} />
          <BadgeStatus badge={badge} t={t} />
        </main>

        <footer>
          <p>
            MeeChain MeeBot © 2025 | 
            {currentLang === 'th' 
              ? ' ระบบ Badge และ Quest แบบ Fallback-aware' 
              : ' Fallback-aware Badge and Quest System'}
          </p>
          <p className="shortcuts">
            {currentLang === 'th' 
              ? '⌨️ ลัดคีย์: Alt+T (ไทย) | Alt+E (English)' 
              : '⌨️ Shortcuts: Alt+T (Thai) | Alt+E (English)'}
          </p>
        </footer>
      </div>

      <style jsx>{`
        .app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }

        .loading-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .loading-content h2 {
          margin-top: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .meebot-sprite {
          font-size: 64px;
          margin-bottom: 16px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        h1 {
          font-size: 36px;
          margin: 0 0 12px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .subtitle {
          font-size: 16px;
          opacity: 0.9;
        }

        main {
          margin-bottom: 40px;
        }

        footer {
          text-align: center;
          color: white;
          padding: 20px;
          opacity: 0.9;
        }

        footer p {
          margin: 8px 0;
          font-size: 14px;
        }

        .shortcuts {
          font-size: 12px;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 28px;
          }

          .subtitle {
            font-size: 14px;
          }

          .meebot-sprite {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  );
}
