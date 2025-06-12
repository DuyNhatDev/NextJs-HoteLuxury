import locationApiRequest from '@/api/location'
import SearchForm from '@/app/(public)/components/search-form'
import { LocationType } from '@/schemas/location.schema'
import Image from 'next/image'
import DestinationList from '@/app/(public)/components/destination-list'
import { FeaturedHotelType } from '@/schemas/hotel.schema'
import hotelApiRequest from '@/api/hotel'
import FeaturedHotelList from '@/app/(public)/components/featured-hotel-list'
import voucherApiRequest from '@/api/voucher'
import { VoucherType } from '@/schemas/voucher.schema'
export default async function Home() {
  let destinationList: LocationType[] = []
  let featuredHotelList: FeaturedHotelType[] = []
  let voucher: VoucherType

  try {
    const featuredHotelResult = await hotelApiRequest.getFeaturedHotelList()
    featuredHotelList = featuredHotelResult.payload.data
  } catch (error) {
    return <div className='text-center'>Lỗi khi tải danh sách khách sạn</div>
  }

  try {
    const destinationResult = await locationApiRequest.getLocationList()
    destinationList = destinationResult.payload.data
  } catch (error) {
    return <div className='text-center'>Lỗi khi tải danh sách địa điểm</div>
  }

  try {
    const voucherResult = await voucherApiRequest.getFestivalVoucher()
    voucher = voucherResult.payload.data
  } catch (error) {
    return <div className='text-center'>Lỗi khi tải danh sách địa điểm</div>
  }

  return (
    <div className='w-full space-y-4'>
      <section className='relative z-10 flex min-h-[500px] items-center justify-center'>
        <Image
          src='/image/banner.png'
          fill
          quality={100}
          alt='Banner'
          className='absolute top-0 left-0 z-0 h-full w-full object-cover'
          priority
        />

        <div className='relative flex w-full max-w-[800px] flex-col items-center space-y-4 px-4'>
          <div className='absolute -top-22 left-8 hidden space-y-1 md:block'>
            <p className='text-2xl font-bold text-white md:text-4xl'>Đặt phòng dễ dàng</p>
            <p className='text-lg font-semibold text-white md:text-xl'>
              Khách sạn giá tốt nhất, trọn vẹn từng chuyến đi
            </p>
          </div>

          <SearchForm />

          {voucher && (
            <div className='w-full max-w-[400px] space-y-2 rounded-xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm md:absolute md:top-44 md:left-1/2 md:-translate-x-1/2 md:space-y-2 md:px-6 md:py-4'>
              <p className='text-center text-sm font-bold text-yellow-800 md:text-xl'>🎉 Ưu đãi đặc biệt 🎉</p>
              <p className='text-center text-sm text-gray-700 md:text-base'>
                🎁 Nhập mã <span className='font-semibold text-red-600'>{voucher.code}</span>
              </p>
              <p className='text-center text-sm text-gray-700 md:text-base'>{voucher.content}</p>
            </div>
          )}
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
