import { PartnerDashboardType } from '@/types/dashboard.type'
import PartnerRevenueChart from '@/app/partner/dashboard/components/revenue-chart'
import PartnerBookingChart from '@/app/partner/dashboard/components/booking-chart'
type ChartProps = {
  data?: PartnerDashboardType
}

export default function Chart({ data }: ChartProps) {
  const bookingsData = (data?.totalBookingOfHotelByTime || []).map((item) => ({
    month: `Tháng ${item._id.month}`,
    totalBookings: item.totalBookings || 0
  }))
  const revenueData = (data?.totalRevenueOfHotelByTime || []).map((item) => ({
    month: `Tháng ${item._id.month}`,
    totalRevenue: item.totalRevenue || 0
  }))

  return (
    <div className='flex items-center justify-evenly gap-5 p-6'>
      <PartnerRevenueChart chartData={revenueData} />
      <PartnerBookingChart chartData={bookingsData} />
    </div>
  )
}
