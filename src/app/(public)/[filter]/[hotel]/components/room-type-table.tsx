'use client'
import { useGetFilterRoomTypeList } from '@/queries/useRoomType'
import { FilterRoomTypeType } from '@/schemaValidations/room-type.schema'

export default function RoomTypeTable({ params }: { params: FilterRoomTypeType }) {
  const roomTypeFilterListQuery = useGetFilterRoomTypeList(params)
  const roomTypeList = roomTypeFilterListQuery.data?.payload?.data || []
  const minPrice = roomTypeFilterListQuery.data?.payload?.minPrice || 0
  return (
    <div>
      <h1>RoomType Table</h1>
    </div>
  )
}
