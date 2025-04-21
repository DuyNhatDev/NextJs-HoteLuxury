'use client'
import { extractHotelName } from '@/lib/utils'
import { useGetFilterHotelList } from '@/queries/useFilter'
import { useGetHotel } from '@/queries/useHotel'
import { HotelType } from '@/schemaValidations/hotel.schema'
import { useFilterStore } from '@/store/filter-store'
import { useParams } from 'next/navigation'

export default function HotelInfo() {
  const filter = useFilterStore((state) => state.filter)
  const params = useParams()
  const { data } = useGetFilterHotelList({
    ...filter,
    hotelStar: [],
    hotelType: [],
    filter: extractHotelName(params.hotel as string),
  })
  const result: HotelType | undefined = data?.payload?.data[0]
  const hotelId = result?.hotelId
  const hotelQuery = useGetHotel(String(hotelId), !!hotelId)
  const hotelData = hotelQuery?.data?.payload?.data
  return (
    <div>
      <h1>{hotelData?.hotelName}</h1>
    </div>
  )
}
