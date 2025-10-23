
import React, { useState } from 'react';
import ProfileViewer from '../components/ProfileViewer';
import ConnectWalletButton from '../components/ConnectWalletButton';
import Leaderboard from '../components/Leaderboard';
import SwapT2PtoMEE from '../components/SwapT2PtoMEE';
import ContributorExplorer from './components/ContributorExplorer';
import { MeeBotProvider } from './context/MeeBotContext';

function App() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const viewerEmail = "pouri199028@gmail.com";

  const handleConnect = (address: string) => {
    setUserAddress(address);
  };

  return (
    <MeeBotProvider>
      <div className="App">
        <header className="App-header">
          <h1>MeeChain Dashboard</h1>
          <ConnectWalletButton onConnect={handleConnect} />
        </header>
        <main>
          <ProfileViewer userAddress={userAddress} viewerEmail={viewerEmail} />
          
          {/* เพิ่ม Swap T2P to MEE */}
          <SwapT2PtoMEE />
          
          {/* เพิ่ม Leaderboard เข้าไปในหน้าหลัก */}
          <Leaderboard />

          {/* เพิ่ม Contributor Explorer */}
          <ContributorExplorer />
        </main>
      </div>
    </MeeBotProvider>
  );
}

export default App;
