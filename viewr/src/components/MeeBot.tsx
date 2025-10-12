import React from 'react';

// Define the type for a single milestone
interface Milestone {
  id: string;
  msg: string;
  done: boolean;
}

// Define the props for the MeeBot component
interface MeeBotProps {
  milestones: Milestone[];
}

// A simple component to represent the sprite
const MeeBotSprite = ({ status }: { status: 'celebrate' | 'idle' }) => {
  let spriteText = '';
  switch (status) {
    case 'celebrate':
      spriteText = '🟢🕺'; // Dancing MeeBot sprite
      break;
    case 'idle':
      spriteText = '😐'; // Idle MeeBot sprite
      break;
    default:
      spriteText = '❓'; // Confused MeeBot
  }
  return <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{spriteText}</span>;
};


const MeeBot = ({ milestones }: MeeBotProps) => {
  if (!milestones || milestones.length === 0) {
    return <div><MeeBotSprite status="idle" /> <span>ยังไม่มีข้อมูล milestone...</span></div>;
  }

  return (
    <div style={{ fontFamily: 'monospace', border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>MeeBot Feedback</h3>
      {milestones.map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
          <MeeBotSprite status={m.done ? 'celebrate' : 'idle'} />
          <span style={{ whiteSpace: 'pre-wrap' }}><strong>{m.id}:</strong> {m.msg}</span>
        </div>
      ))}
    </div>
  );
};

export default MeeBot;
