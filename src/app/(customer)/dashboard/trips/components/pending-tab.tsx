'use client'
import AlertDialogCancelBooking from '@/app/(customer)/dashboard/trips/components/alert-cancel-booking'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { formatDayWithDate, generateSlugUrl, removePhong, removePrefixBK } from '@/lib/utils'
import { BookingType } from '@/schemas/booking-schema'
import { useOrderStore } from '@/store/order-store'
import { differenceInCalendarDays } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type PendingTabProps = {
  data: BookingType[]
}
export default function PendingTab({ data }: PendingTabProps) {
  const [bookingCancel, setBookingCancel] = useState<BookingType | null>(null)
  const setOrder = useOrderStore((state) => state.setOrder)
  return (
    <div className='w-full'>
      <div className='flex flex-col gap-4'>
        {data.map((order) => {
          const isPayment = order.status === 'Đã thanh toán'
          const hotelUrl = `/khach-san-${generateSlugUrl(order?.locationName)}/${generateSlugUrl(order?.hotelName)}-chi-tiet`
          return (
            <Card key={order.bookingId} className='w-full transform gap-0 rounded border p-0 hover:shadow-lg'>
              <CardHeader className='flex flex-row items-center justify-between border-b p-3'>
                <div className='flex gap-2'>
                  <p className='text-[16px] font-semibold'>{order.hotelName}</p>
                  <Link href={hotelUrl}>
                    <Badge variant='outline' className='rounded font-normal'>
                      Xem khách sạn
                    </Badge>
                  </Link>
                </div>
                <p className='text-sm text-sky-500'>CHỜ XÁC NHẬN</p>
              </CardHeader>

              <CardContent className='grid grid-cols-1 gap-3 border-b px-3 py-3 md:grid-cols-12'>
                <Link
                  href={`/dashboard/trips/${removePrefixBK(order.bookingCode)}`}
                  className='contents'
                  onClick={() => setOrder({ bookingId: order.bookingId, status: 'CHỜ XÁC NHẬN' })}
                >
                  <div className='relative h-48 w-full overflow-hidden md:col-span-2 md:aspect-[4/3] md:h-auto'>
                    <Image src={order.roomTypeImage} alt={order.hotelName} fill className='object-cover' />
                  </div>
                  <div className='flex flex-col items-start gap-[2px] px-1 py-0 md:col-span-10'>
                    <p className='m-0 text-gray-500'>{`Loại phòng: Phòng ${removePhong(order.roomTypeName)}`}</p>
                    <p className='m-0 text-gray-500'>
                      {`Thời gian: ${formatDayWithDate(new Date(order.dayStart))} → ${formatDayWithDate(
                        new Date(order.dayEnd)
                      )} · ${differenceInCalendarDays(new Date(order.dayEnd), new Date(order.dayStart))} đêm`}
                    </p>
                    <p className='m-0 text-gray-500'>Số lượng: {order.roomQuantity} phòng</p>
                    {/* <div className='flex items-center gap-2'>
                      <p className='m-0 text-gray-500'>Trạng thái: </p>
                      <Badge className={isPayment ? 'bg-green-500' : 'bg-amber-400'}>{order.status}</Badge>
                    </div> */}
                  </div>
                </Link>
              </CardContent>

              <CardFooter className='flex justify-end p-3'>
                <div className='flex flex-col items-end gap-1'>
                  <p className='text-lg font-semibold text-sky-500'>
                    <span className='text-sm font-normal text-gray-500'>Thành tiền: </span>{' '}
                    {Number(order.finalPrice).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                  </p>
                  <button
                    disabled={isPayment}
                    className='group text-md rounded border border-gray-300 px-2 py-1 shadow-none hover:cursor-pointer enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400'
                    onClick={() => setBookingCancel(order)}
                  >
                    Hủy đơn
                  </button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      <AlertDialogCancelBooking bookingCancel={bookingCancel} setBookingCancel={setBookingCancel} />
    </div>
  )
}
