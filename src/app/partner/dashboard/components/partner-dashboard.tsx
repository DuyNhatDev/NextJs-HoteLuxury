'use client'
import Chart from '@/app/partner/dashboard/components/chart'
import Statistic from '@/app/partner/dashboard/components/statistic'
import CalendarFilterRange from '@/components/custom/dashboard-filter-range'
import { useGetPartnerDashboard } from '@/hooks/queries/useDashboard'
import { State } from '@/types/react-date-range'
import { startOfMonth, endOfDay } from 'date-fns'
import { useState } from 'react'
export default function PartnerDashboard() {
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: startOfMonth(new Date()),
    endDate: endOfDay(new Date()),
    key: 'selection' as const
  })
  const { data } = useGetPartnerDashboard({
    time: 'tháng',
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate
  })
  const dashboardData = data?.payload

  return (
    <div className='flex w-full flex-col items-center justify-center rounded'>
      <div className='flex-1'>
        <div className='mx-auto h-full w-full pt-2 sm:max-w-xl md:max-w-6xl'>
          <div className='px-6'>
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
      </div>
      <div className='flex-1'>
        <div className='mx-auto h-full w-full pt-0 pb-3 sm:max-w-xl md:max-w-6xl'>
          <Chart data={dashboardData} />
        </div>
      </div>
    </div>
  )
}
