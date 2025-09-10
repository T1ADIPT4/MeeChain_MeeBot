
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SmartContractService from '@/lib/smart-contract-integration';
import { useToast } from '@/hooks/use-toast';

interface ContractState {
  service: SmartContractService | null;
  isConnected: boolean;
  userAddress: string | null;
  isLoading: boolean;
  error: string | null;
  contractsHealth: {
    tokenContract: boolean;
    membershipNFT: boolean;
    badgeNFT: boolean;
    rpcConnected: boolean;
  } | null;
  meeBotMessage: string;
}

export function useSmartContracts() {
  const { toast } = useToast();
  const [state, setState] = useState<ContractState>({
    service: null,
    isConnected: false,
    userAddress: null,
    isLoading: true,
    error: null,
    contractsHealth: null,
    meeBotMessage: 'กำลังเตรียมระบบให้คุณครับ... 🤖'
  });

  const connectWallet = async (showToast = true) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      setState(prev => ({
        ...prev,
        meeBotMessage: 'กำลังเชื่อม MetaMask... 🦊',
        isLoading: true
      }));

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const service = new SmartContractService(signer);
      
      // ตรวจสอบสุขภาพของ contracts
      const health = await service.validateContracts();
      
      setState(prev => ({
        ...prev,
        service,
        isConnected: true,
        userAddress: address,
        isLoading: false,
        error: null,
        contractsHealth: health,
        meeBotMessage: health.rpcConnected ? 
          'เชื่อมต่อสำเร็จแล้วครับ! พร้อมลุยได้เลย! 🚀' : 
          'เชื่อม wallet สำเร็จ แต่มีปัญหากับ contracts ครับ 🤔'
      }));

      if (showToast) {
        if (health.rpcConnected && health.badgeNFT) {
          toast({
            title: "🤖 MeeBot บอกว่า",
            description: "เชื่อมต่อสำเร็จแล้วครับ! พร้อม mint badge และทำภารกิจได้เลย!",
            variant: "default",
          });
        } else {
          toast({
            title: "⚠️ MeeBot แจ้งเตือน",
            description: "เชื่อม wallet สำเร็จ แต่บาง contracts ยังไม่พร้อม",
            variant: "destructive",
          });
        }
      }

      return { service, address, health };
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
        meeBotMessage: `เกิดข้อผิดพลาดครับ: ${error.message} 😢`
      }));
      
      if (showToast) {
        toast({
          title: "❌ MeeBot เสียใจ",
          description: `ไม่สามารถเชื่อม wallet ได้: ${error.message}`,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const checkContractsHealth = async () => {
    if (!state.service) return;
    
    try {
      setState(prev => ({
        ...prev,
        meeBotMessage: 'กำลังตรวจสอบ contracts... 🔍',
        isLoading: true
      }));

      const health = await state.service.validateContracts();
      
      setState(prev => ({
        ...prev,
        contractsHealth: health,
        isLoading: false,
        meeBotMessage: health.rpcConnected ? 
          'ทุกอย่างพร้อมแล้วครับ! 💚' : 
          'พบปัญหาบาง contracts ครับ 🔧'
      }));

      return health;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        meeBotMessage: 'ไม่สามารถตรวจสอบ contracts ได้ครับ 😅'
      }));
    }
  };

  const autoConnectWallet = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet(false); // ไม่แสดง toast สำหรับ auto connect
      }
    } catch (error) {
      console.error('Auto connect failed:', error);
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
    const initializeService = async () => {
      // Initialize read-only service
      const service = new SmartContractService();
      
      setState(prev => ({
        ...prev,
        service,
        isLoading: false,
        meeBotMessage: 'ระบบพร้อมแล้วครับ! กดเชื่อม wallet ได้เลย 😊'
      }));

      // Auto connect wallet if previously connected
      await autoConnectWallet();
      
      // Initial health check
      if (service) {
        try {
          const health = await service.validateContracts();
          setState(prev => ({
            ...prev,
            contractsHealth: health
          }));
        } catch (error) {
          console.error('Initial health check failed:', error);
        }
      }
    };

    initializeService();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          autoConnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return {
    ...state,
    connectWallet,
    disconnect,
    checkContractsHealth,
    autoConnectWallet
  };
}
