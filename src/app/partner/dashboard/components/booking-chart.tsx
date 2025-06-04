import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@mui/x-charts'
import React from 'react'

type BookingChartData = {
  month: number
  [roomType: string]: number
}

type PartnerBookingChartProps = {
  chartData: BookingChartData[]
}

export default function PartnerBookingChart({ chartData }: PartnerBookingChartProps) {
  const roomTypes = chartData.length > 0 ? Object.keys(chartData[0]).filter((key) => key !== 'month') : []
  const series = roomTypes.map((roomType) => ({
    dataKey: roomType,
    label: roomType
  }))

  return (
    <Card className='items-center gap-3 pt-3 pb-0'>
      <CardHeader>
        <CardTitle>Biểu đồ số lượng đặt phòng theo từng loại phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          width={1000}
          height={400}
          dataset={chartData}
          series={series}
          xAxis={[
            {
              dataKey: 'month',
              scaleType: 'band',
              label: 'Tháng',
              valueFormatter: (value: number) => `Tháng ${value}`
            }
          ]}
          yAxis={[
            {
              min: 0,
              label: 'Số lượt đặt phòng',
              valueFormatter: (value: number) => (Number.isInteger(value) ? value.toString() : '')
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}
