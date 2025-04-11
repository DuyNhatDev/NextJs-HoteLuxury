'use client'
import { useSearchStore } from '@/store/search-store'

export default function ListFilterHotel() {
  const search = useSearchStore((state) => state.search)
  console.log(search)
  return (
    <div>
      <h1>hi</h1>
    </div>
  )
}
