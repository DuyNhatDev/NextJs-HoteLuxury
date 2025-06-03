import hotelApiRequest from '@/api/hotel'
import { UpdateHotelBodyType } from '@/schemas/hotel.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetHotel = (id?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelApiRequest.getHotel(id!),
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
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
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