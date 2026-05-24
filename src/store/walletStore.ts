import { create } from 'zustand';

interface AccountState {
  userId: string | null;
  name: string;
  email: string | null;
  address: string | null;
  depositAddress: string | null;
  isAuthenticated: boolean;
  isUnlocked: boolean;
  biometricEnabled: boolean;
  signIn: (email?: string | null, name?: string) => void;
  signOut: () => void;
  setDepositAddress: (address: string | null) => void;
  setAddress: (address: string | null) => void;
  setUnlocked: (isUnlocked: boolean) => void;
}

const DEFAULT_ACCOUNT_NAME = 'there';

export const useAccountStore = create<AccountState>((set) => ({
  userId: null,
  name: DEFAULT_ACCOUNT_NAME,
  email: null,
  address: null,
  depositAddress: null,
  isAuthenticated: false,
  isUnlocked: false,
  biometricEnabled: true,
  signIn: (email, name = DEFAULT_ACCOUNT_NAME) =>
    set({
      userId: `acct_${Date.now()}`,
      name: name.trim() || DEFAULT_ACCOUNT_NAME,
      email: email || null,
      address: null,
      depositAddress: null,
      isAuthenticated: true,
      isUnlocked: true,
    }),
  signOut: () =>
    set({
      userId: null,
      email: null,
      name: DEFAULT_ACCOUNT_NAME,
      address: null,
      depositAddress: null,
      isAuthenticated: false,
      isUnlocked: false,
    }),
  setDepositAddress: (depositAddress) => set({ depositAddress, address: depositAddress }),
  setAddress: (address) => set({ address, depositAddress: address }),
  setUnlocked: (isUnlocked) => set({ isUnlocked, isAuthenticated: isUnlocked }),
}));

export const useWalletStore = useAccountStore;
