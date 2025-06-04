import { PartnerDashboardResType } from '@/types/partner-dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
type StatisticProps = {
  data?: PartnerDashboardResType
}
export default function Statistic({ data }: StatisticProps) {
  return (
    <div className='flex items-center justify-evenly gap-5 px-6 py-0'>
      <Card className='h-[130px] w-[190px] items-center gap-3 bg-blue-500 p-2'>
        <CardHeader>
          <CardTitle>Số lượt đặt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl'>{data?.totalBookingOfHotel}</p>
        </CardContent>
      </Card>

      <Card className='h-[130px] w-[190px] items-center gap-3 bg-green-500 p-2'>
        <CardHeader>
          <CardTitle>Điểm số</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center'>
            <p className='text-xl'> {data?.ratingAverage}</p>
            <p> {data?.ratingQuantity} lượt đánh giá</p>
          </div>
        </CardContent>
      </Card>
      <Card className='h-[130px] w-[190px] items-center gap-3 bg-yellow-500 p-2'>
        <CardHeader>
          <CardTitle>Đặt nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card className='h-[130px] w-[190px] items-center gap-3 bg-orange-500 p-2'>
        <CardHeader>
          <CardTitle>Đặt ít nhất</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card className='h-[130px] w-[190px] items-center gap-3 bg-red-500 p-2'>
        <CardHeader>
          <CardTitle>Số lượt hủy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl'>{data?.totalCancelledBookingOfHotel}</p>
        </CardContent>
      </Card>
    </div>
  )
}
