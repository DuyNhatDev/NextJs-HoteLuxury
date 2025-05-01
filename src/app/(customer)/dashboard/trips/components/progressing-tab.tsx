'use client'
import { BookingType } from '@/schemaValidations/booking-schema'

type ProgressingTabProps = {
  data: BookingType[]
}
export default function ProgressingTab({ data }: ProgressingTabProps) {
  return (
    <div>
      <h1>Đang thực hiện</h1>
    </div>
  )
}
