import { addDays } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingInfoType {
  hotelName: string
  hotelAddress: string
  dayStart: Date
  dayEnd: Date
  roomTypeName: string
  adultQuantity: number
  childQuantity: number
  currentRooms: number
}

interface BookingInfoStoreType {
  booking: BookingInfoType
  setBooking: (data: Partial<BookingInfoType>) => void
  resetBooking: () => void
  isHydrated: boolean
  setHydrated: () => void
}

const defaultBooking: BookingInfoType = {
  hotelName: '',
  hotelAddress: '',
  dayStart: new Date(),
  dayEnd: addDays(new Date(), 1),
  roomTypeName: '',
  adultQuantity: 2,
  childQuantity: 0,
  currentRooms: 1,
}

export const useBookingStore = create(
  persist<BookingInfoStoreType>(
    (set) => ({
      booking: defaultBooking,
      setBooking: (data) =>
        set((state) => ({
          booking: { ...state.booking, ...data },
        })),
      resetBooking: () => set({ booking: defaultBooking }),
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'booking-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as BookingInfoStoreType
        return {
          ...currentState,
          booking: {
            ...state.booking,
            dayStart: new Date(state.booking.dayStart),
            dayEnd: new Date(state.booking.dayEnd),
          },
        }
      },
    }
  )
)
