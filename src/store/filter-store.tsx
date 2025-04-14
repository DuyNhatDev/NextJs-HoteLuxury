import { FilterType } from '@/schemaValidations/filter.schema'
import { addDays } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchStoreType {
  filter: FilterType
  setFilter: (data: Partial<FilterType>) => void
  resetFilter: () => void
}

const defaultSearch: FilterType = {
  dayStart: new Date(),
  dayEnd: addDays(new Date(), 1),
  filter: '',
  adultQuantity: 2,
  childQuantity: 0,
  currentRooms: 1,
}

export const useSearchStore = create(
  persist<SearchStoreType>(
    (set) => ({
      filter: defaultSearch,
      setFilter: (data) =>
        set((state) => ({
          filter: { ...state.filter, ...data },
        })),
      resetFilter: () => set({ filter: defaultSearch }),
    }),
    {
      name: 'filter-storage',
      merge: (persistedState, currentState) => {
        const state = persistedState as SearchStoreType
        return {
          ...currentState,
          filter: {
            ...state.filter,
            dayStart: new Date(state.filter.dayStart),
            dayEnd: new Date(state.filter.dayEnd),
          },
        }
      },
    }
  )
)
