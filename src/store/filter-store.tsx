import { FilterType } from '@/schemaValidations/filter.schema'
import { addDays } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterStoreType {
  filter: FilterType
  setFilter: (data: Partial<FilterType>) => void
  resetFilter: () => void
  isHydrated: boolean
  setHydrated: () => void
}

const defaultFilter: FilterType = {
  dayStart: new Date(),
  dayEnd: addDays(new Date(), 1),
  filter: '',
  adultQuantity: 2,
  childQuantity: 0,
  currentRooms: 1
}

export const useFilterStore = create(
  persist<FilterStoreType>(
    (set) => ({
      filter: defaultFilter,
      setFilter: (data) =>
        set((state) => ({
          filter: { ...state.filter, ...data }
        })),
      resetFilter: () => set({ filter: defaultFilter }),
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true })
    }),
    {
      name: 'filter-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as FilterStoreType
        return {
          ...currentState,
          filter: {
            ...state.filter,
            dayStart: new Date(state.filter.dayStart),
            dayEnd: new Date(state.filter.dayEnd)
          }
        }
      }
    }
  )
)
