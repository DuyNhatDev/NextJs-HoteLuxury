import { create } from 'zustand'

interface PriceStore {
  minPrice: number
  setMinPrice: (value: number) => void
}

export const usePriceStore = create<PriceStore>((set) => ({
  minPrice: 0,
  setMinPrice: (value) => set({ minPrice: value }),
}))
