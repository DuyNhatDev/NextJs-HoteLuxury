import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useCheckBooking } from '@/queries/useBooking'
import { BookingType } from '@/schemaValidations/booking-schema'
import { BadgeCheck } from 'lucide-react'

type CancelBookingProps = {
  bookingCheck: BookingType | null
  setBookingCheck: (value: BookingType | null) => void
}

export default function AlertDialogCheckBooking({ bookingCheck, setBookingCheck }: CancelBookingProps) {
  const checkBookingQuery = useCheckBooking(bookingCheck?.bookingId ?? 0, Boolean(bookingCheck?.bookingId))

  const res = checkBookingQuery.data?.payload?.status
  const message = res === 'OK' ? 'Còn đủ phòng' : 'Đã hết phòng'

  const iconBgClass = `mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
    res === 'OK' ? 'bg-green-500/10' : 'bg-destructive/10'
  }`

  const iconClass = `h-7 w-7 ${res === 'OK' ? 'text-green-500' : 'text-destructive'}`

  return (
    <AlertDialog
      open={Boolean(bookingCheck)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingCheck(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className={iconBgClass}>
              <BadgeCheck className={iconClass} />
            </div>
            {message}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2 sm:justify-center'>
          <AlertDialogCancel>Đóng</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
