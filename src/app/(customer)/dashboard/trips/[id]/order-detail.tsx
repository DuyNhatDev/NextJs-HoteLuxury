'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useGetDetailBooking } from '@/queries/useBooking'
import { useOrderStore } from '@/store/order-store'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OrderDetail() {
  const router = useRouter()
  const bookingId = useOrderStore((state) => state.bookingId)
  const { data } = useGetDetailBooking(bookingId, Boolean(bookingId))
  const order = data?.payload?.data
  return (
    <Card className='gap-0 rounded'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <button className='flex items-center text-gray-500 hover:cursor-pointer' onClick={() => router.back()}>
          <ChevronLeft className='mr-1 h-5 w-5 text-gray-500' />
          TRỞ LẠI
        </button>
      </CardHeader>
      <CardContent className='space-y-4'>{order?.bookingCode}</CardContent>
    </Card>
  )
}
