import locationApiRequest from '@/apiRequests/location'
import { useQuery } from '@tanstack/react-query'

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => locationApiRequest.getProvinces(),
  })
}

export const useGetDistricts = (idProvince: string) => {
  return useQuery({
    queryKey: ['districts', idProvince],
    queryFn: () => locationApiRequest.getDistricts(idProvince),
    enabled: !!idProvince,
  })
}

export const useGetWards = (idDistrict: string) => {
  return useQuery({
    queryKey: ['wards', idDistrict],
    queryFn: () => locationApiRequest.getWards(idDistrict),
    enabled: !!idDistrict,
  })
}
