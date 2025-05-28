import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
import { CreateHotelBodyType, HotelListResType, HotelResType, UpdateHotelBodyType } from '@/schemas/hotel.schema'

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
  deleteHotel: (id: number) => http.delete(`${prefix}/${id}`)
}
export default hotelApiRequest
