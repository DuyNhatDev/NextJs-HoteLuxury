'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useGetSuitableVoucher } from '@/hooks/queries/useVoucher'
import { useBookingStore } from '@/store/booking-store'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DialogVoucher() {
  const booking = useBookingStore((state) => state.booking)
  const { data } = useGetSuitableVoucher(booking.price)
  const vouchers = data?.payload?.data || []
  const [code, setCode] = useState('')

  const handleApply = () => {
    if (code === '') {
      toast.info('Vui lòng chọn hoặc nhập mã khuyến mãi')
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <p className='text-[15px] text-blue-400 underline'>Chọn hoặc nhập mã khuyến mãi?</p>
      </DialogTrigger>
      <DialogContent className='px-4 pt-3'>
        <DialogHeader className='-mx-6 border-b pb-3 pl-6'>
          <DialogTitle>Sử dụng mã khuyến mãi?</DialogTitle>
        </DialogHeader>
        <div className='flex items-center gap-4'>
          <Input placeholder='Nhập mã khuyến mãi' value={code} onChange={(e) => setCode(e.target.value)} />
          <Button onClick={handleApply}>Áp dụng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
