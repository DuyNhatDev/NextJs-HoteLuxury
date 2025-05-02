'use client'
import AlertDialogCancelBooking from '@/app/(customer)/dashboard/trips/components/cancel-booking'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDayWithDate, removePhong } from '@/lib/utils'
import { BookingType } from '@/schemaValidations/booking-schema'
import { differenceInCalendarDays } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type PendingTabProps = {
  data: BookingType[]
}
export default function PendingTab({ data }: PendingTabProps) {
  const [bookingCancel, setBookingCancel] = useState<BookingType | null>(null)
  return (
    <div className='w-full'>
      <div className='flex flex-col gap-4'>
        {data.map((order) => {
          return (
            <Card
              key={order.bookingId}
              className='grid w-full transform grid-cols-1 gap-3 rounded border p-3 hover:shadow-lg md:grid-cols-12'
            >
              <Link href='#' className='contents'>
                <div className='relative h-48 w-full overflow-hidden md:col-span-2 md:aspect-[4/3] md:h-auto'>
                  <Image src={order.roomTypeImage} alt={order.hotelName} fill className='object-cover' />
                </div>

                <CardContent className='flex flex-col justify-between gap-1 px-0 py-0 md:col-span-7'>
                  <div className='flex flex-1 flex-col gap-0 px-1'>
                    <p className='line-clamp-2 text-lg'>{order.hotelName}</p>
                    <p className='text-gray-500'>
                      {`Loại phòng: Phòng ${removePhong(order.roomTypeName)}`}
                      <span className='ml-3'>x{order.roomQuantity}</span>
                    </p>
                    <p className='text-gray-500'>
                      {`Thời gian: ${formatDayWithDate(new Date(order.dayStart))} → ${formatDayWithDate(
                        new Date(order.dayEnd)
                      )} · ${differenceInCalendarDays(new Date(order.dayEnd), new Date(order.dayStart))} đêm`}
                    </p>
                  </div>
                </CardContent>
              </Link>

              <div className='flex items-end justify-end px-3 md:col-span-3 md:items-center'>
                <div className='flex flex-col gap-1 text-right'>
                  <p className='text-lg font-semibold text-sky-500'>
                    {Number(order.price).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                  </p>
                  <Button variant='outline' onClick={() => setBookingCancel(order)}>
                    Hủy đơn
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <AlertDialogCancelBooking bookingCancel={bookingCancel} setBookingCancel={setBookingCancel} />
    </div>
  )
}
