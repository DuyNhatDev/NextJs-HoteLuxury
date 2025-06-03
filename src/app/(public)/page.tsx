import destinationApiRequest from '@/api/destination'
import SearchForm from '@/app/(public)/components/search-form'
import { DestinationType } from '@/schemas/destination.schema'
import Image from 'next/image'
import DestinationList from '@/app/(public)/components/destination-list'
import { FeaturedHotelType } from '@/schemas/hotel.schema'
import hotelApiRequest from '@/api/hotel'
import FeaturedHotelList from '@/app/(public)/components/featured-hotel-list'
export default async function Home() {
  let destinationList: DestinationType[] = []
  let featuredHotelList: FeaturedHotelType[] = []

  try {
    const featuredHotelResult = await hotelApiRequest.getFeaturedHotelList()
    featuredHotelList = featuredHotelResult.payload.data
  } catch (error) {
    return <div className='text-center'>Lỗi khi tải danh sách khách sạn</div>
  }

  try {
    const destinationResult = await destinationApiRequest.getDestinationList()
    destinationList = destinationResult.payload.data
  } catch (error) {
    return <div className='text-center'>Lỗi khi tải danh sách địa điểm</div>
  }

  return (
    <div className='w-full space-y-4'>
      <section className='relative z-10'>
        <span className='absolute top-0 left-0 z-10 h-full w-full'></span>
        <div className='relative z-20 min-h-[450px] px-4 py-10 sm:px-10 md:px-20 md:py-20'>
          <Image
            src='/image/banner.png'
            fill
            quality={100}
            alt='Banner'
            className='absolute top-0 left-0 z-0 h-full w-full object-cover'
            priority
          />
          <SearchForm />
        </div>
      </section>
      <section className='container mx-auto my-0 max-w-screen-xl space-y-10 px-16 py-8'>
        <h2 className='mb-5 text-3xl font-bold'>Khách sạn nổi bật</h2>
        <FeaturedHotelList featuredHotels={featuredHotelList} />
      </section>
      <section className='container mx-auto my-0 max-w-screen-xl space-y-10 px-16 py-8'>
        <h2 className='mb-5 text-3xl font-bold'>Điểm đến yêu thích</h2>
        <DestinationList destinations={destinationList} />
      </section>
    </div>
  )
}
