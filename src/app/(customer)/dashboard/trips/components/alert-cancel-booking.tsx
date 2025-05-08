import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { handleErrorApi, removePhong } from '@/lib/utils'
import { useCancelBookingMutation } from '@/queries/useBooking'
import { BookingType } from '@/schemaValidations/booking-schema'
import { toast } from 'sonner'

type CancelBookingProps = {
  bookingCancel: BookingType | null
  setBookingCancel: (value: BookingType | null) => void
}
export default function AlertDialogCancelBooking({ bookingCancel, setBookingCancel }: CancelBookingProps) {
  const { mutateAsync } = useCancelBookingMutation()
  const cancelBooking = async () => {
    if (bookingCancel) {
      try {
        await mutateAsync(bookingCancel.bookingId)
        setBookingCancel(null)
        toast.success('Từ chối thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(bookingCancel)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingCancel(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hủy đơn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn hủy đơn đặt
            <span className='rounded px-1 font-bold'>
              {bookingCancel?.hotelName}, Phòng {removePhong(bookingCancel?.roomTypeName ?? '')}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Đóng</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={cancelBooking}>
            Hủy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
