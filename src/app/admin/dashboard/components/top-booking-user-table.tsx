import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { TopBookingUser } from '@/types/admin-dashboard.type'

type TopUserTableProps = {
  data: TopBookingUser[]
}

export default function TopUserTable({ data }: TopUserTableProps) {
  return (
    <Card className='items-center gap-3 !py-6 pt-3 pb-0'>
      <CardHeader>
        <CardTitle>Top 10 khách hàng đặt nhiều nhất</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className='w-full table-fixed border-collapse border'>
          <TableHeader className='bg-muted-50'>
            <TableRow>
              <TableHead className='w-[10%] text-left'>Top</TableHead>
              <TableHead className='w-[20%] text-left'>Tên khách hàng</TableHead>
              <TableHead className='w-[25%] text-center'>Email</TableHead>
              <TableHead className='w-[15%] text-center'>Số điện thoại</TableHead>
              <TableHead className='w-[15%] text-right'>Tổng số đơn</TableHead>
              <TableHead className='w-[15%] text-right'>Tổng chi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((hotel, index) => (
              <TableRow key={hotel.userId}>
                <TableCell className='text-left'>{index + 1}</TableCell>
                <TableCell className='truncate text-left'>{hotel.userName}</TableCell>
                <TableCell className='truncate text-left'>{hotel.email}</TableCell>
                <TableCell className='truncate text-left'>{hotel.phoneNumber}</TableCell>
                <TableCell className='text-center'>{hotel.totalBooking}</TableCell>
                <TableCell className='text-right'>{formatCurrency(hotel.totalPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
