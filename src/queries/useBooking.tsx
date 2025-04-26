import bookingApiRequest from '@/apiRequests/booking'
import { useMutation } from '@tanstack/react-query'

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: bookingApiRequest.createBooking,
  })
}
