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
import { useConfirmBookingMutation } from '@/hooks/queries/useBooking'
import { BookingType } from '@/schemaValidations/booking-schema'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

type ConfirmBookingProps = {
  bookingConfirm: BookingType | null
  setBookingConfirm: (value: BookingType | null) => void
}
export default function AlertDialogConfirmBooking({ bookingConfirm, setBookingConfirm }: ConfirmBookingProps) {
  const { mutateAsync } = useConfirmBookingMutation()
  const confirmBooking = async () => {
    if (bookingConfirm) {
      try {
        await mutateAsync(bookingConfirm.bookingId)
        setBookingConfirm(null)
        toast.success('Xác nhận thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(bookingConfirm)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingConfirm(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-400/10'>
              <Info className='h-7 w-7 text-blue-400' />
            </div>
            <p>Xác nhận cho đơn {bookingConfirm?.bookingCode}</p>
            <p className='text-center'>Khách hàng: {bookingConfirm?.customerName}</p>
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
