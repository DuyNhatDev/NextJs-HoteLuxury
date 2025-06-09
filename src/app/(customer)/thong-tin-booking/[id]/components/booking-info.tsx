'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingStore } from '@/store/booking-store'
import { MapPin, Calendar, UserRound, ReceiptText, CircleAlert } from 'lucide-react'
import { differenceInCalendarDays } from 'date-fns'
import { formatDayWithDate, getUserIdFromLocalStorage, handleErrorApi, removePhong } from '@/lib/utils'
import DialogVoucher from '@/app/(customer)/thong-tin-booking/[id]/components/dialog-vouher'
import DialogPoint from '@/app/(customer)/thong-tin-booking/[id]/components/dialog-point'
import { useGetAccount } from '@/hooks/queries/useAccount'
import { useCalculateFinalPriceBookingMutation } from '@/hooks/queries/useBooking'
import { useEffect, useState } from 'react'
import { CalculateFinalPriceBookingResType } from '@/schemas/booking-schema'

export default function BookingInfo() {
  const booking = useBookingStore((state) => state.booking)
  const setBooking = useBookingStore((state) => state.setBooking)
  const userId = getUserIdFromLocalStorage()
  const { mutateAsync } = useCalculateFinalPriceBookingMutation()
  const { data: userData } = useGetAccount(userId ?? undefined, Boolean(userId))
  const point = userData?.payload?.data?.point ?? 0
  const [calculatePrice, setCalculatePrice] = useState<CalculateFinalPriceBookingResType['data'] | undefined>(undefined)
  useEffect(() => {
    const calculateFinalPrice = async () => {
      try {
        const result = await mutateAsync({
          userId: Number(userId),
          price: String(booking.price),
          voucherCode: booking.voucherCode,
          point: String(booking.point)
        })
        const data = result.payload.data
        setCalculatePrice(data)
        setBooking({ finalPrice: data.finalPrice })
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
    calculateFinalPrice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.price, booking.point, booking.voucherCode, userId])

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
          <span>Không thể hoàn hoặc thay đổi</span>
        </div>
        <div className='my-3 border-t'></div>
        <div className='my-2'>
          <p className='font-semibold text-blue-950'>Bạn có mã khuyến mãi?</p>
          <DialogVoucher />
        </div>
        {point > 0 && (
          <>
            <div className='my-3 border-t'></div>
            <div className='my-2'>
              <p className='font-semibold text-blue-950'>Sử dụng LuxuryPoint?</p>
              <DialogPoint point={point} />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className='flex flex-col border-t px-0 py-2'>
        {calculatePrice && (calculatePrice.voucherDiscount || calculatePrice.pointDiscount) && (
          <div className='flex w-full items-center justify-between'>
            <h2 className='text-gray-500'>Tổng tiền:</h2>
            <span className='text-base text-gray-500'>
              {calculatePrice.price.toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
            </span>
          </div>
        )}

        {calculatePrice && calculatePrice.voucherDiscount > 0 && (
          <div className='flex w-full items-center justify-between'>
            <h2 className='text-gray-500'>Giảm giá voucher:</h2>
            <span className='text-base text-orange-500'>
              - {calculatePrice?.voucherDiscount.toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
            </span>
          </div>
        )}

        {calculatePrice && calculatePrice.pointDiscount > 0 && (
          <div className='flex w-full items-center justify-between'>
            <h2 className='text-gray-500'>Giảm giá LuxuryPoint:</h2>
            <span className='text-base text-orange-500'>
              - {calculatePrice.pointDiscount.toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
            </span>
          </div>
        )}

        <div className='flex w-full items-center justify-between'>
          <h2 className='font-bold text-blue-950'>Tổng thanh toán:</h2>
          <span className='font-bold text-sky-500'>
            {calculatePrice?.finalPrice.toLocaleString('vi-VN')} <span className='text-sm'>VND</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
