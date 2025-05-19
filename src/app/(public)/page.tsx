import destinationApiRequest from '@/apiRequests/destination'
import SearchForm from '@/app/(public)/components/search-form'
import { DestinationType } from '@/schemaValidations/destination.schema'
import Image from 'next/image'
import DestinationList from '@/app/(public)/components/destination-list'

export default async function Home() {
  let destinationList: DestinationType[] = []
  try {
    const result = await destinationApiRequest.getDestinationList()
    destinationList = result.payload.data
  } catch (error) {
    return <div>Something went wrong</div>
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
      <section className='container mx-auto max-w-screen-xl space-y-10 px-16 py-8'>
        <h2 className='mb-3 text-center text-2xl font-bold'>Điểm đến yêu thích</h2>
        <DestinationList destinations={destinationList} />
      </section>
    </div>
  )
}
