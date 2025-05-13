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
import { handleErrorApi } from '@/lib/utils'
import { useRejectBookingMutation } from '@/queries/useBooking'
import { BookingType } from '@/schemaValidations/booking-schema'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

type RejectBookingProps = {
  bookingReject: BookingType | null
  setBookingReject: (value: BookingType | null) => void
}
export default function AlertDialogRejectBooking({ bookingReject, setBookingReject }: RejectBookingProps) {
  const { mutateAsync } = useRejectBookingMutation()
  const confirmBooking = async () => {
    if (bookingReject) {
      try {
        await mutateAsync(bookingReject.bookingId)
        setBookingReject(null)
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
      open={Boolean(bookingReject)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingReject(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-400/10'>
              <Info className='h-7 w-7 text-orange-400' />
            </div>
            <p>Từ chối đơn {bookingReject?.bookingCode}</p>
            <p className='text-center'>Khách hàng: {bookingReject?.customerName}</p>
          </AlertDialogTitle>
          <AlertDialogDescription>Hành động này không thể hoàn tác</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2 sm:justify-center'>
          <AlertDialogCancel>Đóng</AlertDialogCancel>
          <AlertDialogAction className='bg-blue-500 hover:bg-blue-500' onClick={confirmBooking}>
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
