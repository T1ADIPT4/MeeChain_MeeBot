
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
  const [rejectionCount, setRejectionCount] = useState(0);
  const [requestTimeout, setRequestTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
      message: '🎮 Quest #1: Connect Wallet to Unlock Your First Badge! เชื่อมต่อ wallet เพื่อปลดล็อก badge แรกของคุณครับ!',
      actions: [
        {
          label: '🚀 เริ่มภารกิจ',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        },
        {
          label: '👀 ดูตัวอย่างก่อน',
          action: () => enablePreviewMode(),
          variant: 'secondary' as const
        }
      ]
    },
    requesting: {
      emoji: '🔄',
      message: 'กำลังรอการอนุญาตจาก wallet... กรุณาตรวจสอบ popup หรือ wallet app และกดยอมรับครับ 🔐',
      actions: [
        {
          label: 'ยกเลิก',
          action: () => cancelWalletRequest(),
          variant: 'secondary' as const
        }
      ]
    },
    connected: {
      emoji: '🏆',
      message: '🎉 Quest Complete! เชื่อมต่อสำเร็จแล้ว! คุณได้รับ badge "Wallet Master" และ 100 MEE tokens!',
      actions: [
        {
          label: '✨ รับรางวัล',
          action: () => completeQuest(),
          variant: 'default' as const
        }
      ]
    },
    rejected: {
      emoji: '😅',
      message: 'ดูเหมือนคุณปฏิเสธคำขอ ไม่เป็นไรครับ! มาลองใหม่กันเพื่อปลดล็อก badge แรกไหม?',
      actions: [
        {
          label: '🔄 ขออนุญาตเชื่อมต่อ wallet อีกครั้ง',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        },
        {
          label: '👀 ใช้โหมดตัวอย่าง',
          action: () => enablePreviewMode(),
          variant: 'secondary' as const
        }
      ]
    },
    multipleRejects: {
      emoji: '🤔',
      message: 'MeeBot เข้าใจแล้วครับ บางทีคุณอาจยังไม่พร้อม ลองดูตัวอย่าง flow ก่อนไหม? หรือตรวจสอบว่า wallet พร้อมใช้งานแล้ว',
      actions: [
        {
          label: '🛠️ ตรวจสอบ wallet',
          action: () => showWalletTroubleshooting(),
          variant: 'secondary' as const
        },
        {
          label: '👀 โหมดตัวอย่าง',
          action: () => enablePreviewMode(),
          variant: 'default' as const
        }
      ]
    },
    error: {
      emoji: '🚨',
      message: 'MeeBot ล้มเหลวในการเชื่อมต่อ wallet 😔 อาจเป็นเพราะ wallet ยังไม่พร้อม หรือเครือข่ายมีปัญหา ลองตัวอย่างก่อนไหมครับ?',
      actions: [
        {
          label: '🔧 แนะนำวิธีแก้ไข',
          action: () => showTroubleshooting(),
          variant: 'secondary' as const
        },
        {
          label: '👀 โหมดตัวอย่าง',
          action: () => enablePreviewMode(),
          variant: 'default' as const
        }
      ]
    },
    preview: {
      emoji: '🎮',
      message: 'คุณอยู่ในโหมดตัวอย่าง! สามารถสำรวจทุกฟีเจอร์ได้โดยไม่ต้องเชื่อม wallet จริง เมื่อไหร่พร้อมก็กลับมาเชื่อมได้นะครับ',
      actions: [
        {
          label: '🔗 เชื่อม wallet จริง',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        }
      ]
    },
    troubleshooting: {
      emoji: '🔧',
      message: 'วิธีแก้ปัญหา wallet: 1) ตรวจสอบว่าติดตั้ง MetaMask แล้ว 2) ปลดล็อค wallet 3) อนุญาต popup 4) เชื่อมต่ออินเทอร์เน็ตแล้ว',
      actions: [
        {
          label: '✅ ลองเชื่อมต่อใหม่',
          action: () => requestWalletAccess(),
          variant: 'default' as const
        },
        {
          label: '👀 โหมดตัวอย่าง',
          action: () => enablePreviewMode(),
          variant: 'secondary' as const
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
    // Clear any existing timeout
    if (requestTimeout) {
      clearTimeout(requestTimeout);
      setRequestTimeout(null);
    }

    setFlowState(prev => ({
      ...prev,
      state: 'requesting',
      meeBotReaction: meeBotReactions.requesting
    }));

    // Set timeout for wallet request (30 seconds)
    const timeout = setTimeout(() => {
      setFlowState(prev => ({
        ...prev,
        state: 'error',
        meeBotReaction: {
          ...meeBotReactions.error,
          message: 'คำขอเชื่อมต่อ wallet หมดเวลา อาจเป็นเพราะ popup ถูกบล็อค หรือ wallet ไม่ตอบสนอง'
        }
      }));
    }, 30000);

    setRequestTimeout(timeout);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask หรือ wallet อื่นๆ ยังไม่ได้ติดตั้ง กรุณาติดตั้ง MetaMask ก่อนครับ');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Add a small delay to prevent rapid-fire requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await provider.send("eth_requestAccounts", []);
      
      // Clear timeout on success
      clearTimeout(timeout);
      setRequestTimeout(null);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Reset rejection counter on successful connection
      setRejectionCount(0);

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
        title: "🏆 Quest Complete!",
        description: "เชื่อมต่อ wallet สำเร็จ! รับ badge 'Wallet Master' และ 100 MEE tokens",
      });

    } catch (error: any) {
      // Clear timeout on error
      clearTimeout(timeout);
      setRequestTimeout(null);
      
      console.error('Wallet connection error:', error);
      
      if (error.code === 4001) {
        // User rejected request
        const newRejectionCount = rejectionCount + 1;
        setRejectionCount(newRejectionCount);
        
        // Show different message after multiple rejections
        if (newRejectionCount >= 3) {
          setFlowState(prev => ({
            ...prev,
            state: 'rejected',
            meeBotReaction: meeBotReactions.multipleRejects
          }));
        } else {
          setFlowState(prev => ({
            ...prev,
            state: 'rejected',
            meeBotReaction: meeBotReactions.rejected
          }));
        }

        toast({
          title: "😅 MeeBot เข้าใจ",
          description: `คำขอถูกปฏิเสธ (${newRejectionCount}/3) - ลองใหม่หรือใช้โหมดตัวอย่างได้ครับ`,
        });
        
      } else {
        // Other errors
        setFlowState(prev => ({
          ...prev,
          state: 'error',
          meeBotReaction: meeBotReactions.error
        }));

        toast({
          title: "🚨 MeeBot พบปัญหา",
          description: error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ wallet",
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

  const cancelWalletRequest = () => {
    if (requestTimeout) {
      clearTimeout(requestTimeout);
      setRequestTimeout(null);
    }
    
    setFlowState(prev => ({
      ...prev,
      state: 'idle',
      meeBotReaction: {
        emoji: '🤖',
        message: 'ยกเลิกคำขอเชื่อมต่อแล้ว พร้อมลองใหม่เมื่อไหร่ก็ได้ครับ',
        actions: [
          {
            label: '🔄 ลองใหม่',
            action: () => requestWalletAccess(),
            variant: 'default' as const
          },
          {
            label: '👀 โหมดตัวอย่าง',
            action: () => enablePreviewMode(),
            variant: 'secondary' as const
          }
        ]
      }
    }));
  };

  const showWalletTroubleshooting = () => {
    setFlowState(prev => ({
      ...prev,
      state: 'error',
      meeBotReaction: {
        emoji: '🛠️',
        message: 'เช็คลิสต์ wallet: ✅ ติดตั้ง MetaMask แล้ว ✅ ปลดล็อค wallet ✅ อนุญาต popup ✅ เชื่อมอินเทอร์เน็ต ✅ รีเฟรชหน้าเว็บ',
        actions: [
          {
            label: '✅ พร้อมแล้ว ลองใหม่',
            action: () => requestWalletAccess(),
            variant: 'default' as const
          },
          {
            label: '👀 โหมดตัวอย่าง',
            action: () => enablePreviewMode(),
            variant: 'secondary' as const
          }
        ]
      }
    }));
  };

  const showTroubleshooting = () => {
    setFlowState(prev => ({
      ...prev,
      state: 'error',
      meeBotReaction: meeBotReactions.troubleshooting
    }));
  };

  const retry = () => {
    requestWalletAccess();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (requestTimeout) {
        clearTimeout(requestTimeout);
      }
    };
  }, [requestTimeout]);

  return {
    ...flowState,
    rejectionCount,
    actions: {
      requestWalletAccess,
      enablePreviewMode,
      completeQuest,
      disconnect,
      retry,
      showIntentPrompt,
      cancelWalletRequest,
      showWalletTroubleshooting,
      showTroubleshooting
    }
  };
}
