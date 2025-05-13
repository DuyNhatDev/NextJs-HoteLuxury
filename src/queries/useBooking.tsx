import bookingApiRequest from '@/apiRequests/booking'
import { BookingParamsType } from '@/schemaValidations/booking-schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: bookingApiRequest.createBooking
  })
}

export const useGetPendingBookingList = () => {
  return useQuery({
    queryKey: ['pending-bookings'],
    queryFn: bookingApiRequest.getPending
  })
}
export const useGetUpcomingBookingList = () => {
  return useQuery({
    queryKey: ['upcoming-bookings'],
    queryFn: bookingApiRequest.getUpcoming
  })
}
export const useGetProgressingBookingList = () => {
  return useQuery({
    queryKey: ['progressing-bookings'],
    queryFn: bookingApiRequest.getProgressing
  })
}
export const useGetCompletedBookingList = () => {
  return useQuery({
    queryKey: ['completed-bookings'],
    queryFn: bookingApiRequest.getCompleted
  })
}
export const useGetCanceledBookingList = () => {
  return useQuery({
    queryKey: ['canceled-bookings'],
    queryFn: bookingApiRequest.getCanceled
  })
}

export const useCancelBookingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bookingApiRequest.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['canceled-bookings'] })
    }
  })
}

export const useGetBookingList = (queryParams: BookingParamsType) => {
  return useQuery({
    queryFn: () => bookingApiRequest.getBookingListByPartner(queryParams),
    queryKey: ['booking-list', queryParams]
  })
}
export const useCheckBooking = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryFn: () => bookingApiRequest.checkBooking(id!),
    queryKey: ['check-booking', id],
    enabled: !!id && enabled
  })
}

export const useConfirmBookingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bookingApiRequest.confirmBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-list'] })
    }
  })
}

export const useRejectBookingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bookingApiRequest.rejectBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-list'] })
    }
  })
}
export const useConfirmPaymentBookingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bookingApiRequest.confirmPaymentBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-list'] })
    }
  })
}
