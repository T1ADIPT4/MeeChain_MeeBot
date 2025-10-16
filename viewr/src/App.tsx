import './i18n';
import React, { useState, useEffect } from 'react';
import RegistryCard from './components/RegistryCard';
import MilestoneChart from './components/MilestoneChart';
import LanguageToggle from './components/LanguageToggle';
import MeeBot from './components/MeeBot';

export default function App() {
  const [lang, setLang] = useState('th');
  const [registry, setRegistry] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [questMetadata, setQuestMetadata] = useState(null);

  useEffect(() => {
    fetch('/registry.json').then(res => res.json()).then(setRegistry);
    fetch('/milestone.log').then(res => res.text()).then(text => {
      const entries = text.trim().split(/\n(?=M\d+:)/);
      const parsed = entries.map(entry => {
        const firstColonIndex = entry.indexOf(':');
        if (firstColonIndex === -1) return null;
        const id = entry.substring(0, firstColonIndex);
        const msg = entry.substring(firstColonIndex + 1).trim();
        return { id, msg, done: true };
      }).filter(Boolean);
      setMilestones(parsed);
    });
    fetch('/copilot/implement-ipfs-uploader/metadata/quest-001.json')
      .then(res => res.json())
      .then(setQuestMetadata);
  }, []);

  const isDataLoading = !milestones.length || !registry.version || !questMetadata;
  const allMilestonesCompleted = milestones.length === 5;

  if (isDataLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <img src="/assets/fallback/badge-placeholder.svg" alt="Fallback Viewer" />
        <p>กำลังโหลดข้อมูล MeeChain...</p>
      </div>
    );
  }

  return (
    <div>
      <LanguageToggle lang={lang} setLang={setLang} />
      {questMetadata.owner && (
        <h2 style={{ fontFamily: 'monospace', textAlign: 'center' }}>
          Welcome, {questMetadata.owner}!
        </h2>
      )}
      <RegistryCard registry={registry} />
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem', fontFamily: 'monospace', textAlign: 'center' }}>
        <h3>Quest Badge: {questMetadata.name}</h3>
        <img
          src={allMilestonesCompleted ? questMetadata.image : '/assets/fallback/badge-placeholder.svg'}
          alt={allMilestonesCompleted ? questMetadata.name : 'Badge not yet earned'}
          style={{ maxWidth: '150px', border: '1px solid #eee', marginBottom: '1rem' }}
        />
        <p><strong>Owner:</strong> {questMetadata.owner}</p>
        <p><strong>Status:</strong> {allMilestonesCompleted ? 'Quest Complete!' : `In Progress (${milestones.length}/5)`}</p>
        <p><strong>Description:</strong> {questMetadata.description}</p>
      </div>
      <MilestoneChart milestones={milestones} />
      <MeeBot milestones={milestones} />
    </div>
  );
}
