import React, { useState, useEffect } from 'react';
import RegistryCard from './components/RegistryCard';
import MilestoneChart from './components/MilestoneChart';
import LanguageToggle from './components/LanguageToggle';
import th from './i18n/th.json';
import en from './i18n/en.json';

export default function App() {
  const [lang, setLang] = useState('th');
  const [registry, setRegistry] = useState({});
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    fetch('/registry.json')
      .then(res => res.json())
      .then(setRegistry);

    fetch('/milestone.log')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(Boolean);
        const parsed = lines.map(line => {
          const [id, msg] = line.split(':');
          return { id, msg, done: true };
        });
        setMilestones(parsed);
      });
  }, []);

  const dict = lang === 'th' ? th : en;

  return (
    <div>
      <LanguageToggle lang={lang} setLang={setLang} />
      <h2>{dict.registry_status}</h2>
      <RegistryCard registry={registry} />
      <h2>{dict.milestone_progress}</h2>
      <MilestoneChart milestones={milestones} />
    </div>
  );
}
