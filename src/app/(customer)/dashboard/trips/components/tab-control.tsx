'use client'
import CanceledTab from '@/app/(customer)/dashboard/trips/components/canceled-tab'
import CompletedTab from '@/app/(customer)/dashboard/trips/components/completed-tab'
import PendingTab from '@/app/(customer)/dashboard/trips/components/pending-tab'
import ProgressingTab from '@/app/(customer)/dashboard/trips/components/progressing-tab'
import UpcomingTab from '@/app/(customer)/dashboard/trips/components/upcoming-tab'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  useGetCanceledBookingList,
  useGetCompletedBookingList,
  useGetPendingBookingList,
  useGetProgressingBookingList,
  useGetUpcomingBookingList
} from '@/queries/useBooking'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function TabControl() {
  const { data: pendingListQuery } = useGetPendingBookingList()
  const { data: upcomingListQuery } = useGetUpcomingBookingList()
  const { data: progressingListQuery } = useGetProgressingBookingList()
  const { data: completedListQuery } = useGetCompletedBookingList()
  const { data: canceledListQuery } = useGetCanceledBookingList()
  const pendingList = pendingListQuery?.payload?.data
  const upcomingList = upcomingListQuery?.payload?.data
  const progressingList = progressingListQuery?.payload?.data
  const completedList = completedListQuery?.payload?.data
  const canceledList = canceledListQuery?.payload?.data
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabIndexToValue = ['pending', 'upcoming', 'progress', 'completed', 'canceled']
  const tabValueToIndex = Object.fromEntries(tabIndexToValue.map((v, i) => [v, i]))
  const typeParam = searchParams.get('type')
  const initialTab = tabIndexToValue[Number(typeParam)] || 'pending'
  const [currentTab, setCurrentTab] = useState(initialTab)

  useEffect(() => {
    const typeParam = searchParams.get('type')
    const value = tabIndexToValue[Number(typeParam)] || 'pending'
    setCurrentTab(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
    const index = tabValueToIndex[value]
    const params = new URLSearchParams(searchParams)
    params.set('type', String(index))
    router.replace(`${pathname}?${params.toString()}`)
  }
  const tabs = [
    {
      name: 'Chờ xác nhận',
      value: 'pending',
      content: <PendingTab data={pendingList ?? []} />,
      count: pendingList?.length,
      showBadge: true
    },
    {
      name: 'Sắp tới',
      value: 'upcoming',
      content: <UpcomingTab data={upcomingList ?? []} />,
      count: upcomingList?.length,
      showBadge: true
    },
    {
      name: 'Đang thực hiện',
      value: 'progress',
      content: <ProgressingTab data={progressingList ?? []} />,
      count: progressingList?.length,
      showBadge: true
    },
    {
      name: 'Đã hoàn thành',
      value: 'completed',
      content: <CompletedTab data={completedList ?? []} />,
      count: completedList?.length,
      showBadge: false
    },
    {
      name: 'Đã hủy',
      value: 'canceled',
      content: <CanceledTab data={canceledList ?? []} />,
      count: canceledList?.length,
      showBadge: false
    }
  ]

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className='w-full'>
      <div className='overflow-x-auto'>
        <TabsList className='bg-background w-max min-w-full justify-start gap-1 rounded-none px-4'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='bg-background rounded-none border-b-3 border-transparent whitespace-nowrap data-[state=active]:border-sky-400 data-[state=active]:text-sky-400 data-[state=active]:shadow-none'
            >
              <p className='text-sm'>{tab.name}</p>
              {tab.showBadge && !!tab.count && (
                <Badge
                  variant='secondary'
                  className='ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 p-0 text-[10px] text-white'
                >
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.count === 0 ? (
            <Card className='flex min-h-96 items-center justify-center rounded'>
              <CardContent className='flex flex-col items-center justify-center gap-4'>
                <Image src='/image/order-empty.png' alt='Ảnh' width={100} height={100} />
                <p className='text-lg'>Chưa có đơn</p>
              </CardContent>
            </Card>
          ) : (
            tab.content
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
