import { PartnerDashboardType } from '@/types/dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
type StatisticProps = {
  data?: PartnerDashboardType
}
export default function Statistic({ data }: StatisticProps) {
  return (
    <div className='flex items-center justify-evenly gap-5 p-6'>
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
        <CardContent>
          {data?.totalBookingsByRoomType?.map((roomType) => (
            <div key={roomType.maxBookings[0]?.roomTypeId} className='flex flex-col items-center'>
              <p className='text-xl'>{roomType.maxBookings[0]?.totalBookings ?? 0}</p>
              <p>{roomType.maxBookings[0]?.roomTypeName ?? ''}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className='h-[130px] w-[190px] items-center gap-3 bg-orange-500 p-2'>
        <CardHeader>
          <CardTitle>Đặt ít nhất</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.totalBookingsByRoomType?.map((roomType) => (
            <div key={roomType.minBookings[0]?.roomTypeId} className='flex flex-col items-center'>
              <p className='text-xl'>{roomType.minBookings[0]?.totalBookings ?? 0}</p>
              <p>{roomType.minBookings[0]?.roomTypeName ?? ''}</p>
            </div>
          ))}
        </CardContent>
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
