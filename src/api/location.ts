import http from '@/lib/http'
import { CoordinatesResType, District, Province, Ward } from '@/types/location.types'
import queryString from 'query-string'
import { objectToFormData } from '@/lib/utils'
import {
  CreateLocationBodyType,
  LocationListResType,
  LocationResType,
  UpdateLocationBodyType
} from '@/schemas/location.schema'

const prefix = '/location'

const locationApiRequest = {
  getLocationList: () => http.get<LocationListResType>(`${prefix}`),
  getLocation: (id: number) => http.get<LocationResType>(`${prefix}/${id}`),
  addLocation: (body: CreateLocationBodyType) => {
    const formData = objectToFormData(body)
    return http.post<LocationListResType>(`${prefix}`, formData)
  },
  updateLocation: (id: number, body: UpdateLocationBodyType) => {
    const formData = objectToFormData(body)
    return http.put<LocationListResType>(`${prefix}/${id}`, formData)
  },
  deleteLocation: (id: number) => http.delete(`${prefix}/${id}`),
  getProvinces: () =>
    http.get<Province[]>(`api/locations/provinces`, {
      baseUrl: ''
    }),
  getDistricts: (idProvince: string) =>
    http.get<District[]>(`api/locations/districts?` + queryString.stringify({ parentId: idProvince }), {
      baseUrl: ''
    }),
  getWards: (idDistrict: string) =>
    http.get<Ward[]>(`api/locations/wards?` + queryString.stringify({ parentId: idDistrict }), {
      baseUrl: ''
    }),
  getCoordinates: (address: string) =>
    http.get<CoordinatesResType[]>(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    )
}
export default locationApiRequest
