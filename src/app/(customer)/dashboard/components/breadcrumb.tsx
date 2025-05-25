'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { getBreadcrumbPageFromPathName } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BreadcrumbNav() {
  const pathname = usePathname()
  const [breadcrumbPage, setBreadcrumbPage] = useState('')

  useEffect(() => {
    const page = pathname.split('/').filter(Boolean)[1] || ''
    setBreadcrumbPage(page)
  }, [pathname])

  if (!breadcrumbPage) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/' className='text-blue-600 hover:underline'>
              Trang chủ
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/dashboard/profile' className='text-blue-600 hover:underline'>
              Tài khoản
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className='text-gray-500'>{getBreadcrumbPageFromPathName(breadcrumbPage)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
