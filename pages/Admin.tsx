import React, { useState, useEffect } from 'react';
import MeeBot from './components/MeeBot'; // ✅ สมมติว่า MeeBot อยู่ใน components/

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
      <MeeBot className="sprite-deploy-ready" />
    </div>
  );
};

export default DeployViewer;