import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
import { BookingResType, BookingType } from '@/schemaValidations/booking-schema'
const prefix = '/booking'
const bookingApiRequest = {
  createBooking: (body: BookingType) => {
    const formData = objectToFormData(body)
    return http.post<BookingResType>(`${prefix}`, formData)
  }
}
export default bookingApiRequest
