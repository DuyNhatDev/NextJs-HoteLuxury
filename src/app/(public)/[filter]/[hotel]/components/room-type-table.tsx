'use client'
import { useGetFilterRoomTypeList } from '@/queries/useRoomType'
import { FilterRoomTypeType } from '@/schemaValidations/room-type.schema'
import { useEffect } from 'react'

interface RoomTypeTableProps {
  params: FilterRoomTypeType
  onSendMinPrice: (minPrice: number) => void
}

export default function RoomTypeTable({ params, onSendMinPrice }: RoomTypeTableProps) {
  const roomTypeFilterListQuery = useGetFilterRoomTypeList(params)
  const roomTypeList = roomTypeFilterListQuery.data?.payload?.data || []
  const minPrice = roomTypeFilterListQuery.data?.payload?.minPrice || 0

  useEffect(() => {
    onSendMinPrice(minPrice)
  }, [minPrice, onSendMinPrice])

  return (
    <div>
      <h1>RoomType Table</h1>
    </div>
  )
}
