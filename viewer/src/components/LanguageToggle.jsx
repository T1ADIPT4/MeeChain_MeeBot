import React from 'react';

/**
 * LanguageToggle Component
 * Provides UI for switching between Thai and English languages
 */
export default function LanguageToggle({ currentLang, onLanguageChange, t }) {
  return (
    <div className="language-toggle">
      <button 
        className={`lang-button ${currentLang === 'th' ? 'active' : ''}`}
        onClick={() => onLanguageChange('th')}
        title="Alt + T"
      >
        🇹🇭 ไทย
      </button>
      <button 
        className={`lang-button ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
        title="Alt + E"
      >
        🇬🇧 English
      </button>

      <style jsx>{`
        .language-toggle {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .lang-button {
          padding: 10px 20px;
          border: 2px solid #667eea;
          background: white;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #667eea;
        }

        .lang-button:hover {
          background: #f0f4ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
        }

        .lang-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #764ba2;
        }

        .lang-button.active:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 480px) {
          .lang-button {
            padding: 8px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
