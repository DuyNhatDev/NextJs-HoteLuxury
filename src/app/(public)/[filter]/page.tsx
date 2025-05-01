import FilterForm from '@/app/(public)/[filter]/components/filter-form'
import SearchForm from '@/app/(public)/[filter]/components/search-form'
import { notFound } from 'next/navigation'

export default async function ListHotelPage({ params }: { params: Promise<{ filter: string }> }) {
  const { filter } = await params
  const isValid = filter.startsWith('khach-san-')

  if (!isValid) {
    notFound()
  }
  return (
    <div className='flex flex-col'>
      <div className='flex-1'>
        <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
          <SearchForm />
        </div>
      </div>

      {/* <div className="flex-1">
          <div className="mx-auto h-full w-full bg-yellow-200 p-4 sm:max-w-xl md:max-w-6xl">
          </div>
        </div> */}

      <div className='flex-1'>
        <div className='mx-auto h-full w-full pt-0 pb-3 sm:max-w-xl md:max-w-6xl'>
          <FilterForm />
        </div>
      </div>
    </div>
  )
}
