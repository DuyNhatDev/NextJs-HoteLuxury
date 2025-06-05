import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { TopHotel } from '@/types/admin-dashboard.type'

type TopHotelTableProps = {
  data: TopHotel[]
}

export default function TopHotelTable({ data }: TopHotelTableProps) {
  return (
    <Card className='items-center gap-3 !py-6 pt-3 pb-0'>
      <CardHeader>
        <CardTitle>Top 10 khách sạn có doanh thu cao nhất</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className='w-full table-fixed border-collapse border'>
          <TableHeader className='bg-muted-50'>
            <TableRow>
              <TableHead className='w-[10%] text-left'>Top</TableHead>
              <TableHead className='w-[40%] text-left'>Tên khách sạn</TableHead>
              <TableHead className='w-[10%] text-center'>Tổng số đơn</TableHead>
              <TableHead className='w-[20%] text-right'>Tổng doanh thu</TableHead>
              <TableHead className='w-[20%] text-right'>Tổng hoa hồng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((hotel, index) => (
              <TableRow key={hotel.hotelId}>
                <TableCell className='text-left'>{index + 1}</TableCell>
                <TableCell className='truncate text-left'>{hotel.hotelName}</TableCell>
                <TableCell className='text-center'>{hotel.totalBooking}</TableCell>
                <TableCell className='text-right'>{formatCurrency(hotel.totalPrice)}</TableCell>
                <TableCell className='text-right'>{formatCurrency(hotel.totalMoney)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
