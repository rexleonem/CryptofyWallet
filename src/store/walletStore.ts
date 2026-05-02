import { create } from 'zustand';

interface WalletState {
  address: string | null;
  isUnlocked: boolean;
  setAddress: (addr: string) => void;
  setUnlocked: (val: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isUnlocked: false,
  setAddress: (address) => set({ address }),
  setUnlocked: (isUnlocked) => set({ isUnlocked }),
}));
