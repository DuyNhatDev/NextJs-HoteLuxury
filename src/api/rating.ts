import http from '@/lib/http'
import { buildQueryParams, objectToFormData } from '@/lib/utils'
import { CreateRatingBodyType, RatingListResType, RatingParamsType, RatingResType } from '@/schemas/rating.schema'

const prefix = '/rating'

const ratingApiRequest = {
  createRating: (bookingId: number, body: CreateRatingBodyType) => {
    const formData = objectToFormData(body)
    return http.post<RatingResType>(`${prefix}?bookingId=${bookingId}`, formData)
  },

  getRatingList: (queryParams: RatingParamsType) => http.get<RatingListResType>(`${prefix}?` + buildQueryParams(queryParams))
}
export default ratingApiRequest
