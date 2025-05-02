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
      count: pendingList?.length
    },
    {
      name: 'Sắp tới',
      value: 'upcoming',
      content: <UpcomingTab data={upcomingList ?? []} />,
      count: upcomingList?.length
    },
    {
      name: 'Đang thực hiện',
      value: 'progress',
      content: <ProgressingTab data={progressingList ?? []} />,
      count: progressingList?.length
    },
    {
      name: 'Đã hoàn thành',
      value: 'completed',
      content: <CompletedTab data={completedList ?? []} />,
      count: completedList?.length
    },
    {
      name: 'Đã hủy',
      value: 'canceled',
      content: <CanceledTab data={canceledList ?? []} />,
      count: canceledList?.length
    }
  ]

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className='w-full'>
      <TabsList className='bg-background w-full justify-start gap-1 rounded-none px-4'>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className='bg-background data-[state=active]: h-full rounded-none border-b-3 border-transparent data-[state=active]:border-sky-400 data-[state=active]:text-sky-400 data-[state=active]:shadow-none'
          >
            <p className='text-sm'>{tab.name}</p>
            {!!tab.count && (
              <Badge variant='secondary' className='ml-2 rounded-full px-1 py-0 text-xs'>
                {tab.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <Card className='rounded'>
            <CardContent>{tab.content}</CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
