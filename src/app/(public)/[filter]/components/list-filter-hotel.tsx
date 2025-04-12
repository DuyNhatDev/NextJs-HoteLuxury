'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import { extractLocationName, generateSlugUrl } from '@/lib/utils'
import { useGetFilterHotelList } from '@/queries/useSearch'
import { FilterParamsType } from '@/schemaValidations/search.schema'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ListFilterHotel({ filterParams }: { filterParams: FilterParamsType }) {
  const params = useParams()
  const rawFilter = extractLocationName(params.filter as string)
  const effectiveFilter = filterParams.filter?.trim() ? filterParams.filter : rawFilter
  const hotelFilterListQuery = useGetFilterHotelList({
    ...filterParams,
    filter: effectiveFilter,
  })
  const hotelFilterList = hotelFilterListQuery.data?.payload?.data || []
  const outOfRoomList = hotelFilterListQuery.data?.payload?.outOfRoom || []
  const fullHotelList = [...hotelFilterList, ...outOfRoomList]

  return (
    <div className="w-full">
      {fullHotelList.length === 0 ? (
        <p className="px-4 py-2 text-center text-lg">Không tìm thấy khách sạn phù hợp</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {fullHotelList.map((hotel) => {
              const slug = generateSlugUrl(hotel.hotelName)
              const href = `${params.filter as string}/${slug}-chi-tiet`
              return (
                <Link key={hotel.hotelId} href={href} className="w-full">
                  <Card className="grid w-full grid-cols-10 gap-3 rounded border p-4 hover:border-blue-500 hover:shadow-md">
                    <div className="relative col-span-3 -m-4 h-[180px] w-full overflow-hidden rounded">
                      <Image
                        src={hotel.hotelImage || '/placeholder.jpg'}
                        alt={hotel.hotelName || ''}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <CardContent className="col-span-5 flex flex-col justify-between gap-1 px-0 py-0">
                      <div className="flex flex-1 flex-col gap-2">
                        <div>
                          <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
                            {hotel.hotelName}
                          </h3>
                          <Rating
                            rating={hotel.hotelStar || 0}
                            size={22}
                            variant="yellow"
                            showText={false}
                            disabled={true}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-2 h-6 w-6 text-red-500" />
                            <span className="font-medium">{hotel.hotelAddress}</span>
                          </div>
                          <div className="inline-block rounded px-2 py-1 text-sm">
                            <Badge variant="secondary" className='py-1'>{hotel.hotelType}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <div className="col-span-2 flex items-center justify-end">
                      <p className="text-lg font-semibold text-green-600">
                        {Number(hotel.minPrice).toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
