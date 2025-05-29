import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@mui/x-charts'
type RevenueChartData = {
  month: string
  totalRevenue: number
}
type PartnerRevenueChartProps = {
  chartData: RevenueChartData[]
}
export default function PartnerRevenueChart({ chartData }: PartnerRevenueChartProps) {
  return (
    <Card className='items-center gap-3 pt-3 pb-0'>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          width={450}
          height={280}
          series={[
            {
              dataKey: 'totalRevenue',
              label: 'Doanh thu (VND)'
            }
          ]}
          dataset={chartData}
          xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
          yAxis={[
            {
              dataKey: 'totalRevenue',
              min: 0,
              valueFormatter: (value: number) => `${value / 1_000_000}tr`
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}
