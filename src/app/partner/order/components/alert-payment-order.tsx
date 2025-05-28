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
import { usePaymentBookingMutation } from '@/hooks/queries/useBooking'
import { BookingType } from '@/schemas/booking-schema'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

type PaymentBookingProps = {
  bookingPayment: BookingType | null
  setBookingPayment: (value: BookingType | null) => void
}
export default function AlertDialogPaymentBooking({ bookingPayment, setBookingPayment }: PaymentBookingProps) {
  const { mutateAsync } = usePaymentBookingMutation()
  const confirmBooking = async () => {
    if (bookingPayment) {
      try {
        await mutateAsync(bookingPayment.bookingId)
        setBookingPayment(null)
        toast.success('Thanh toán thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(bookingPayment)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingPayment(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-400/10'>
              <Info className='h-7 w-7 text-blue-400' />
            </div>
            <p>Thanh toán cho đơn {bookingPayment?.bookingCode}</p>
            <p className='text-center'>Khách hàng: {bookingPayment?.customerName}</p>
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
