import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminRevenueChartData } from '@/types/admin-dashboard.type'
import { LineChart } from '@mui/x-charts'

type AdminRevenueChartProps = {
  chartData: AdminRevenueChartData[]
}
export default function AdminRevenueChart({ chartData }: AdminRevenueChartProps) {
  return (
    <Card className='items-center gap-3 pt-3 pb-0'>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          width={1000}
          height={400}
          series={[
            {
              dataKey: 'totalCommission',
              label: 'Doanh thu (VND)'
            }
          ]}
          dataset={chartData}
          xAxis={[{ dataKey: 'month', scaleType: 'band', label: 'Tháng' }]}
          yAxis={[
            {
              dataKey: 'totalCommission',
              min: 0,
              label: 'Doanh thu (VND)',
              valueFormatter: (value: number) => `${value / 1_000_000}tr`
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}
