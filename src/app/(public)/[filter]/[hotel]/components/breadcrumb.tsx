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
import Link from 'next/link'

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
          <BreadcrumbLink asChild>
            <Link href="/">Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              onClick={() => {
                setFilter({ filter: locationName })
              }}
              href={`/khach-san-${generateSlugUrl(locationName)}`}
            >
              {locationName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{hotelName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
