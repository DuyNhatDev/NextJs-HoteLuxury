import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { TopBookingUser } from '@/types/partner-dashboard.type'

type TopBookingUserTableProps = {
  data: TopBookingUser[]
}

export default function TopBookingUserTable({ data }: TopBookingUserTableProps) {
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
              <TableHead className='w-[20%] text-left'>Họ tên</TableHead>
              <TableHead className='w-[30%] text-left'>Email</TableHead>
              <TableHead className='w-[15%] text-center'>Số điện thoại</TableHead>
              <TableHead className='w-[5%] text-center'>Số lần đặt</TableHead>
              <TableHead className='w-[20%] text-right'>Tổng tiền đã chi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user, index) => (
              <TableRow key={user.userId}>
                <TableCell className='text-left'>{index + 1}</TableCell>
                <TableCell className='truncate'>{user.fullname}</TableCell>
                <TableCell className='truncate'>{user.email}</TableCell>
                <TableCell className='text-center'>{user.phoneNumber ?? '-'}</TableCell>
                <TableCell className='text-center'>{user.totalBookings}</TableCell>
                <TableCell className='text-right'>{formatCurrency(user.totalPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
