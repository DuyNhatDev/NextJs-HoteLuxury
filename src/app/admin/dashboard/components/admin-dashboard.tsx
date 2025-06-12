'use client'
import AdminRevenueChart from '@/app/admin/dashboard/components/revenue-chart'
import Statistic from '@/app/admin/dashboard/components/statistic'
import TopUserTable from '@/app/admin/dashboard/components/top-booking-user-table'
import TopHotelTable from '@/app/admin/dashboard/components/top-hotel-table'
import DashboardFilterRange from '@/components/custom/dashboard-filter-range'
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
  const revenueData = (dashboardData?.totalCommissionByMonth || []).map((item) => ({
    month: `Tháng ${item.month}`,
    totalCommission: item.totalCommission || 0
  }))
  const topHotel = dashboardData?.hotel
  const topUser = dashboardData?.user

  return (
    <div className='w-full rounded'>
      <div>
        <div className='mx-auto h-full w-full pt-2 sm:max-w-xl md:max-w-6xl'>
          <DashboardFilterRange
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

      <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
        <div className='space-y-5'>
          <AdminRevenueChart chartData={revenueData ?? []} />
        </div>
      </div>

      <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
        <TopHotelTable data={topHotel ?? []} />
      </div>
      <div className='mx-auto h-full w-full py-3 sm:max-w-xl md:max-w-6xl'>
        <TopUserTable data={topUser ?? []} />
      </div>
    </div>
  )
}
