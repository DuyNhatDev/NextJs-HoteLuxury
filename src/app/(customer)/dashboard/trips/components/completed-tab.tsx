'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type CompletedTabProps = {
  data: BookingType[]
}
export default function CompletedTab({ data }: CompletedTabProps) {
  return (
    <div>
      <h1>Đã hoàn thành</h1>
    </div>
  )
}
