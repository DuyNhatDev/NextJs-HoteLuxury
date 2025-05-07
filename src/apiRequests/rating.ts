import http from '@/lib/http'
import { CreateRatingBodyType, RatingListResType, RatingResType } from '@/schemaValidations/rating.schema'

const prefix = '/rating'

const ratingApiRequest = {
  createRating: (bookingId: number, body: CreateRatingBodyType) =>
    http.post<RatingResType>(`${prefix}?bookingId=${bookingId}`, body),
  getRatingList: (hotelId: number) => http.get<RatingListResType>(`${prefix}?hotelId=${hotelId}`)
}
export default ratingApiRequest
