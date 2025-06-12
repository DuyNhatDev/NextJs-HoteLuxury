import hotelApiRequest from '@/api/hotel'
import { AdminHotelParamsType, UpdateHotelBodyType } from '@/schemas/hotel.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetHotel = (id?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelApiRequest.getHotel(id!),
    enabled: !!id && enabled
  })
}

export const useGetHotelByManager = (id?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['hotel-by-manager', id],
    queryFn: () => hotelApiRequest.getHotelByManager(id!),
    enabled: !!id && enabled
  })
}

export const useGetHotelList = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: hotelApiRequest.getHotelList
  })
}

export const useAddHotelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: hotelApiRequest.addHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    }
  })
}

export const useUpdateHotelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateHotelBodyType }) => hotelApiRequest.updateHotel(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] }),
        queryClient.invalidateQueries({ queryKey: ['hotel-by-manager'] })
    }
  })
}

export const useDeleteHotelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: hotelApiRequest.deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    }
  })
}

export const useGetFeaturedHotelList = () => {
  return useQuery({
    queryKey: ['featured-hotels'],
    queryFn: hotelApiRequest.getFeaturedHotelList
  })
}

export const useGetSimilarHotelList = (id?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['similar-hotels', id],
    queryFn: () => hotelApiRequest.getSimilarHotelList(id!),
    enabled: !!id && enabled
  })
}

export const useGetHotelListByAdmin = (queryParams: AdminHotelParamsType) => {
  return useQuery({
    queryKey: ['admin-hotels', queryParams],
    queryFn: () => hotelApiRequest.getHotelListByAdmin(queryParams)
  })
}

export const useDisableHotelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: { isDeleted: boolean } }) => hotelApiRequest.disableHotel(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] })
    }
  })
}

export const useActiveHotelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: { active: boolean } }) => hotelApiRequest.activeHotel(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-by-manager'] })
    }
  })
}
