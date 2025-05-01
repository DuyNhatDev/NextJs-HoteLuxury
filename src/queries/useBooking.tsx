import bookingApiRequest from '@/apiRequests/booking'
import { useMutation, useQuery } from '@tanstack/react-query'

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
