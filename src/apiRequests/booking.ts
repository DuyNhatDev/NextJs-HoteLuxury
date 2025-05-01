import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
import { CreateBookingResType, CreateBookingBodyType, BookingListResType } from '@/schemaValidations/booking-schema'
const prefix = '/booking'
const bookingApiRequest = {
  createBooking: (body: CreateBookingBodyType) => {
    const formData = objectToFormData(body)
    return http.post<CreateBookingResType>(`${prefix}`, formData)
  },
  getPending: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Chờ xác nhận`),
  getUpcoming: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đã xác nhận`),
  getProgressing: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đang thực hiện`),
  getCompleted: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đã hoàn tất`),
  getCanceled: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đã hủy`)
}
export default bookingApiRequest
