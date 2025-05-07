import z from 'zod'

export const CreateRatingBodySchema = z.object({
  hotelId: z.number(),
  ratingStar: z.number(),
  ratingDescription: z.string().optional(),
  ratingImages: z.union([z.string(), z.instanceof(File)]).optional(),
  ratingDate: z.date()
})

export type CreateRatingBodyType = z.infer<typeof CreateRatingBodySchema>

export const RatingSchema = CreateRatingBodySchema.extend({
  userId: z.object({
    userId: z.number(),
    fullname: z.string(),
    image: z.string()
  })
})

export const RatingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: RatingSchema
})

export type RatingResType = z.infer<typeof RatingResSchema>

export const RatingListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(RatingSchema)
})

export type RatingListResType = z.infer<typeof RatingListResSchema>
