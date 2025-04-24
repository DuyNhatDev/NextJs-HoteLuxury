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
  SliderThumbItem,
} from '@/components/customize/carousel'
import { Rating } from '@/components/customize/rating'
import { Button } from '@/components/ui/button'
import { extractHotelName } from '@/lib/utils'
import { useGetFilterHotelList } from '@/queries/useFilter'
import { useGetHotel } from '@/queries/useHotel'
import { HotelType } from '@/schemaValidations/hotel.schema'
import { useFilterStore } from '@/store/filter-store'
import { MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import SearchForm from '@/app/(public)/[filter]/[hotel]/components/search-form'
import { useRef } from 'react'
import { usePriceStore } from '@/store/price-store'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/customize/map'), {
  ssr: false,
})

export default function HotelInfo() {
  const minPrice = usePriceStore((state) => state.minPrice)
  const filter = useFilterStore((state) => state.filter)
  const params = useParams()
  const { data } = useGetFilterHotelList({
    ...filter,
    hotelStar: [],
    hotelType: [],
    filter: extractHotelName(params.hotel as string),
  })
  console.log(extractHotelName(params.hotel as string))
  const result: HotelType | undefined = data?.payload?.data[0]
  const hotelId = result?.hotelId
  const hotelQuery = useGetHotel(String(hotelId), !!hotelId)
  const hotelData = hotelQuery?.data?.payload?.data
  const imageList = [hotelData?.hotelImage, ...(hotelData?.hotelImages ?? [])].filter(
    (img): img is string => typeof img === 'string' && img.trim() !== ''
  )
  const roomTypeRef = useRef<HTMLDivElement>(null)
  const handleScroll = () => {
    const headerHeight = 56

    const element = roomTypeRef.current
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl">
        <BreadcrumbNav
          locationName={hotelData?.locationName ?? ''}
          hotelName={hotelData?.hotelName ?? ''}
        />
      </div>

      <div className="mx-auto h-full w-full pt-0 pb-3 sm:max-w-xl md:max-w-6xl">
        <div className="flex">
          {/* Map */}
          <div className="flex-1">
            <div className="w-ful mx-auto py-3 sm:max-w-xl md:max-w-6xl">
              <Map address={hotelData?.hotelAddress ?? ''} />
            </div>
          </div>
          {/* Thông tin khách sạn */}
          <div className="flex-3">
            <div className="mx-auto h-full w-full sm:max-w-xl md:max-w-6xl">
              {/* Thông tin */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-4 flex-col items-start justify-start gap-2 p-3">
                  <h1 className="text-xl font-bold text-blue-900">{hotelData?.hotelName}</h1>
                  <div className="flex items-center">
                    <Rating
                      rating={hotelData?.hotelStar || 0}
                      size={20}
                      variant="yellow"
                      showText={false}
                      showEmpty={true}
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-sm">{hotelData?.hotelAddress}</span>
                  </div>
                  <div></div>
                </div>

                <div className="flex flex-1 flex-col items-end justify-start p-3">
                  <p className="text-sm">Giá chỉ từ</p>
                  <p className="text-lg font-semibold text-sky-500">
                    {Number(minPrice).toLocaleString('vi-VN')} <span className="text-sm">VND</span>
                  </p>
                  <Button
                    className="text-md h-12 w-full bg-orange-400 font-bold text-white hover:bg-orange-400"
                    onClick={handleScroll}
                  >
                    Đặt ngay
                  </Button>
                </div>
              </div>
              {/* Hình ảnh */}
              {imageList && imageList.length > 0 && (
                <Carousel className="p-2">
                  <CarouselPrevious className="absolute top-1/3 left-10 h-7 w-7 -translate-y-1/3 opacity-50" />
                  <CarouselNext className="absolute top-1/3 right-10 h-7 w-7 -translate-y-1/3 opacity-50" />

                  <CarouselMainContainer className="h-[500px]">
                    {imageList.map((img, index) => (
                      <SliderMainItem key={index} className="bg-transparent">
                        <div className="outline-border bg-background relative h-full w-full overflow-hidden rounded-none outline">
                          <Image
                            src={img}
                            alt={`hotel-image-${index}`}
                            quality={100}
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      </SliderMainItem>
                    ))}
                  </CarouselMainContainer>
                  <CarouselThumbsContainer>
                    {imageList.map((img, index) => (
                      <SliderThumbItem
                        key={index}
                        index={index}
                        className="h-40 w-40 bg-transparent"
                      >
                        <div className="outline-border bg-background relative size-full overflow-hidden rounded-sm outline">
                          <Image src={img} alt={`hotel-image-thumb-${index}`} quality={100} fill />
                        </div>
                      </SliderThumbItem>
                    ))}
                  </CarouselThumbsContainer>
                </Carousel>
              )}
              {/* Mô tả */}
              <div className="border-gray-20 m-2 rounded border p-3">
                <h4 className="mb-2 text-lg font-semibold">Mô tả:</h4>
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: hotelData?.hotelDescription || '' }}
                />
              </div>
              {/* Danh sách loại phòng */}
              <div className="p-2" ref={roomTypeRef}>
                <h2 className="py-2 font-semibold text-blue-900">
                  Bảng giá {hotelData?.hotelName}
                </h2>
                {hotelId && <SearchForm hotelId={hotelId} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
