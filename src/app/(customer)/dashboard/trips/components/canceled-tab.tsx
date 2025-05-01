'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type CanceledTabProps = {
  data: BookingType[]
}
export default function CanceledTab({ data }: CanceledTabProps) {
  return (
    <div className='w-full'>
      {data.length === 0 ? <p className='text-center text-gray-500'>Chưa có đơn nào</p> : <h1>Đã hủy</h1>}
    </div>
  )
}
