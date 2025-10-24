import React, { useState } from 'react';
import { ethers } from 'ethers';

interface ConnectWalletButtonProps {
  onConnect: (address: string) => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert('กรุณาติดตั้ง MetaMask ก่อนนะครับ!');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกระเป๋าเงิน');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="connect-wallet-button"
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
      }}
    >
      {isConnecting ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อกระเป๋าเงิน'}
    </button>
  );
};

export default ConnectWalletButton;
