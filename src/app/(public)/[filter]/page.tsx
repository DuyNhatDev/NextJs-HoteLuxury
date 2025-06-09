import FilterForm from '@/app/(public)/[filter]/components/filter-form'
import SearchForm from '@/app/(public)/[filter]/components/search-form'
import { extractLocationName } from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ filter: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).filter
  return {
    title: `Khách sạn ${extractLocationName(slug)}`,
    description: `Khách sạn ${extractLocationName(slug)}`
  }
}

export default async function ListHotelPage({ params }: Props) {
  const { filter } = await params
  const isValid = filter.startsWith('khach-san-')

  if (!isValid) {
    redirect('/not-found')
  }
  return (
    <div className='flex flex-col'>
      <div className='flex-1'>
        <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
          <SearchForm />
        </div>
      </div>
      <div className='flex-1'>
        <div className='mx-auto h-full w-full pt-0 pb-3 sm:max-w-xl md:max-w-6xl'>
          <FilterForm />
        </div>
      </div>
    </div>
  )
}
