import { PartnerDashboardResType } from '@/types/partner-dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatisticProps = {
  data?: PartnerDashboardResType
}

type StatItem = {
  title: string
  value: number | undefined
  isCurrency?: boolean
}

export default function Statistic({ data }: StatisticProps) {
  const stats1: StatItem[] = [
    { title: 'Số lượng đánh giá', value: data?.ratingQuantity },
    { title: 'Điểm trung bình', value: data?.ratingAverage },
    { title: 'Số lượt đặt', value: data?.totalBookingOfHotel },
    { title: 'Số lượt hủy', value: data?.totalCancelledBookingOfHotel }
  ]

  const stats2: StatItem[] = [
    {
      title: 'Doanh thu ban đầu',
      value: data?.totalMoneyFilterResult?.[0]?.totalPrice,
      isCurrency: true
    },
    {
      title: 'Doanh thu cuối cùng',
      value: data?.totalMoneyFilterResult?.[0]?.totalFinalPrice,
      isCurrency: true
    },
    {
      title: 'Hoa hồng',
      value: data?.totalMoneyFilterResult?.[0]?.totalCommission,
      isCurrency: true
    },
    {
      title: 'Tiền chênh lệch',
      value: data?.totalMoneyFilterResult?.[0]?.totalMoney,
      isCurrency: true
    }
  ]

  const renderCards = (items: StatItem[]) =>
    items.map(({ title, value, isCurrency }, index) => (
      <Card key={index} className='bg-muted-50 flex-1 items-center gap-3 p-2'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl'>
            {value != null ? (isCurrency ? `${value.toLocaleString('vi-VN')} VNĐ` : value) : '—'}
          </p>
        </CardContent>
      </Card>
    ))

  return (
    <div className='space-y-3'>
      <div className='flex w-full items-center gap-5 py-0'>{renderCards(stats1)}</div>
      <div className='flex w-full items-center gap-5 py-0'>{renderCards(stats2)}</div>
    </div>
  )
}
