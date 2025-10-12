
import React, { useState } from 'react';
import ProfileViewer from './components/ProfileViewer';
import { MeeBotProvider } from './context/MeeBotContext'; // เพิ่มเข้ามา

function App() {
  // สมมติว่ามีระบบดึง userAddress จาก wallet
  const [userAddress, setUserAddress] = useState('0x1234567890AbCdEf1234567890AbCdEf12345678');

  return (
    <MeeBotProvider> // ครอบ Provider ไว้ที่นี่
      <div className="App">
        <header className="App-header">
          <h1>MeeChain Dashboard</h1>
          {/* อาจจะมีปุ่ม Connect Wallet ตรงนี้ */}
        </header>
        <main>
          <ProfileViewer userAddress={userAddress} />
        </main>
      </div>
    </MeeBotProvider>
  );
}

export default App;
