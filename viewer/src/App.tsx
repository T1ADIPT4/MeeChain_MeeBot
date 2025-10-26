
import React, { useState } from 'react';
import ProfileViewer from '../components/ProfileViewer';
import ConnectWalletButton from '../components/ConnectWalletButton';
import Leaderboard from '../components/Leaderboard';
import SwapT2PtoMEE from '../components/SwapT2PtoMEE';
import AuditorDashboard from './components/AuditorDashboard';
import ContributorLeaderboard from './components/ContributorLeaderboard';
import ContributorExplorer from './components/ContributorExplorer';
import { MeeBotProvider } from './context/MeeBotContext';

function App() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'auditor' | 'contributors'>('main');
  const viewerEmail = "pouri199028@gmail.com";

  const handleConnect = (address: string) => {
    setUserAddress(address);
  };

  return (
    <MeeBotProvider>
      <div className="App">
        <header className="App-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <h1 style={{ margin: 0 }}>MeeChain Dashboard</h1>
          <ConnectWalletButton onConnect={handleConnect} />
        </header>
        
        {/* Tab Navigation */}
        <nav style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem 2rem',
          background: '#f7fafc',
          borderBottom: '2px solid #e2e8f0',
        }}>
          <button
            onClick={() => setActiveTab('main')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'main' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: activeTab === 'main' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: activeTab === 'main' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🏠 Main Dashboard
          </button>
          <button
            onClick={() => setActiveTab('auditor')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'auditor' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: activeTab === 'auditor' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: activeTab === 'auditor' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🛡️ Auditor Dashboard
          </button>
          <button
            onClick={() => setActiveTab('contributors')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'contributors' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: activeTab === 'contributors' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: activeTab === 'contributors' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🏆 Contributors
          </button>
        </nav>
        
        <main>
          {activeTab === 'main' && (
            <>
              <ProfileViewer userAddress={userAddress} viewerEmail={viewerEmail} />
              
              {/* เพิ่ม Swap T2P to MEE */}
              <SwapT2PtoMEE />
              
              {/* เพิ่ม Leaderboard เข้าไปในหน้าหลัก */}
              <Leaderboard />
            </>
          )}
          
          {activeTab === 'auditor' && (
            <AuditorDashboard />
          )}
          
          {activeTab === 'contributors' && (
            <div style={{ padding: '2rem' }}>
              <ContributorLeaderboard />
            </div>
          )}
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
