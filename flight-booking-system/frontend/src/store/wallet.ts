import { create } from 'zustand';

interface WalletState {
  balance: number;
  deduct: (amount: number) => void;
  setBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 50000, // Initial balance
  deduct: (amount) => set((state) => ({ balance: state.balance - amount })),
  setBalance: (balance) => set({ balance }),
}));
