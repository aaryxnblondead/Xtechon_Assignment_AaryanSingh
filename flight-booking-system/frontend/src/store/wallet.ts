import { create } from "zustand";
import { getWalletBalance } from "@/services/api";
import { useAuthStore } from "./auth";

interface WalletState {
  balance: number;
  fetchBalance: () => void;
  deduct: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  fetchBalance: async () => {
    const token = useAuthStore.getState().token;
    if (token) {
      try {
        const balance = await getWalletBalance(token);
        set({ balance });
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
      }
    }
  },
  deduct: (amount) => set((state) => ({ balance: state.balance - amount })),
}));
