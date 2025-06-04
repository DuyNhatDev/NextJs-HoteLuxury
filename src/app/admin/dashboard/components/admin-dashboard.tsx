'use client'
import Statistic from '@/app/admin/dashboard/components/statistic'
import CalendarFilterRange from '@/components/custom/dashboard-filter-range'
import { useGetAdminDashboard } from '@/hooks/queries/useDashboard'
import { State } from '@/types/react-date-range'
import { startOfMonth, endOfDay } from 'date-fns'
import { useState } from 'react'
export default function AdminDashboard() {
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: startOfMonth(new Date()),
    endDate: endOfDay(new Date()),
    key: 'selection' as const
  })
  const { data } = useGetAdminDashboard({
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate
  })
  const dashboardData = data?.payload
  return (
    <div className='w-full rounded'>
      <div>
        <div className='mx-auto h-full w-full pt-2 sm:max-w-xl md:max-w-6xl'>
          <CalendarFilterRange
            value={createdRange}
            onChange={(newRange) => setCreatedRange(newRange!)}
            className='bg-transparent'
            placeholder='Chọn khoảng thời gian'
          />
        </div>
      </div>

      <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
        <Statistic data={dashboardData} />
      </div>

      <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>{/* <Chart data={dashboardData} /> */}</div>

      <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
        {/* <TopBookingUserTable data={topBookingUser ?? []} /> */}
      </div>
    </div>
  )
}
