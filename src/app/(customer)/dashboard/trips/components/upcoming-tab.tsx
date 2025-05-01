'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type UpcomingTabProps = {
  data: BookingType[]
}
export default function UpcomingTab({ data }: UpcomingTabProps) {
  return (
    <div>
      <h1>Sắp tới</h1>
    </div>
  )
}
