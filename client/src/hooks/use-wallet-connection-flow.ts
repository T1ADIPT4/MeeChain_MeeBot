
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

export type ConnectionState = 
  | 'idle' 
  | 'intent-prompt' 
  | 'requesting' 
  | 'connected' 
  | 'rejected' 
  | 'error' 
  | 'preview-mode';

export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | 'preview';

interface MeeBotReaction {
  emoji: string;
  message: string;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'secondary' | 'destructive';
  }>;
}

interface WalletConnectionFlowState {
  state: ConnectionState;
  provider: WalletProvider | null;
  address: string | null;
  isConnected: boolean;
  meeBotReaction: MeeBotReaction | null;
  questProgress: {
    step: number;
    total: number;
    completed: boolean;
  };
}

export function useWalletConnectionFlow() {
  const { toast } = useToast();
  const [flowState, setFlowState] = useState<WalletConnectionFlowState>({
    state: 'idle',
    provider: null,
    address: null,
    isConnected: false,
    meeBotReaction: null,
    questProgress: {
      step: 1,
      total: 5,
      completed: false
    }
  });

  // MeeBot reactions for different states
  const meeBotReactions = {
    welcome: {
      emoji: '🎯',
      message: 'สวัสดีครับ! เพื่อเริ่มภารกิจแรก เราต้องเชื่อมต่อ wallet ของคุณนะครับ',
      actions: [
        {
          label: 'เชื่อมต่อเลย',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        },
        {
          label: 'ดูตัวอย่างก่อน',
          action: () => enablePreviewMode(),
          variant: 'secondary' as const
        }
      ]
    },
    requesting: {
      emoji: '🔄',
      message: 'กำลังเชื่อมต่อ wallet ของคุณ... โปรดตรวจสอบใน wallet app ครับ',
      actions: []
    },
    connected: {
      emoji: '🎉',
      message: 'เยี่ยมมาก! เชื่อมต่อสำเร็จแล้ว ตอนนี้คุณได้รับ badge แรกของคุณแล้ว!',
      actions: [
        {
          label: 'ไปขั้นต่อไป',
          action: () => completeQuest(),
          variant: 'default' as const
        }
      ]
    },
    rejected: {
      emoji: '😅',
      message: 'คุณปฏิเสธคำขอเชื่อมต่อ ไม่เป็นไร ลองใหม่อีกครั้งไหมครับ?',
      actions: [
        {
          label: 'ลองใหม่',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        },
        {
          label: 'ใช้โหมดตัวอย่าง',
          action: () => enablePreviewMode(),
          variant: 'secondary' as const
        }
      ]
    },
    error: {
      emoji: '🚨',
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ wallet ลองใช้โหมดตัวอย่างไหมครับ?',
      actions: [
        {
          label: 'ลองใหม่',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        },
        {
          label: 'โหมดตัวอย่าง',
          action: () => enablePreviewMode(),
          variant: 'secondary' as const
        }
      ]
    },
    preview: {
      emoji: '👀',
      message: 'คุณอยู่ในโหมดตัวอย่าง สามารถดู flow ทั้งหมดได้โดยไม่ต้องเชื่อม wallet จริง',
      actions: [
        {
          label: 'เชื่อม wallet จริง',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        }
      ]
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    showIntentPrompt();
  }, []);

  // Auto-check for existing connections
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const showIntentPrompt = () => {
    setFlowState(prev => ({
      ...prev,
      state: 'intent-prompt',
      meeBotReaction: meeBotReactions.welcome
    }));
  };

  const checkExistingConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const address = accounts[0].address;
          setFlowState(prev => ({
            ...prev,
            state: 'connected',
            provider: 'metamask',
            address,
            isConnected: true,
            questProgress: { ...prev.questProgress, completed: true },
            meeBotReaction: {
              emoji: '✅',
              message: 'Wallet ของคุณเชื่อมต่ออยู่แล้วครับ! พร้อมเริ่มภารกิจได้เลย',
              actions: []
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const requestWalletAccess = async () => {
    setFlowState(prev => ({
      ...prev,
      state: 'requesting',
      meeBotReaction: meeBotReactions.requesting
    }));

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setFlowState(prev => ({
        ...prev,
        state: 'connected',
        provider: 'metamask',
        address,
        isConnected: true,
        questProgress: { ...prev.questProgress, completed: true },
        meeBotReaction: meeBotReactions.connected
      }));

      toast({
        title: "🎉 MeeBot แจ้ง",
        description: "เชื่อมต่อ wallet สำเร็จ! รับ badge แรกแล้ว",
      });

    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      if (error.code === 4001) {
        // User rejected request
        setFlowState(prev => ({
          ...prev,
          state: 'rejected',
          meeBotReaction: meeBotReactions.rejected
        }));
      } else {
        // Other errors
        setFlowState(prev => ({
          ...prev,
          state: 'error',
          meeBotReaction: meeBotReactions.error
        }));

        toast({
          title: "❌ MeeBot เสียใจ",
          description: `ไม่สามารถเชื่อมต่อได้: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const enablePreviewMode = () => {
    // Generate mock address for preview
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    setFlowState(prev => ({
      ...prev,
      state: 'preview-mode',
      provider: 'preview',
      address: mockAddress,
      isConnected: false, // Not really connected
      questProgress: { ...prev.questProgress, completed: true },
      meeBotReaction: meeBotReactions.preview
    }));

    toast({
      title: "🎮 MeeBot แจ้ง",
      description: "เข้าสู่โหมดตัวอย่าง - ข้อมูลทั้งหมดเป็น mock data",
    });
  };

  const completeQuest = async () => {
    // Mark quest as completed via API
    try {
      const response = await fetch('/api/mission/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          missionId: 'wallet_connection',
          proof: {
            address: flowState.address,
            provider: flowState.provider,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        toast({
          title: "🏆 ภารกิจสำเร็จ!",
          description: "คุณได้รับ 100 MEE token และ badge 'Wallet Master'",
        });
      }
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  };

  const disconnect = () => {
    setFlowState({
      state: 'idle',
      provider: null,
      address: null,
      isConnected: false,
      meeBotReaction: null,
      questProgress: {
        step: 1,
        total: 5,
        completed: false
      }
    });
    
    setTimeout(() => showIntentPrompt(), 500);
  };

  const retry = () => {
    requestWalletAccess();
  };

  return {
    ...flowState,
    actions: {
      requestWalletAccess,
      enablePreviewMode,
      completeQuest,
      disconnect,
      retry,
      showIntentPrompt
    }
  };
}
