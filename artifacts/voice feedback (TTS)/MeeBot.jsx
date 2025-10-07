import { useEffect } from 'react';

export default function MeeBot({ sprite = 'idle', message = '' }) {
  const spriteBaseUrl = process.env.NEXT_PUBLIC_MEEBOT_SPRITE_URL;
  const ttsApiKey = process.env.NEXT_PUBLIC_TTS_API_KEY;

  useEffect(() => {
    if (message && ttsApiKey) {
      const speak = async () => {
        try {
          const res = await fetch('https://api.tts-provider.com/speak', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ttsApiKey}`
            },
            body: JSON.stringify({ text: message })
          });
          const audio = await res.blob();
          const url = URL.createObjectURL(audio);
          new Audio(url).play();
        } catch (err) {
          console.error('TTS failed:', err);
        }
      };
      speak();
    }
  }, [message, ttsApiKey]);

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={`${spriteBaseUrl}${sprite}.png`}
        alt={`MeeBot - ${sprite}`}
        style={{ width: '180px' }}
      />
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
