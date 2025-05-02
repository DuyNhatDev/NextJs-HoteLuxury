import http from '@/lib/http'
import { buildQueryParams, objectToFormData } from '@/lib/utils'
import {
  CreateRoomTypeBodyType,
  FilterRoomTypeParamsType,
  RoomTypeListResType,
  FilterRoomTypeListResType,
  RoomTypeResType,
  UpdateRoomTypeBodyType
} from '@/schemaValidations/room-type.schema'

const prefix = '/room-type'

const roomTypeApiRequest = {
  getRoomTypeList: () => http.get<RoomTypeListResType>(`${prefix}`),
  getRoomType: (id: string) => http.get<RoomTypeResType>(`${prefix}/by-hotel-manager/${id}`),
  addRoomType: (body: CreateRoomTypeBodyType) => {
    const formData = objectToFormData(body)
    return http.post<RoomTypeResType>(`${prefix}`, formData)
  },
  updateRoomType: (id: number, body: UpdateRoomTypeBodyType) => {
    const formData = objectToFormData(body)
    return http.put<RoomTypeResType>(`${prefix}/${id}`, formData)
  },
  deleteRoomType: (id: number) => http.delete(`${prefix}/${id}`),
  getFilterRoomTypeList: (queryParams: FilterRoomTypeParamsType) =>
    http.get<FilterRoomTypeListResType>(`${prefix}/filter?` + buildQueryParams(queryParams))
}
export default roomTypeApiRequest
