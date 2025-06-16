import http from '@/lib/http'
import { buildQueryParams, objectToFormData } from '@/lib/utils'
import {
  AdminRatingListResType,
  AdminRatingParamsType,
  CreateRatingBodyType,
  RatingListResType,
  RatingParamsType,
  RatingResType
} from '@/schemas/rating.schema'

const prefix = '/rating'

const ratingApiRequest = {
  createRating: (bookingId: number, body: CreateRatingBodyType) => {
    const formData = objectToFormData(body)
    return http.post<RatingResType>(`${prefix}?bookingId=${bookingId}`, formData)
  },
  getRatingList: (queryParams: RatingParamsType) =>
    http.get<RatingListResType>(`${prefix}?` + buildQueryParams(queryParams)),
  getAdminRatingList: (queryParams: AdminRatingParamsType) =>
    http.get<AdminRatingListResType>(`/admin${prefix}?` + buildQueryParams(queryParams)),
  hiddenRating: (id: number, body: { isHidden: boolean }) => http.put(`admin${prefix}/${id}`, body),
  deleteRating: (id: number) => http.delete(`admin${prefix}/${id}`)
}
export default ratingApiRequest
