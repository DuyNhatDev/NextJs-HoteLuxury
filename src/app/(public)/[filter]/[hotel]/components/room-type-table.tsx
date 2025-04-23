'use client'
import { useGetFilterRoomTypeList } from '@/queries/useRoomType'
import { FilterRoomTypeType } from '@/schemaValidations/room-type.schema'
import { usePriceStore } from '@/store/price-store'
import { useEffect } from 'react'

interface RoomTypeTableProps {
  params: FilterRoomTypeType
}

export default function RoomTypeTable({ params }: RoomTypeTableProps) {
  const setMinPrice = usePriceStore((state) => state.setMinPrice)
  const roomTypeFilterListQuery = useGetFilterRoomTypeList(params)
  const roomTypeList = roomTypeFilterListQuery.data?.payload?.data || []
  const price = roomTypeFilterListQuery.data?.payload?.minPrice || 0
  useEffect(() => {
    setMinPrice(price)
  }, [price, setMinPrice])
  return (
    <div>
      <h1>RoomType Table</h1>
    </div>
  )
}
