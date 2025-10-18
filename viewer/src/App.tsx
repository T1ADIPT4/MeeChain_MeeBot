
import React, { useState } from 'react';
import ProfileViewer from '../components/ProfileViewer';
import ConnectWalletButton from '../components/ConnectWalletButton';
import Leaderboard from '../components/Leaderboard';
import SwapT2PtoMEE from '../components/SwapT2PtoMEE';
import CoinStatusDemo from '../components/CoinStatusDemo';
import { MeeBotProvider } from './context/MeeBotContext';

function App() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'coinstatus'>('dashboard');
  const viewerEmail = "pouri199028@gmail.com";

  const handleConnect = (address: string) => {
    setUserAddress(address);
  };

  return (
    <MeeBotProvider>
      <div className="App">
        <header className="App-header">
          <h1>MeeChain Dashboard</h1>
          <nav className="nav-buttons">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={activeView === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveView('coinstatus')}
              className={activeView === 'coinstatus' ? 'active' : ''}
            >
              Coin Status
            </button>
          </nav>
          <ConnectWalletButton onConnect={handleConnect} />
        </header>
        <main>
          {activeView === 'dashboard' ? (
            <>
              <ProfileViewer userAddress={userAddress} viewerEmail={viewerEmail} />
              
              {/* เพิ่ม Swap T2P to MEE */}
              <SwapT2PtoMEE />
              
              {/* เพิ่ม Leaderboard เข้าไปในหน้าหลัก */}
              <Leaderboard />
            </>
          ) : (
            <CoinStatusDemo />
          )}
        </main>
      </div>
    </MeeBotProvider>
  );
}

export default App;
