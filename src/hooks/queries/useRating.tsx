import ratingApiRequest from '@/api/rating'
import { CreateRatingBodyType, RatingParamsType } from '@/schemas/rating.schema'
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

export const useGetRatingList = (queryParams: RatingParamsType) => {
  return useQuery({
    queryKey: ['hotel', queryParams],
    queryFn: () => ratingApiRequest.getRatingList(queryParams)
  })
}
