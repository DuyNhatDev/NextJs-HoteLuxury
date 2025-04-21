'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { generateSlugUrl } from '@/lib/utils'
import { useFilterStore } from '@/store/filter-store'

interface BreadcrumbItems {
  locationName: string
  hotelName: string
}

export default function BreadcrumbNav({ locationName, hotelName }: BreadcrumbItems) {
  const setFilter = useFilterStore((state) => state.setFilter)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => {
              setFilter({ filter: locationName })
            }}
            href={`/khach-san-${generateSlugUrl(locationName)}`}
          >
            {locationName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className='text-gray-500'>{hotelName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
