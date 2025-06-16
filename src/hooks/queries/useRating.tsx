import ratingApiRequest from '@/api/rating'
import { AdminRatingParamsType, CreateRatingBodyType, RatingParamsType } from '@/schemas/rating.schema'
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
    queryKey: ['rating-list', queryParams],
    queryFn: () => ratingApiRequest.getRatingList(queryParams)
  })
}

export const useGetAdminRatingList = (queryParams: AdminRatingParamsType) => {
  return useQuery({
    queryKey: ['admin-rating-list', queryParams],
    queryFn: () => ratingApiRequest.getAdminRatingList(queryParams)
  })
}

export const useHiddenRatingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: { isHidden: boolean } }) => ratingApiRequest.hiddenRating(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rating-list'] })
    }
  })
}

export const useDeleteRatingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ratingApiRequest.deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rating-list'] })
    }
  })
}
