import { AdminDashboardResType } from '@/types/admin-dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatisticProps = {
  data?: AdminDashboardResType
}

type StatItem = {
  title: string
  value: number | undefined
  isCurrency?: boolean
}

export default function Statistic({ data }: StatisticProps) {
  const stats: StatItem[] = [
    {
      title: 'Tổng số khách sạn',
      value: data?.totalHotel
    },
    {
      title: 'Số người dùng mới',
      value: data?.totalNewUser
    },
    {
      title: 'Tổng doanh thu',
      value: data?.totalCommission,
      isCurrency: true
    },
    {
      title: 'Tổng thu nhập',
      value: data?.totalMoney,
      isCurrency: true
    }
  ]
  return (
    <div className='space-y-3'>
      <div className='flex w-full items-center gap-5 py-0'>
        {stats.map(({ title, value, isCurrency }, index) => (
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
        ))}
      </div>
    </div>
  )
}
