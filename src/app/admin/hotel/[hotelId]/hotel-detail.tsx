'use client'

import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem
} from '@/components/custom/carousel'
import { Rating } from '@/components/custom/rating'
import { useGetHotel } from '@/hooks/queries/useHotel'
import { ChevronLeft, MapPin, Phone } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
const Map = dynamic(() => import('@/components/custom/map'), {
  ssr: false
})

export default function HotelDetail() {
  const router = useRouter()
  const params = useParams()
  const hotelId = params.hotelId
  const { data: hotelQuery } = useGetHotel(String(hotelId), !!hotelId)
  const data = hotelQuery?.payload?.data

  if (!data) {
    return null
  }

  const { hotelName, hotelPhoneNumber, hotelStar, hotelDescription, hotelAddress, hotelImage, hotelImages } = data
  const imageList = [hotelImage, ...hotelImages]

  return (
    <div className='px-10'>
      <button className='mb-2 flex items-center text-gray-500 hover:cursor-pointer' onClick={() => router.back()}>
        <ChevronLeft className='mr-1 h-5 w-5 text-gray-500' />
        TRỞ LẠI
      </button>
      <div className='space-y-3'>
        <h2 className='text-3xl font-bold'>{hotelName}</h2>

        <div className='flex items-center gap-4'>
          <Rating rating={hotelStar!} totalStars={5} size={28} variant='yellow' showText={false} disabled={true} />
        </div>

        <div className='flex items-start gap-3'>
          <MapPin className='h-5 w-5 text-red-500' />
          <p className='text-base'>{hotelAddress}</p>
        </div>

        <div className='flex items-start gap-3'>
          <Phone className='h-5 w-5 text-green-500' />
          <p className='text-base'>{hotelPhoneNumber}</p>
        </div>

        <div className='w-2xl sm:max-w-xl md:max-w-6xl'>
          <Map address={hotelAddress} />
        </div>

        {imageList && imageList.length > 0 && (
          <Carousel>
            <CarouselNext className='top-1/3 -translate-y-1/3' />
            <CarouselPrevious className='top-1/3 -translate-y-1/3' />
            <CarouselMainContainer className='h-[500px]'>
              {imageList.map((img, index) => (
                <SliderMainItem key={index} className='bg-transparent'>
                  <div className='outline-border bg-background relative h-full w-full overflow-hidden rounded-xl outline'>
                    <Image
                      src={img}
                      alt={`hotel-image-${index}`}
                      quality={100}
                      fill
                      className='object-contain object-center'
                    />
                  </div>
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {imageList.map((img, index) => (
                <SliderThumbItem key={index} index={index} className='h-40 w-40 bg-transparent'>
                  <div className='outline-border bg-background relative size-full overflow-hidden rounded-sm outline'>
                    <Image src={img} alt={`hotel-image-thumb-${index}`} quality={100} fill />
                  </div>
                </SliderThumbItem>
              ))}
            </CarouselThumbsContainer>
          </Carousel>
        )}

        <div className='border-gray-20 rounded-xl border px-6 py-4'>
          <h4 className='mb-2 text-lg font-semibold'>Mô tả:</h4>
          <div className='leading-relaxed' dangerouslySetInnerHTML={{ __html: hotelDescription || '' }} />
        </div>
      </div>
    </div>
  )
}
