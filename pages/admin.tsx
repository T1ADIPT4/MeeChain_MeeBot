import React, { useState, useEffect } from 'react';
import { MeeBot } from '../components/MeeBot'; // use named export

interface NetworkConfig {
  name: string;
  chainId: number;
  badgeContract: string;
  questContract: string;
  fallbackContract: string;
}

const DeployViewer: React.FC = () => {
  const [network, setNetwork] = useState<NetworkConfig | null>(null);

  useEffect(() => {
    // mock fetch
    const mockNetwork: NetworkConfig = {
      name: 'Polygon',
      chainId: 137,
      badgeContract: '0xBadgePoly123',
      questContract: '0xQuestPoly456',
      fallbackContract: '0xFallbackPoly789'
    };
    setNetwork(mockNetwork);
  }, []);

  return (
    <div>
      <h2>🚀 MeeChain Deploy Viewer</h2>
      {network && (
        <div>
          <p><strong>Network:</strong> {network.name}</p>
          <p><strong>Badge Contract:</strong> {network.badgeContract}</p>
          <p><strong>Quest Contract:</strong> {network.questContract}</p>
          <p><strong>Fallback Contract:</strong> {network.fallbackContract}</p>
        </div>
      )}
      {/* MeeBot is a runtime helper, not a React component. Use its methods to drive sprite/TTS. */}
      <div className="meebot-sprite" onClick={() => MeeBot.setSprite('happy')}>
        <button>Trigger MeeBot Happy Sprite</button>
      </div>
    </div>
  );
};

export default DeployViewer;