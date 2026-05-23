import { create } from 'zustand';

interface AccountState {
  userId: string | null;
  name: string;
  email: string | null;
  address: string | null;
  depositAddress: string;
  isAuthenticated: boolean;
  isUnlocked: boolean;
  biometricEnabled: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  setDepositAddress: (address: string) => void;
  setAddress: (address: string) => void;
  setUnlocked: (isUnlocked: boolean) => void;
}

const DEMO_DEPOSIT_ADDRESS = '0x7F9A2dE81C3f4B6A9018bDd77e4936F21bC04291';

export const useAccountStore = create<AccountState>((set) => ({
  userId: null,
  name: 'Rex',
  email: null,
  address: DEMO_DEPOSIT_ADDRESS,
  depositAddress: DEMO_DEPOSIT_ADDRESS,
  isAuthenticated: false,
  isUnlocked: false,
  biometricEnabled: true,
  signIn: (email, name = 'Rex') =>
    set({
      userId: 'acct_cfy_demo',
      name,
      email,
      address: DEMO_DEPOSIT_ADDRESS,
      depositAddress: DEMO_DEPOSIT_ADDRESS,
      isAuthenticated: true,
      isUnlocked: true,
    }),
  signOut: () =>
    set({
      userId: null,
      email: null,
      isAuthenticated: false,
      isUnlocked: false,
    }),
  setDepositAddress: (depositAddress) => set({ depositAddress, address: depositAddress }),
  setAddress: (address) => set({ address, depositAddress: address }),
  setUnlocked: (isUnlocked) => set({ isUnlocked, isAuthenticated: isUnlocked }),
}));

export const useWalletStore = useAccountStore;
