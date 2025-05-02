import destinationApiRequest from '@/apiRequests/destination'
import { UpdateDestinationBodyType } from '@/schemaValidations/destination.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetDestination = (id?: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: () => destinationApiRequest.getDestination(id!),
    enabled: !!id && enabled
  })
}

export const useGetDestinationList = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: destinationApiRequest.getDestinationList,
    enabled
  })
}

export const useAddDestinationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: destinationApiRequest.addDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] })
    }
  })
}

export const useUpdateDestinationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateDestinationBodyType }) =>
      destinationApiRequest.updateDestination(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] })
    }
  })
}

export const useDeleteDestinationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: destinationApiRequest.deleteDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] })
    }
  })
}
