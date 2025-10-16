import React from 'react';

export default function LanguageToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle">
      <button onClick={() => setLang('th')}>🇹🇭 ไทย</button>
      <button onClick={() => setLang('en')}>🇬🇧 English</button>
    </div>
  );
}
