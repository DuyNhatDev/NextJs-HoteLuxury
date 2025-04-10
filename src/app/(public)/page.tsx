import destinationApiRequest from '@/apiRequests/destination'
import SearchForm from '@/app/(public)/components/search-form'
import { generateSlugUrl } from '@/lib/utils'
import { DestinationType } from '@/schemaValidations/destination.schema'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  let destinationList: DestinationType[] = []
  try {
    const result = await destinationApiRequest.getDestinationList()
    destinationList = result.payload.data
  } catch (error) {
    return <div>Something went wrong</div>
  }
  return (
    <div className="w-full space-y-4">
      <section className="relative z-10">
        <span className="absolute top-0 left-0 z-10 h-full w-full"></span>
        <div className="relative z-20 min-h-[400px] px-4 py-10 sm:px-10 md:px-20 md:py-20">
          <Image
            src="/image/banner.png"
            fill
            quality={100}
            alt="Banner"
            className="absolute top-0 left-0 z-0 h-full w-full object-cover"
            priority
          />
          <SearchForm />
        </div>
      </section>
      <section className="container mx-auto max-w-screen-xl space-y-10 px-16 py-8">
        <h2 className="mb-3 text-center text-2xl font-bold">Điểm đến yêu thích</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {destinationList.map((destination) => (
            <Link
              href={`khach-san-${generateSlugUrl(destination.locationName)}`}
              key={destination.locationId}
            >
              <div className="group relative h-[200px] w-full overflow-hidden rounded-sm">
                <Image
                  src={destination.locationImage as string}
                  alt={destination.locationName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={100}
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 transition-all duration-300 ease-in-out group-hover:from-black/90">
                  <p className="text-xl font-semibold text-white">{destination.locationName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
