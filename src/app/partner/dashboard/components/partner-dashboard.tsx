'use client'
import Chart from '@/app/partner/dashboard/components/chart'
import Statistic from '@/app/partner/dashboard/components/statistic'
import { useGetPartnerDashboard } from '@/hooks/queries/useDashboard'

export default function PartnerDashboard() {
  const { data } = useGetPartnerDashboard('tháng')
  const dashboardData = data?.payload

  return (
    <div className='flex flex-col items-center justify-center rounded'>
      <div className='flex-1'>
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
