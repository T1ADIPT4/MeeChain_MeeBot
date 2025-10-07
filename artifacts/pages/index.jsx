import { useEffect, useState } from 'react';
import MeeBot from '../components/MeeBot';
import QuestCard from '../components/QuestCard';

export default function Home() {
  const [questStatus, setQuestStatus] = useState(null);
  const [meeBotSprite, setMeeBotSprite] = useState('idle');
  const [badgeMinted, setBadgeMinted] = useState(false);

  const questManagerUrl = process.env.NEXT_PUBLIC_QUEST_MANAGER_URL;
  const badgeMintUrl = process.env.NEXT_PUBLIC_BADGE_MINT_URL;
  const spriteBaseUrl = process.env.NEXT_PUBLIC_MEEBOT_SPRITE_URL;

  useEffect(() => {
    async function checkQuest() {
      try {
        const res = await fetch(`${questManagerUrl}/status`);
        const data = await res.json();
        setQuestStatus(data.status);

        if (data.status === 'completed') {
          setMeeBotSprite('celebrate');
          await mintBadge();
        } else if (data.status === 'in_progress') {
          setMeeBotSprite('thinking');
        } else {
          setMeeBotSprite('idle');
        }
      } catch (err) {
        console.error('Quest check failed:', err);
        setMeeBotSprite('error');
      }
    }
    async function mintBadge(questId) {
      try {
        const res = await fetch(`${contractMintUrl}`, {
          method: 'POST',
          body: JSON.stringify({ questId })
        });
        const result = await res.json();
        if (!result.success) throw new Error('Contract mint failed');
        return result;
      } catch (err) {
        console.warn('Fallback to API minting...');
        const fallbackRes = await fetch(`${fallbackMintUrl}`, {
          method: 'POST',
          body: JSON.stringify({ questId })
        });
        return await fallbackRes.json();
      }
    }

    async function mintBadge() {
      try {
        const res = await fetch(`${badgeMintUrl}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questId: 'starter-quest' }),
        });
        const result = await res.json();
        if (result.success) {
          setBadgeMinted(true);
        }
      } catch (err) {
        console.error('Badge minting failed:', err);
      }
    }

    checkQuest();
  }, []);

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>MeeChain Quest Dashboard</h1>
      <p>Quest Status: <strong>{questStatus || 'Loading...'}</strong></p>
      <img
        src={`${spriteBaseUrl}${meeBotSprite}.png`}
        alt="MeeBot Sprite"
        style={{ width: '200px', marginTop: '1rem' }}
      />
      {badgeMinted && <p>🎉 Badge Minted Successfully!</p>}
    </main>
  );
}

export default function Home() {
  const [status, setStatus] = useState('in_progress');

  return (
    <main>
      <MeeBot sprite={status === 'completed' ? 'celebrate' : 'thinking'} message="กำลังตรวจสอบเควส..." />
      <QuestCard questId="starter-quest" status={status} onComplete={setStatus} />
    </main>
  );
}
