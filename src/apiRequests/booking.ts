import http from '@/lib/http'
import { buildQueryParams } from '@/lib/utils'
import {
  CreateBookingResType,
  CreateBookingBodyType,
  BookingListResType,
  BookingParamsType
} from '@/schemaValidations/booking-schema'

const prefix = '/booking'

const bookingApiRequest = {
  createBooking: (body: CreateBookingBodyType) => http.post<CreateBookingResType>(`${prefix}`, body),
  getPending: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Chờ xác nhận`),
  getUpcoming: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đã xác nhận`),
  getProgressing: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đang thực hiện`),
  getCompleted: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đã hoàn tất`),
  getCanceled: () => http.get<BookingListResType>(`${prefix}?bookingStatus=Đã hủy`),
  cancelBooking: (id: number) => http.put(`${prefix}/${id}`, { isConfirmed: true, status: 'Đã hủy' }),
  getBookingListByPartner: (queryParams: BookingParamsType) =>
    http.get<BookingListResType>(`${prefix}/by-partner?` + buildQueryParams(queryParams))
}
export default bookingApiRequest
