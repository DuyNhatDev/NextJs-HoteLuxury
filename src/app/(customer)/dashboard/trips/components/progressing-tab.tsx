'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type ProgressingTabProps = {
  data: BookingType[]
}
export default function ProgressingTab({ data }: ProgressingTabProps) {
  return (
    <div className='w-full'>
      {data.length === 0 ? <p className='text-center text-gray-500'>Chưa có đơn nào</p> : <h1>Đang thực hiện</h1>}
    </div>
  )
}
