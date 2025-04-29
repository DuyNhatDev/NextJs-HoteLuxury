import roomTypeApiRequest from '@/apiRequests/room-type'
import { FilterRoomTypeParamsType, UpdateRoomTypeBodyType } from '@/schemaValidations/room-type.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetRoomType = (id?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['room-type', id],
    queryFn: () => roomTypeApiRequest.getRoomType(id!),
    enabled: !!id && enabled
  })
}

export const useGetRoomTypeList = () => {
  return useQuery({
    queryKey: ['room-types'],
    queryFn: roomTypeApiRequest.getRoomTypeList
  })
}

export const useAddRoomTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomTypeApiRequest.addRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['room-types']
      })
    }
  })
}

export const useUpdateRoomTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateRoomTypeBodyType }) =>
      roomTypeApiRequest.updateRoomType(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['room-types']
      })
    }
  })
}

export const useDeleteRoomTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomTypeApiRequest.deleteRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['room-types']
      })
    }
  })
}

export const useGetFilterRoomTypeList = (queryParams: FilterRoomTypeParamsType) => {
  return useQuery({
    queryFn: () => roomTypeApiRequest.getFilterRoomTypeList(queryParams),
    queryKey: ['filter-room-types', queryParams]
  })
}
