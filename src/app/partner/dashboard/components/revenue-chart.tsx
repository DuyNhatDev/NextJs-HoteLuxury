import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PartnerRevenueChartData } from '@/types/partner-dashboard.type'
import { LineChart } from '@mui/x-charts'

type PartnerRevenueChartProps = {
  chartData: PartnerRevenueChartData[]
}
export default function PartnerRevenueChart({ chartData }: PartnerRevenueChartProps) {
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
              dataKey: 'totalRevenue',
              label: 'Doanh thu (VND)'
            }
          ]}
          dataset={chartData}
          xAxis={[{ dataKey: 'month', scaleType: 'band', label: 'Tháng' }]}
          yAxis={[
            {
              dataKey: 'totalRevenue',
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
