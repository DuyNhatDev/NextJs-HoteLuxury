'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Rating } from '@/components/customize/rating'
import { extractLocationName, generateSlugUrl } from '@/lib/utils'
import { useGetFilterHotelList } from '@/queries/useFilter'
import { FilterParamsType } from '@/schemaValidations/filter.schema'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

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

  const [visibleCount, setVisibleCount] = useState(10)

  const visibleHotelList = fullHotelList.slice(0, visibleCount)
  const hotelsRemaining = Math.max(fullHotelList.length - visibleCount, 0)

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  return (
    <div className="w-full">
      {hotelFilterListQuery.isPending ? (
        <div className="flex items-center justify-center py-8">
          <Spinner>Đang tải...</Spinner>
        </div>
      ) : fullHotelList.length === 0 ? (
        <p className="px-4 py-8 text-center text-lg">Không tìm thấy khách sạn phù hợp</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {visibleHotelList.map((hotel) => {
              const slug = generateSlugUrl(hotel.hotelName)
              const href = `${params.filter as string}/${slug}-chi-tiet`
              return (
                <Link key={hotel.hotelId} href={href} className="w-full">
                  <Card className="grid w-full transform grid-cols-10 gap-3 rounded border p-0 transition-transform duration-200 ease-in-out hover:scale-101 hover:border-blue-500 hover:shadow-md">
                    <div className="relative col-span-3 aspect-[3/2] h-full w-full overflow-hidden">
                      <Image
                        src={hotel.hotelImage}
                        alt={hotel.hotelName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <CardContent className="col-span-5 flex flex-col justify-between gap-1 px-0 py-0">
                      <div className="flex flex-1 flex-col gap-2 px-1 py-3">
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
                            <Badge variant="secondary" className="py-1">
                              {hotel.hotelType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <div className="col-span-2 flex items-center justify-end px-3">
                      {hotel.minPrice ? (
                        <p className="text-lg font-semibold text-green-600">
                          {Number(hotel.minPrice).toLocaleString('vi-VN')} VND
                        </p>
                      ) : (
                        <p className="text-lg font-semibold text-orange-500">Hết phòng</p>
                      )}
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          {hotelsRemaining > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={handleShowMore}
                className="border-blue-60 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Xem thêm {hotelsRemaining} khách sạn
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
