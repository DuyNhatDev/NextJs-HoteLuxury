import ratingApiRequest from '@/apiRequests/rating'
import { CreateRatingBodyType } from '@/schemaValidations/rating.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateRatingMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CreateRatingBodyType }) => ratingApiRequest.createRating(id, body)
  })
}

export const useGetRatingList = (id: number) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => ratingApiRequest.getRatingList(id)
  })
}
