'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useBookingStore } from '@/store/booking-store'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type DialogPoint = {
  point: number
}

export default function DialogPoint({ point }: DialogPoint) {
  const setBooking = useBookingStore((state) => state.setBooking)
  const [open, setOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState('0')

  useEffect(() => {
    setBooking({ point: Number(selectedPoint) })
  }, [selectedPoint, setBooking])

  const handleApply = () => {
    const numPoint = Number(selectedPoint)
    if (selectedPoint) {
      if (numPoint > 200) {
        toast.error('Bạn chỉ được dùng tối đa 200 điểm')
      } else if (numPoint > point) {
        toast.error('Số điểm của bạn không đủ')
      } else {
        setBooking({ point: numPoint })
        setOpen(false)
      }
    } else {
      toast.info('Vui lòng nhập số điểm')
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
        <span
          className={`text-blue-400 underline hover:cursor-pointer ${Number(selectedPoint) > 0 ? 'text-lg' : 'text-[15px]'}`}
        >
          {Number(selectedPoint) > 0 ? selectedPoint : 'Nhập số điểm?'}
        </span>
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
