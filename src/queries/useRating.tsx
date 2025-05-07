import ratingApiRequest from '@/apiRequests/rating'
import { CreateRatingBodyType } from '@/schemaValidations/rating.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreateRatingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CreateRatingBodyType }) => ratingApiRequest.createRating(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completed-bookings'] })
    }
  })
}

export const useGetRatingList = (id: number) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => ratingApiRequest.getRatingList(id)
  })
}
