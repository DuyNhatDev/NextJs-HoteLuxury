'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type CompletedTabProps = {
  data: BookingType[]
}
export default function CompletedTab({ data }: CompletedTabProps) {
  return (
    <div className='w-full'>
      {data.length === 0 ? <p className='text-center text-gray-500'>Chưa có đơn nào</p> : <h1>Đã hoàn thành</h1>}
    </div>
  )
}
