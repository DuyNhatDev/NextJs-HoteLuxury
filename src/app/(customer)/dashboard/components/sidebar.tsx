'use client'
import Link from 'next/link'
import React from 'react'
import { CircleUser, FileText, Ticket } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function SideBar() {
  const pathname = usePathname()
  return (
    <Card className="rounded">
      <CardContent>
        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard/profile"
              className={`flex items-center border-b pb-4 text-sm ${
                pathname === '/dashboard/profile' ? 'font-semibold text-sky-500' : ''
              } hover:text-sky-500`}
            >
              <CircleUser className="mr-2 h-5 w-5 text-gray-400" />
              Hồ sơ của tôi
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/trips"
              className={`flex items-center border-b pb-4 text-sm ${
                pathname === '/dashboard/trips' ? 'font-semibold text-sky-500' : ''
              } hover:text-sky-500`}
            >
              <FileText className="mr-2 h-5 w-5 text-gray-400" />
              Đơn của tôi
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/voucher"
              className={`flex items-center text-sm ${
                pathname === '/dashboard/voucher' ? 'font-semibold text-sky-500' : ''
              } hover:text-sky-500`}
            >
              <Ticket className="mr-2 h-5 w-5 text-gray-400" />
              Voucher của tôi
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
