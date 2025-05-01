'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type CanceledTabProps = {
  data: BookingType[]
}
export default function CanceledTab({ data }: CanceledTabProps) {
  return (
    <div>
      <h1>Đã hủy</h1>
    </div>
  )
}
