import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from '@mui/x-charts'
import React from 'react'
type BookingChartData = {
  month: string
  totalBookings: number
}
type PartnerBookingChartProps = {
  chartData: BookingChartData[]
}
export default function PartnerBookingChart({ chartData }: PartnerBookingChartProps) {
  return (
    <Card className='items-center gap-3 pt-3 pb-0'>
      <CardHeader>
        <CardTitle>Biểu đồ số lượng đặt phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          width={450}
          height={280}
          series={[
            {
              dataKey: 'totalBookings',
              label: 'Lượt đặt phòng'
            }
          ]}
          dataset={chartData}
          xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
          yAxis={[{ dataKey: 'totalBookings' }]}
        />
      </CardContent>
    </Card>
  )
}
