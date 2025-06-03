'use client'
import Link from 'next/link'
import Image from 'next/image'
import { generateSlugUrl } from '@/lib/utils'
import { FeaturedHotelType } from '@/schemas/hotel.schema'

export default function FeaturedHotelList({ featuredHotels }: { featuredHotels: FeaturedHotelType[] }) {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
      {featuredHotels.map((hotel) => (
        <Link
          key={hotel.hotelId}
          href={`khach-san-${generateSlugUrl(hotel.locationName)}/${generateSlugUrl(hotel.hotelName)}-chi-tiet`}
          className='block'
        >
          <div className='flex h-[280px] w-full flex-col overflow-hidden rounded bg-white shadow-md'>
            <div className='relative h-[200px] w-full'>
              <Image
                src={hotel.hotelImage}
                alt={hotel.hotelName}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 33vw'
                quality={100}
              />
            </div>
            <div className='flex h-[80px] items-center justify-center px-2 text-center'>
              <p className='line-clamp-2 text-base font-medium'>{hotel.hotelName}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
