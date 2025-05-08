'use client'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetBookingList } from '@/queries/useBooking'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
export default function OrderTable() {
  const orderListQuery = useGetBookingList({})
  const orderList = orderListQuery?.data?.payload?.data || []
  return (
    <div className='w-full'>
      <div className='overflow-x-auto rounded-md border'>
        <Table className='mw-full border-collapse'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[16.66%]'>Tên khách hàng</TableHead>
              <TableHead className='w-[16.66%]'>Số điện thoại</TableHead>
              <TableHead className='w-[16.66%]'>Ngày đặt</TableHead>
              <TableHead className='w-[16.66%]'>Trạng thái</TableHead>
              <TableHead className='w-[16.66%]'>Xác nhận</TableHead>
              <TableHead className='w-[16.66%]'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order.bookingId}>
                <TableCell className='w-[16.66%] break-words'>{order.customerName}</TableCell>
                <TableCell className='w-[16.66%] break-words'>{order.customerPhone}</TableCell>
                <TableCell className='w-[16.66%] break-words'>
                  {format(parseISO(String(order.createdAt)), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell className='w-[16.66%] break-words'>{order.status}</TableCell>
                <TableCell className='w-[16.66%] break-words'>
                  {order.isConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                </TableCell>
                <TableCell className='w-[16.66%] break-words'>
                  <Button>Xác nhận</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
