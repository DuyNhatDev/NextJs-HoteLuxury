'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchStore } from '@/store/filter-store'
import { generateSlugUrl } from '@/lib/utils'
import { DestinationType } from '@/schemaValidations/destination.schema'

export default function DestinationList({ destinations }: { destinations: DestinationType[] }) {
  const setFilter = useSearchStore((state) => state.setFilter)

  const handleClick = (destination: DestinationType) => {
    setFilter({ filter: destination.locationName })
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {destinations.map((destination) => (
        <Link
          key={destination.locationId}
          href={`khach-san-${generateSlugUrl(destination.locationName)}`}
          onClick={() => handleClick(destination)}
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
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 group-hover:from-black/90">
              <p className="text-xl font-semibold text-white">{destination.locationName}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
