
import { create } from 'zustand';

interface MeeBotStatusState {
  status: 'idle' | 'waiting' | 'success' | 'error';
  message: string;
  setStatus: (status: 'idle' | 'waiting' | 'success' | 'error') => void;
  setMessage: (message: string) => void;
}

export const useMeeBotStatus = create<MeeBotStatusState>((set) => ({
  status: 'idle',
  message: '',
  setStatus: (status) => set({ status }),
  setMessage: (message) => set({ message }),
}));
