import locationApiRequest from '@/api/location'
import { UpdateLocationBodyType } from '@/schemas/location.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetLocation = (id?: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationApiRequest.getLocation(id!),
    enabled: !!id && enabled
  })
}

export const useGetLocationList = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: locationApiRequest.getLocationList,
    enabled
  })
}

export const useAddLocationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: locationApiRequest.addLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}

export const useUpdateLocationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateLocationBodyType }) =>
      locationApiRequest.updateLocation(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}

export const useDeleteDestinationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: locationApiRequest.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}

export const useGetProvinces = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => locationApiRequest.getProvinces(),
    enabled
  })
}

export const useGetDistricts = (idProvince: string) => {
  return useQuery({
    queryKey: ['districts', idProvince],
    queryFn: () => locationApiRequest.getDistricts(idProvince),
    enabled: !!idProvince
  })
}

export const useGetWards = (idDistrict: string) => {
  return useQuery({
    queryKey: ['wards', idDistrict],
    queryFn: () => locationApiRequest.getWards(idDistrict),
    enabled: !!idDistrict
  })
}

export const useGetCoordinates = (address: string) => {
  return useQuery({
    queryKey: ['coordinates', address],
    queryFn: () => locationApiRequest.getCoordinates(address),
    enabled: !!address
  })
}
