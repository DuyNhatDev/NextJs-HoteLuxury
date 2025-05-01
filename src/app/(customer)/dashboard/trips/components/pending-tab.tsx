'use client'

import { BookingType } from "@/schemaValidations/booking-schema"

type PendingTabProps = {
  data: BookingType[]
}
export default function PendingTab({ data }: PendingTabProps) {
  return (
    <div>
      <h1>Chờ xác nhận</h1>
    </div>
  )
}
