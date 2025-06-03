import { Rating } from '@/components/custom/rating'
import { Badge } from '@/components/ui/badge'
import { generateSlugUrl } from '@/lib/utils'
import { HotelType } from '@/schemas/hotel.schema'
import Image from 'next/image'
import Link from 'next/link'

type ListSimilarHotelProps = {
  data: HotelType[]
}
export default function ListSimilarHotel({ data }: ListSimilarHotelProps) {
  return (
    <>
      {data.length > 0 ? (
        <>
          <p className='pb-4 font-semibold text-blue-950'>Khách sạn tương tự</p>
          <div className='space-y-3'>
            {data.map((hotel) => (
              <Link
                key={hotel.hotelId}
                href={`/khach-san-${generateSlugUrl(hotel.locationName)}/${generateSlugUrl(hotel.hotelName)}-chi-tiet`}
                className='flex items-center gap-3'
              >
                <div className='relative h-[70px] w-[70px] shrink-0 overflow-hidden'>
                  <Image src={hotel.hotelImage} alt={hotel.hotelName} fill className='rounded object-cover' />
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>{hotel.hotelName}</p>
                  <Rating
                    rating={hotel.hotelStar}
                    size={18}
                    variant='yellow'
                    showText={false}
                    showEmpty={true}
                    disabled={true}
                  />
                  {hotel.ratingQuantity !== 0 && (
                    <div className='mt-1 flex items-center gap-2'>
                      <Badge className='rounded bg-green-600 text-xs font-semibold'>{hotel.ratingAverage}</Badge>
                      <p className='text-sm text-gray-500'>| {hotel.ratingQuantity} đánh giá</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}
