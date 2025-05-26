import http from '@/lib/http'
import { CoordinatesResType, District, Province, Ward } from '@/types/location.types'
import queryString from 'query-string'

const locationApiRequest = {
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
