import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
import { CreateRatingBodyType, RatingListResType, RatingResType } from '@/schemaValidations/rating.schema'

const prefix = '/rating'

const ratingApiRequest = {
  createRating: (bookingId: number, body: CreateRatingBodyType) => {
    const formData = objectToFormData(body)
    return http.post<RatingResType>(`${prefix}?bookingId=${bookingId}`, formData)
  },

  getRatingList: (hotelId: number) => http.get<RatingListResType>(`${prefix}?hotelId=${hotelId}`)
}
export default ratingApiRequest
