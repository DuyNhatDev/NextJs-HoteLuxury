import FilterForm from '@/app/(public)/[hotel]/components/filter-form'
import ListFilterHotel from '@/app/(public)/[hotel]/components/list-filter-hotel'

export default async function ListHotelPage({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params
  return (
    <div className="flex flex-col">
      {/* <div className="flex-1">
          <div className="mx-auto h-full w-full max-w-[350px] bg-red-300 p-4 sm:max-w-xl md:max-w-6xl"></div>
        </div> */}

      {/* <div className="flex-1 overflow-auto">
          <div className="mx-auto h-full w-full max-w-[350px] bg-yellow-200 p-4 sm:max-w-xl md:max-w-6xl">
          </div>
        </div> */}

      <div className="flex-1">
        <div className="mx-auto h-full w-full max-w-[350px] py-3 sm:max-w-xl md:max-w-6xl">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 rounded border p-4">
              <FilterForm />
            </div>
            <div className="col-span-3 rounded border p-4">
              <ListFilterHotel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
