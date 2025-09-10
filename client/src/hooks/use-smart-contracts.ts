
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SmartContractService from '@/lib/smart-contract-integration';

interface ContractState {
  service: SmartContractService | null;
  isConnected: boolean;
  userAddress: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useSmartContracts() {
  const [state, setState] = useState<ContractState>({
    service: null,
    isConnected: false,
    userAddress: null,
    isLoading: true,
    error: null
  });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const service = new SmartContractService(signer);
      
      setState(prev => ({
        ...prev,
        service,
        isConnected: true,
        userAddress: address,
        isLoading: false,
        error: null
      }));

      return { service, address };
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
      throw error;
    }
  };

  const disconnect = () => {
    setState({
      service: null,
      isConnected: false,
      userAddress: null,
      isLoading: false,
      error: null
    });
  };

  useEffect(() => {
    // Initialize read-only service
    const service = new SmartContractService();
    setState(prev => ({
      ...prev,
      service,
      isLoading: false
    }));

    // Check if wallet is already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet().catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, []);

  return {
    ...state,
    connectWallet,
    disconnect
  };
}
