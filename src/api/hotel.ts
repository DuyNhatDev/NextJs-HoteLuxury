import http from '@/lib/http'
import { buildQueryParams, objectToFormData } from '@/lib/utils'
import {
  FeaturedHotelListResType,
  CreateHotelBodyType,
  HotelListResType,
  HotelResType,
  UpdateHotelBodyType,
  AdminHotelListResType,
  AdminHotelParamsType
} from '@/schemas/hotel.schema'

const prefix = '/hotel'

const hotelApiRequest = {
  getHotelList: () => http.get<HotelListResType>(`${prefix}`),
  getHotel: (id: string) => http.get<HotelResType>(`${prefix}/${id}`),
  addHotel: (body: CreateHotelBodyType) => {
    const formData = objectToFormData(body)
    return http.post<HotelResType>(`${prefix}`, formData)
  },
  updateHotel: (id: number, body: UpdateHotelBodyType) => {
    const formData = objectToFormData(body)
    return http.put<HotelResType>(`${prefix}/${id}`, formData)
  },
  deleteHotel: (id: number) => http.delete(`${prefix}/${id}`),
  getFeaturedHotelList: () => http.get<FeaturedHotelListResType>(`${prefix}/most-booking`),
  getSimilarHotelList: (id: string) => http.get<HotelListResType>(`${prefix}/similar-hotel/${id}`),
  getHotelListByAdmin: (queryParams: AdminHotelParamsType) =>
    http.get<AdminHotelListResType>(`admin${prefix}?` + buildQueryParams(queryParams))
}
export default hotelApiRequest
