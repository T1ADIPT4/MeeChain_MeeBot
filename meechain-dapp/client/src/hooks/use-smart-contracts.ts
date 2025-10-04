
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
      setState(prev => ({
        ...prev,
        meeBotMessage: 'กำลังเตรียมการเชื่อมต่อ... 🔄',
        isLoading: true
      }));

      let provider: any;
      let address: string;
      let isDemoMode = false;

      // Try MetaMask/Ethereum wallet first
      if (window.ethereum) {
        setState(prev => ({
          ...prev,
          meeBotMessage: 'กำลังเชื่อม MetaMask... 🦊'
        }));
        
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        address = await signer.getAddress();
      } else {
        // Fallback to demo mode
        setState(prev => ({
          ...prev,
          meeBotMessage: 'เข้าสู่โหมดทดลองใช้... 🎮'
        }));
        
        isDemoMode = true;
        // Create a mock wallet for demo
        const mockWallet = ethers.Wallet.createRandom();
        address = mockWallet.address;
        provider = null;
        
        if (showToast) {
          toast({
            title: "🎮 โหมดทดลองใช้",
            description: "เข้าสู่โหมดทดลองสำหรับ Development - ข้อมูลเป็น Mock Data",
            variant: "default",
          });
        }
      }

      const service = new SmartContractService(provider ? await provider.getSigner() : null);
      
      // ตรวจสอบสุขภาพของ contracts
      let health;
      try {
        health = await service.validateContracts();
      } catch (error) {
        // Mock health data for demo mode
        health = {
          tokenContract: isDemoMode,
          membershipNFT: isDemoMode,
          badgeNFT: isDemoMode,
          rpcConnected: isDemoMode
        };
      }
      
      setState(prev => ({
        ...prev,
        service,
        isConnected: true,
        userAddress: address,
        isLoading: false,
        error: null,
        contractsHealth: health,
        meeBotMessage: isDemoMode ? 
          'เข้าสู่โหมดทดลองใช้สำเร็จ! 🎮 ข้อมูลทั้งหมดเป็น Mock Data ครับ' :
          health.rpcConnected ? 
            'เชื่อมต่อสำเร็จแล้วครับ! พร้อมลุยได้เลย! 🚀' : 
            'เชื่อม wallet สำเร็จ แต่มีปัญหากับ contracts ครับ 🤔'
      }));

      if (showToast && !isDemoMode) {
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
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet(false); // ไม่แสดง toast สำหรับ auto connect
        }
      } else {
        // Auto connect to demo mode if no wallet
        setState(prev => ({
          ...prev,
          meeBotMessage: 'พร้อมใช้งานในโหมดทดลอง! กดปุ่ม Connect เพื่อเริ่มต้น 🎮'
        }));
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
      error: null,
      contractsHealth: null,
      meeBotMessage: 'ระบบพร้อมแล้วครับ! กดเชื่อม wallet ได้เลย 😊'
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
