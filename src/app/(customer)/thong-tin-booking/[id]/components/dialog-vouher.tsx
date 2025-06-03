'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useGetSuitableVoucher } from '@/hooks/queries/useVoucher'
import { useBookingStore } from '@/store/booking-store'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DialogVoucher() {
  const booking = useBookingStore((state) => state.booking)
  const setBooking = useBookingStore((state) => state.setBooking)
  const { data } = useGetSuitableVoucher(booking.price)
  const vouchers = data?.payload?.data || []
  const [open, setOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState('')

  const handleApply = () => {
    if (!selectedCode) {
      toast.info('Vui lòng chọn hoặc nhập mã khuyến mãi')
      return
    } else {
      setBooking({ voucherCode: selectedCode })
      setOpen(false)
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
        <p className={`text-blue-400 underline hover:cursor-pointer ${selectedCode ? 'text-lg' : 'text-[15px]'}`}>
          {selectedCode || 'Chọn hoặc nhập mã khuyến mãi?'}
        </p>
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
        {vouchers.length > 0 && <p className='mt-4 font-semibold'>Voucher khả dụng</p>}
        {vouchers.map((voucher) => {
          const { code, discountValue, minOrderValue, quantity, discountType } = voucher
          const isFixed = discountType === 'fixed'
          const isSelected = selectedCode === code
          return (
            <div
              key={voucher.voucherId}
              className={`mt-2 flex items-end justify-between gap-2 border p-2 hover:cursor-pointer sm:items-center ${
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
                  <p>
                    {isFixed ? `Giảm ${discountValue.toLocaleString('vi-VN')}đ` : `Giảm ${discountValue}%`} cho đơn từ{' '}
                    {minOrderValue.toLocaleString('vi-VN')}đ
                  </p>
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
