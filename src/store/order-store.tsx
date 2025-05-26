import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Order = {
  bookingId: number
  status: string
}

type OrderStoreType = {
  order: Order
  setOrder: (data: Partial<Order>) => void
}

const defaultOrder: Order = {
  bookingId: 0,
  status: ''
}

export const useOrderStore = create<OrderStoreType>()(
  persist(
    (set) => ({
      order: defaultOrder,
      setOrder: (data) =>
        set((state) => ({
          order: { ...state.order, ...data }
        }))
    }),
    {
      name: 'order-storage'
    }
  )
)
