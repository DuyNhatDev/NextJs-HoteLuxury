import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import React from 'react'
type BookingChartData = {
  month: string
  totalBookings: number
}
type PartnerBookingChartProps = {
  chartData: BookingChartData[]
}
export default function PartnerBookingChart({ chartData }: PartnerBookingChartProps) {
  console.log(chartData)
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))'
    }
  } satisfies ChartConfig
  return (
    <Card className='items-center gap-3'>
      <CardHeader>
        <CardTitle>Biểu đồ số lượng đặt phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='desktop' fill='var(--color-desktop)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
