import { SearchType } from '@/schemaValidations/search.schema'
import { addDays } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchStoreType {
  search: SearchType
  setSearch: (data: Partial<SearchType>) => void
  resetSearch: () => void
}

const defaultSearch: SearchType = {
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
      search: defaultSearch,
      setSearch: (data) =>
        set((state) => ({
          search: { ...state.search, ...data },
        })),
      resetSearch: () => set({ search: defaultSearch }),
    }),
    {
      name: 'search-storage',
    }
  )
)
