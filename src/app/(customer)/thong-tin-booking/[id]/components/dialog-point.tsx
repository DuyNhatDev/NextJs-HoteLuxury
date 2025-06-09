'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useBookingStore } from '@/store/booking-store'
import { useState } from 'react'
import { toast } from 'sonner'

type DialogPointProps = {
  point: number
}

export default function DialogPoint({ point }: DialogPointProps) {
  const setBooking = useBookingStore((state) => state.setBooking)
  const [open, setOpen] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState('')
  const numPoint = Number(selectedPoint)
  const handleApply = () => {
    if (selectedPoint) {
      if (numPoint > 200) {
        toast.error('Bạn chỉ được dùng tối đa 200 điểm')
      } else if (numPoint > point) {
        toast.error('Số điểm của bạn không đủ')
      } else {
        setBooking({ point: numPoint })
        setOpen(false)
      }
      setIsApplied(true)
    } else {
      toast.info('Vui lòng nhập số điểm')
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsApplied(false)
        }
        setOpen(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <div className='flex items-center justify-between'>
          <span
            className={`text-blue-400 hover:cursor-pointer ${Number(selectedPoint) > 0 ? 'text-lg' : 'text-[15px] underline'}`}
          >
            {isApplied && numPoint > 0 && numPoint < point ? selectedPoint : 'Nhập số điểm?'}
          </span>
          {isApplied && numPoint > 0 && numPoint < point && (
            <span className={`text-[15px] text-blue-400 underline hover:cursor-pointer`}>Thay đổi</span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className='p-4'>
        <DialogHeader className='-mx-4 border-b pb-3 pl-4'>
          <DialogTitle>Sử dụng LuxuryPoint</DialogTitle>
        </DialogHeader>
        <p className='font-semibold'>Điểm của bạn: {point}</p>
        <div className='flex items-center gap-4'>
          <Input
            tabIndex={-1}
            placeholder='Nhập số điểm'
            value={selectedPoint}
            onChange={(e) => {
              const value = e.target.value
              if (/^\d*$/.test(value)) {
                setSelectedPoint(value)
              }
            }}
          />
          <Button onClick={handleApply}>Áp dụng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
