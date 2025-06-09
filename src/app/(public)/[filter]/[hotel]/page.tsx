import HotelInfo from '@/app/(public)/[filter]/[hotel]/components/hotel-info'
import { extractHotelName} from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ hotel: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).hotel
  return {
    title: `Chi tiết ${extractHotelName(slug)}`,
    description: `Chi tiết ${extractHotelName(slug)}`
  }
}


export default async function HotelDetailPage({ params }: Props) {
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
