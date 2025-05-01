import HotelInfo from '@/app/(public)/[filter]/[hotel]/components/hotel-info'
import { notFound } from 'next/navigation'

export default async function HotelDetailPage({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params
  const isValid = hotel.endsWith('-chi-tiet')

  if (!isValid) {
    notFound()
  }
  return (
    <div className='container mx-auto h-full w-full px-4 sm:max-w-xl md:max-w-6xl'>
      <HotelInfo />
    </div>
  )
}
