import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OrderStoreType = {
  bookingId: number
  setBookingId: (value: number) => void
}

export const useOrderStore = create<OrderStoreType>()(
  persist(
    (set) => ({
      bookingId: 0,
      setBookingId: (value) => set({ bookingId: value })
    }),
    {
      name: 'order-storage'
    }
  )
)
