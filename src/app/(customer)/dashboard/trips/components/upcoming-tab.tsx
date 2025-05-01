'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type UpcomingTabProps = {
  data: BookingType[]
}
export default function UpcomingTab({ data }: UpcomingTabProps) {
  return (
    <div className='w-full'>
      {data.length === 0 ? <p className='text-center text-gray-500'>Chưa có đơn nào</p> : <h1>Sắp tới</h1>}
    </div>
  )
}
