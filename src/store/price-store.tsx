import { create } from 'zustand'

interface PriceStoreType {
  minPrice: number
  setMinPrice: (value: number) => void
}

export const usePriceStore = create<PriceStoreType>((set) => ({
  minPrice: 0,
  setMinPrice: (value) => set({ minPrice: value }),
}))
