'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDayWithDate, generateSlugUrl, removePhong } from '@/lib/utils'
import { useGetDetailBooking } from '@/hooks/queries/useBooking'
import { useOrderStore } from '@/store/order-store'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrderDetail() {
  const router = useRouter()
  const order = useOrderStore((state) => state.order)
  const orderQuery = useGetDetailBooking(order.bookingId, Boolean(order.bookingId))
  const data = orderQuery?.data?.payload?.data
  if (!data) return null
  const hotelUrl = `/khach-san-${generateSlugUrl(data.locationName)}/${generateSlugUrl(data.hotelName)}-chi-tiet`
  return (
    <Card className='gap-0 rounded py-4'>
      <CardHeader className='flex-row items-center justify-between border-b pb-4 not-first-of-type:flex'>
        <button className='flex items-center text-gray-500 hover:cursor-pointer' onClick={() => router.back()}>
          <ChevronLeft className='mr-1 h-5 w-5 text-gray-500' />
          TRỞ LẠI
        </button>
        <p>
          MÃ ĐƠN: {data.bookingCode} | <span className='text-[16px] text-sky-500'>{order.status}</span>
        </p>
      </CardHeader>
      <CardContent className='px-3'>
        <div className='w-full transform gap-0 rounded border-none p-0'>
          <div className='flex items-center justify-between p-3'>
            <p className='text-sm'>Đặt vào lúc: {format(parseISO(String(data.createdAt)), 'HH:mm dd/MM/yyyy')}</p>
          </div>

          <div className='items-star flex flex-col px-3 py-0'>
            <p className='text-lg'>Thông tin người đặt</p>
            <p className='text-gray-500'>Họ tên: {data.customerName}</p>
            <p className='text-gray-500'>Số điện thoại: {data.customerPhone}</p>
            <p className='text-gray-500'>Email: {data.customerEmail}</p>
            <p className='text-gray-500'>Ghi chú: {data.note ? data.note : 'Không có ghi chú'}</p>
          </div>

          <div className='flex items-center justify-between border-b p-3'>
            <div className='flex gap-2'>
              <p className='text-[16px] font-semibold'>{data.hotelName}</p>
              <Link href={hotelUrl}>
                <Badge variant='outline' className='rounded font-normal'>
                  Xem khách sạn
                </Badge>
              </Link>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 border-b px-3 py-3 md:grid-cols-12'>
            <div className='relative h-48 w-full overflow-hidden md:col-span-2 md:aspect-[4/3] md:h-auto'>
              <Image src={data.roomTypeImage} alt={data.hotelName} fill className='object-cover' />
            </div>
            <div className='flex flex-col items-start gap-[2px] px-1 py-0 md:col-span-10'>
              <p className='m-0 text-gray-500'>{`Loại phòng: Phòng ${removePhong(data.roomTypeName ?? '')}`}</p>
              <p className='m-0 text-gray-500'>
                {`Thời gian: ${formatDayWithDate(new Date(data.dayStart))} → ${formatDayWithDate(
                  new Date(data.dayEnd)
                )} · ${differenceInCalendarDays(new Date(data.dayEnd), new Date(data.dayStart))} đêm`}
              </p>
              <p className='m-0 text-gray-500'>Số lượng: {data.roomQuantity} phòng</p>
            </div>
          </div>

          <div className='flex justify-end p-3'>
            <div className='flex w-full max-w-sm flex-col gap-1'>
              <div className='grid grid-cols-2 gap-x-4 text-base text-gray-600'>
                {((data?.voucherDiscount ?? 0) > 0 || (data?.pointDiscount ?? 0) > 0) && (
                  <>
                    <span className='font-normal'>Giá:</span>
                    <span className='text-right'>
                      {Number(data?.price ?? 0).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                    </span>
                  </>
                )}

                {data.voucherDiscount && data.voucherDiscount > 0 && (
                  <>
                    <span className='font-normal'>Giảm giá voucher:</span>
                    <span className='text-right'>
                      - {Number(data.voucherDiscount).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                    </span>
                  </>
                )}

                {data?.pointDiscount && data?.pointDiscount > 0 && (
                  <>
                    <span className='font-normal'>Giảm giá LuxuryPoint:</span>
                    <span className='text-right'>
                      - {Number(data.pointDiscount).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                    </span>
                  </>
                )}

                <span className='font-semibold text-sky-500'>Thành tiền:</span>
                <span className='text-right font-semibold text-sky-500'>
                  {Number(data?.finalPrice ?? 0).toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
