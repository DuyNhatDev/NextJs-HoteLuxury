'use client'

import { BookingType } from '@/schemaValidations/booking-schema'

type PendingTabProps = {
  data: BookingType[]
}
export default function PendingTab({ data }: PendingTabProps) {
  return (
    <div className='w-full'>
      {data.length === 0 ? <p className='text-center text-gray-500'>Chưa có đơn nào</p> : <h1>Chờ xác nhận</h1>}
    </div>
  )
}
