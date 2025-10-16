import { create } from 'zustand';

interface AppState {
  isMuted: boolean;
  toggleMute: () => void;
  currentFlow: 'sales' | 'training' | 'training-final';
  setCurrentFlow: (flow: 'sales' | 'training' | 'training-final') => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  currentFlow: 'sales',
  setCurrentFlow: (flow) => set({ currentFlow: flow }),
}));
