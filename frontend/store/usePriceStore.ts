import { create } from 'zustand';

interface Prices {
  gold24k: number;
  gold22k: number;
  silver: number;
  lastUpdated: string | null;
}

interface PriceState {
  prices: Prices | null;
  isLoading: boolean;
  error: string | null;
  setPrices: (prices: Prices) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  prices: null,
  isLoading: false,
  error: null,
  setPrices: (prices) => set({ prices, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
