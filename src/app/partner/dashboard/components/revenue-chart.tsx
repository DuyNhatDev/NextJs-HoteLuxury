import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
type RevenueChartData = {
  month: string
  totalRevenue: number
}
type PartnerRevenueChartProps = {
  chartData: RevenueChartData[]
}
export default function PartnerRevenueChart({ chartData }: PartnerRevenueChartProps) {
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))'
    }
  } satisfies ChartConfig
  console.log(chartData)
  return (
    <Card className='items-center gap-3'>
      <CardHeader>
        <CardTitle>Biểu đồ số lượng đặt phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey='totalRevenue' type='natural' stroke='var(--color-desktop)' strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
