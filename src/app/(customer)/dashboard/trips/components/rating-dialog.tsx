import React from 'react'

type RatingDialogProps = {
  open: boolean
  setOpen: (value: boolean) => void
  hotelId: number
  bookingId: number
}

export default function RatingDialog({ open, setOpen, hotelId, bookingId }: RatingDialogProps) {
  return <div></div>
}
