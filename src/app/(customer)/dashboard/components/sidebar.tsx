'use client'
import Link from 'next/link'
import React from 'react'
import { CircleUser, FileText, Gift, Ticket } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function SideBar() {
  const pathname = usePathname()
  const menuItems = [
    {
      href: '/dashboard/profile',
      icon: CircleUser,
      label: 'Hồ sơ của tôi'
    },
    {
      href: '/dashboard/trips',
      icon: FileText,
      label: 'Đơn của tôi'
    },
    {
      href: '/dashboard/voucher',
      icon: Ticket,
      label: 'Voucher của tôi'
    },
    {
      href: '/dashboard/points',
      icon: Gift,
      label: 'LuxuryPoint'
    }
  ]
  return (
    <Card className='rounded'>
      <CardContent>
        <ul className='space-y-4'>
          {menuItems.map(({ href, icon: Icon, label }, index) => {
            const isActive = pathname === href
            const isLastItem = index === menuItems.length - 1

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center text-sm ${
                    !isLastItem ? 'border-b pb-4' : ''
                  } ${isActive ? 'font-semibold text-sky-500' : ''} hover:text-sky-500`}
                >
                  <Icon className='mr-2 h-5 w-5 text-gray-400' />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
