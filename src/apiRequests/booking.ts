import http from '@/lib/http'
import { BookingResType, BookingType } from '@/schemaValidations/booking-schema'
const prefix = '/booking'
const bookingApiRequest = {
  createBooking: (body: BookingType) => http.post<BookingResType>(`${prefix}`, body),
}
export default bookingApiRequest
