import { PartnerDashboardResType } from '@/types/partner-dashboard.type'
import PartnerRevenueChart from '@/app/partner/dashboard/components/revenue-chart'
import PartnerBookingChart from '@/app/partner/dashboard/components/booking-chart'
type ChartProps = {
  data?: PartnerDashboardResType
}

export default function Chart({ data }: ChartProps) {
  const revenueData = (data?.totalRevenueOfHotelByTime || []).map((item) => ({
    month: `Tháng ${item._id.month}`,
    totalRevenue: item.totalRevenue || 0
  }))

  const bookingsByRoomType = (data?.totalBookingsByRoomType || []).map((item) => {
    const { month, ...roomTypes } = item
    return {
      month: month,
      ...roomTypes
    }
  })

  return (
    <div className='space-y-5'>
      <PartnerRevenueChart chartData={revenueData} />
      <PartnerBookingChart chartData={bookingsByRoomType} />
    </div>
  )
}
