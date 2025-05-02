'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingStore } from '@/store/booking-store'
import { MapPin, Calendar, UserRound, ReceiptText, CircleAlert } from 'lucide-react'
import { differenceInCalendarDays } from 'date-fns'
import { formatDayWithDate, removePhong } from '@/lib/utils'

export default function BookingInfo() {
  const booking = useBookingStore((state) => state.booking)

  return (
    <Card className='w-full gap-2 rounded-sm p-3'>
      <CardHeader className='px-0'>
        <CardTitle className='text-md text-blue-900'>{booking.hotelName}</CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <div className='my-2 flex items-start text-gray-500'>
          <MapPin className='mr-2 h-7 w-7' />
          <span className='break-words'>{booking.hotelAddress}</span>
        </div>
        <div className='my-2 flex items-center'>
          <Calendar className='mr-2 h-4 w-4' />
          <span>{`${formatDayWithDate(booking.dayStart)} → ${formatDayWithDate(booking.dayEnd)} · ${differenceInCalendarDays(booking.dayEnd, booking.dayStart)} đêm`}</span>
        </div>
        <div className='my-2 flex items-center'>
          <UserRound className='mr-2 h-4 w-4' />
          <span>{`${booking.currentRooms} Phòng ${removePhong(booking.roomTypeName)}`}</span>
        </div>
        <div className='my-2 flex items-center'>
          <ReceiptText className='mr-2 h-4 w-4' />
          <span>{`${booking.adultQuantity} người lớn · ${booking.childQuantity} trẻ em`}</span>
        </div>
        <div className='my-2 flex items-center text-gray-500'>
          <CircleAlert className='mr-2 h-4 w-4' />
          <span>Không thể hoàn hoặc hủy thay đổi</span>
        </div>
      </CardContent>
      <CardFooter className='border-t px-0 py-2'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='font-bold text-blue-900'>Tổng thanh toán:</h2>
          <span className='font-bold text-sky-500'>
            {Number(booking.price).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
