import http from '@/lib/http'
import { Coordinates, District, Province, Ward } from '@/types/location.types'
import queryString from 'query-string'

const locationApiRequest = {
  getProvinces: () =>
    http.get<Province[]>(`api/locations/provinces`, {
      baseUrl: '',
    }),
  getDistricts: (idProvince: string) =>
    http.get<District[]>(
      `api/locations/districts?` + queryString.stringify({ parentId: idProvince }),
      {
        baseUrl: '',
      }
    ),
  getWards: (idDistrict: string) =>
    http.get<Ward[]>(`api/locations/wards?` + queryString.stringify({ parentId: idDistrict }), {
      baseUrl: '',
    }),

  getCoordinates: async (address: string): Promise<Coordinates> => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    const res = await fetch(url)
    const data = await res.json()
    if (!data || data.length === 0) {
      throw new Error('Không tìm thấy tọa độ cho địa chỉ này')
    }
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    }
  },
}
export default locationApiRequest
