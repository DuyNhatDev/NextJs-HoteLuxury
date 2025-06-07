'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCalculateFinalPriceBookingMutation } from '@/hooks/queries/useBooking'
import { useGetSuitableVoucher } from '@/hooks/queries/useVoucher'
import { getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { useBookingStore } from '@/store/booking-store'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DialogVoucher() {
  const userId = getUserIdFromLocalStorage()
  const booking = useBookingStore((state) => state.booking)
  const [open, setOpen] = useState(false)
  const setBooking = useBookingStore((state) => state.setBooking)
  const { data } = useGetSuitableVoucher(booking.price, open)
  const { mutateAsync } = useCalculateFinalPriceBookingMutation()
  const vouchers = data?.payload?.data || []
  const [selectedCode, setSelectedCode] = useState('')

  const handleApply = async () => {
    if (!selectedCode) {
      toast.info('Vui lòng chọn hoặc nhập mã khuyến mãi')
      return
    } else {
      try {
        await mutateAsync({ userId: Number(userId), price: String(booking.price), voucherCode: selectedCode })
        setBooking({ voucherCode: selectedCode })
        setOpen(false)
      } catch (error) {
        handleErrorApi({
          error
        })
        setSelectedCode('')
      }
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <span className={`text-blue-400 underline hover:cursor-pointer ${selectedCode ? 'text-lg' : 'text-[15px]'}`}>
          {selectedCode || 'Chọn hoặc nhập mã khuyến mãi?'}
        </span>
      </DialogTrigger>
      <DialogContent className='p-4'>
        <DialogHeader className='-mx-4 border-b pb-3 pl-4'>
          <DialogTitle>Sử dụng mã khuyến mãi</DialogTitle>
        </DialogHeader>
        <div className='flex items-center gap-4'>
          <Input
            tabIndex={-1}
            placeholder='Nhập mã khuyến mãi'
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
          />
          <Button onClick={handleApply}>Áp dụng</Button>
        </div>
        {vouchers.length > 0 && <p className='4 font-semibold'>Voucher khả dụng</p>}
        {vouchers.map((voucher) => {
          const { code, quantity, discountType } = voucher
          const isFixed = discountType === 'fixed'
          const isSelected = selectedCode === code
          return (
            <div
              key={voucher.voucherId}
              className={`flex items-end justify-between gap-2 border p-2 hover:cursor-pointer sm:items-center ${
                isSelected ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => {
                if (isSelected) {
                  setSelectedCode('')
                  setBooking({ voucherCode: '' })
                } else {
                  setSelectedCode(code)
                }
              }}
            >
              <div className='flex flex-1 flex-row items-start gap-2 sm:items-center'>
                <div className='relative h-16 w-20 shrink-0 overflow-hidden'>
                  <Image
                    src={isFixed ? '/image/fixed-voucher.png' : '/image/percentage-voucher.png'}
                    alt='Hình ảnh'
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-col self-center text-sm sm:text-base'>
                  <p className='text-blue-600'>Mã voucher: {code}</p>
                  <p>{voucher.content}</p>
                </div>
              </div>
              <p className='shrink-0 text-right text-sm whitespace-nowrap sm:text-lg'>x {quantity}</p>
            </div>
          )
        })}
      </DialogContent>
    </Dialog>
  )
}
