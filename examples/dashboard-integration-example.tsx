/**
 * Example: Integrating AuditorDashboard into the MeeChain App
 * 
 * This shows how to add the governance dashboard to the existing viewer app.
 */

import React, { useState } from 'react';
import AuditorDashboard from '../viewer/components/AuditorDashboard';
import ConnectWalletButton from '../viewer/components/ConnectWalletButton';
import { MeeBotProvider } from '../viewer/src/context/MeeBotContext';

/**
 * Option 1: Add as a separate route/page
 * Use this if you want the auditor dashboard to be on its own page
 */
function AppWithAuditorRoute() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'auditor'>('home');

  const handleConnect = (address: string) => {
    setUserAddress(address);
  };

  return (
    <MeeBotProvider>
      <div className="App">
        <header className="App-header">
          <h1>MeeChain Dashboard</h1>
          <nav>
            <button onClick={() => setCurrentPage('home')}>Home</button>
            <button onClick={() => setCurrentPage('auditor')}>Auditor Dashboard</button>
          </nav>
          <ConnectWalletButton onConnect={handleConnect} />
        </header>
        <main>
          {currentPage === 'home' ? (
            <div>
              {/* Your existing home page content */}
              <h2>Welcome to MeeChain</h2>
            </div>
          ) : (
            <AuditorDashboard />
          )}
        </main>
      </div>
    </MeeBotProvider>
  );
}

/**
 * Option 2: Add directly to existing App
 * Use this if you want to show the auditor dashboard inline
 */
function AppWithAuditorInline() {
  const [userAddress, setUserAddress] = useState<string | null>(null);

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
          {/* Your existing components */}
          
          {/* Add Auditor Dashboard section */}
          <section id="governance">
            <AuditorDashboard />
          </section>
        </main>
      </div>
    </MeeBotProvider>
  );
}

/**
 * Option 3: Conditional rendering based on user role
 * Use this if only certain users should see the auditor dashboard
 */
function AppWithRoleBasedAuditor() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
  const handleConnect = (address: string) => {
    setUserAddress(address);
  };

  // Example: Check if user is a DAO member or Core contributor
  const isDAOMember = (address: string | null): boolean => {
    if (!address) return false;
    // In production, check against a list of authorized addresses
    // or verify a DAO token balance
    const daoMembers = [
      '0xDAOReviewer',
      '0xCoreContributor',
      // Add more authorized addresses
    ];
    return daoMembers.includes(address);
  };

  return (
    <MeeBotProvider>
      <div className="App">
        <header className="App-header">
          <h1>MeeChain Dashboard</h1>
          <ConnectWalletButton onConnect={handleConnect} />
        </header>
        <main>
          {/* Your existing components */}
          
          {/* Show auditor dashboard only to authorized users */}
          {isDAOMember(userAddress) && (
            <section id="governance">
              <AuditorDashboard />
            </section>
          )}
        </main>
      </div>
    </MeeBotProvider>
  );
}

/**
 * Recommended Integration Steps:
 * 
 * 1. Choose one of the patterns above
 * 2. Copy the relevant code to your App.tsx
 * 3. Import AuditorDashboard component
 * 4. Add navigation or conditional rendering
 * 5. Style as needed
 * 
 * Example import:
 * import AuditorDashboard from './components/AuditorDashboard';
 */

export { AppWithAuditorRoute, AppWithAuditorInline, AppWithRoleBasedAuditor };
