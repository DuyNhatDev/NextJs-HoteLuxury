'use client'
import BreadcrumbNav from '@/app/(public)/[filter]/[hotel]/components/breadcrumb'
import Image from 'next/image'
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
import { Button } from '@/components/ui/button'
import { extractHotelName } from '@/lib/utils'
import { useGetFilterHotelList } from '@/hooks/queries/useFilter'
import { useGetHotel } from '@/hooks/queries/useHotel'
import { HotelType } from '@/schemas/hotel.schema'
import { useFilterStore } from '@/store/filter-store'
import { ChevronDown, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import SearchForm from '@/app/(public)/[filter]/[hotel]/components/search-form'
import { useEffect, useRef, useState } from 'react'
import { usePriceStore } from '@/store/price-store'
import dynamic from 'next/dynamic'
import { useBookingStore } from '@/store/booking-store'
import ListRating from '@/app/(public)/[filter]/[hotel]/components/list-rating'
import { Badge } from '@/components/ui/badge'
import CustomTooltip from '@/components/custom/tooltip'
const Map = dynamic(() => import('@/components/custom/map'), {
  ssr: false
})

export default function HotelInfo() {
  const minPrice = usePriceStore((state) => state.minPrice)
  const filter = useFilterStore((state) => state.filter)
  const setBooking = useBookingStore((state) => state.setBooking)
  const params = useParams()
  const { data } = useGetFilterHotelList({
    ...filter,
    hotelStar: [],
    hotelType: [],
    filter: extractHotelName(params.hotel as string)
  })
  const result: HotelType | undefined = data?.payload?.data[0]
  const hotelId = result?.hotelId
  const hotelQuery = useGetHotel(String(hotelId), !!hotelId)
  const hotelData = hotelQuery?.data?.payload?.data
  const imageList = [hotelData?.hotelImage, ...(hotelData?.hotelImages ?? [])].filter(
    (img): img is string => typeof img === 'string' && img.trim() !== ''
  )
  const roomTypeRef = useRef<HTMLDivElement>(null)
  const ratingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBooking({ hotelName: hotelData?.hotelName, hotelAddress: hotelData?.hotelAddress })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelData?.hotelName, hotelData?.hotelAddress])

  useEffect(() => {
    const scrollY = sessionStorage.getItem('prevScrollY')
    if (scrollY) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(scrollY), behavior: 'smooth' })
        sessionStorage.removeItem('prevScrollY')
        sessionStorage.removeItem('prevPath')
      }, 300)
    }
  }, [])

  const handleRoomTypeScroll = () => {
    const headerHeight = 56
    const element = roomTypeRef.current
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: 'smooth'
      })
    }
  }
  const handleRatingScroll = () => {
    const headerHeight = 56
    const element = ratingRef.current
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: 'smooth'
      })
    }
  }
  return (
    <div className='flex flex-col'>
      <div className='mx-auto h-full w-full py-4 sm:max-w-xl md:max-w-6xl'>
        <BreadcrumbNav locationName={hotelData?.locationName ?? ''} hotelName={hotelData?.hotelName ?? ''} />
      </div>

      <div className='mx-auto h-full w-full pt-0 pb-3 sm:max-w-xl md:max-w-6xl'>
        <div className='flex'>
          {/* Map */}
          <div className='hidden flex-1 px-1 md:block'>
            <div className='mx-auto w-full sm:max-w-xl md:max-w-6xl'>
              <Map address={hotelData?.hotelAddress ?? ''} />
            </div>
          </div>
          {/* Thông tin khách sạn */}
          <div className='flex-3'>
            <div className='mx-auto h-full w-full sm:max-w-xl md:max-w-6xl'>
              {/* Thông tin */}
              <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
                <div className='flex flex-4 flex-col items-start justify-start gap-2 px-3'>
                  <h1 className='text-xl font-bold text-blue-900'>{hotelData?.hotelName}</h1>

                  <div className='flex items-center gap-2'>
                    <Rating
                      rating={hotelData?.hotelStar || 0}
                      size={20}
                      variant='yellow'
                      showText={false}
                      showEmpty={true}
                      disabled={true}
                    />
                    <CustomTooltip content='Click để xem đánh giá'>
                      <div className='hover:cursor-pointer' onClick={handleRatingScroll}>
                        <div className='flex items-center gap-2'>
                          <Badge className='rounded bg-green-600 text-[14px] font-semibold'>
                            {hotelData?.ratingAverage}
                          </Badge>
                          <p className='text-gray-500'>| {hotelData?.ratingQuantity} đánh giá</p>
                          <ChevronDown className='h-4 w-4 text-gray-500' />
                        </div>
                      </div>
                    </CustomTooltip>
                  </div>
                  <div className='hidden items-center text-gray-500 md:flex'>
                    <MapPin className='mr-1 h-4 w-4 text-red-500' />
                    <span className='text-sm'>{hotelData?.hotelAddress}</span>
                  </div>
                </div>
                <div className='hidden flex-1 flex-col items-end justify-start px-3 md:flex'>
                  <p className='text-sm'>Giá chỉ từ</p>
                  <p className='text-lg font-semibold text-sky-500'>
                    {Number(minPrice).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                  </p>
                  <Button
                    className='text-md h-12 w-full bg-orange-400 font-bold text-white hover:bg-orange-400'
                    onClick={handleRoomTypeScroll}
                  >
                    Đặt ngay
                  </Button>
                </div>
              </div>
              {/* Hình ảnh */}
              {imageList && imageList.length > 0 && (
                <Carousel className='mt-2 p-2'>
                  <CarouselPrevious className='absolute top-1/3 left-10 h-7 w-7 -translate-y-1/3 opacity-50' />
                  <CarouselNext className='absolute top-1/3 right-10 h-7 w-7 -translate-y-1/3 opacity-50' />
                  <CarouselMainContainer className='h-[500px]'>
                    {imageList.map((img, index) => (
                      <SliderMainItem key={index} className='bg-transparent'>
                        <div className='outline-border bg-background relative h-full w-full overflow-hidden rounded-none outline'>
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
              {/* Map */}
              <div className='my-3 flex items-center text-gray-500 md:hidden'>
                <MapPin className='mr-1 h-4 w-4 text-red-500' />
                <span className='text-sm'>{hotelData?.hotelAddress}</span>
              </div>
              <div className='block px-2 md:hidden'>
                <Map address={hotelData?.hotelAddress ?? ''} />
              </div>
              {/* Mô tả */}
              <div className='border-gray-20 m-2 rounded border p-3'>
                <h4 className='mb-2 text-lg font-semibold'>Mô tả:</h4>
                <div
                  className='leading-relaxed'
                  dangerouslySetInnerHTML={{ __html: hotelData?.hotelDescription || '' }}
                />
              </div>
              {/* Danh sách loại phòng */}
              <div className='p-2' ref={roomTypeRef}>
                <h2 className='py-2 font-semibold text-blue-900'>Bảng giá {hotelData?.hotelName}</h2>
                {hotelId && <SearchForm hotelId={hotelId} />}
              </div>
              {/* Danh sách đánh giá */}
              <div className='p-2' ref={ratingRef}>
                <ListRating
                  hotelId={hotelData?.hotelId ?? 0}
                  hotelName={hotelData?.hotelName ?? ''}
                  averageRating={hotelData?.ratingAverage ?? 0}
                  totalRating={hotelData?.ratingQuantity ?? 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
