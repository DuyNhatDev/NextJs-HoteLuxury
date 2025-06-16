import z from 'zod'

export const CreateRatingBodySchema = z.object({
  hotelId: z.number(),
  ratingStar: z.number().min(0).max(10),
  ratingDescription: z.string().optional(),
  ratingImages: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
  ratingDate: z.date()
})

export type CreateRatingBodyType = z.infer<typeof CreateRatingBodySchema>

export const RatingSchema = CreateRatingBodySchema.extend({
  ratingId: z.number(),
  userId: z.object({
    userId: z.number(),
    fullname: z.string(),
    image: z.string()
  })
})

export type RatingType = z.infer<typeof RatingSchema>

export const RatingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: RatingSchema
})

export type RatingResType = z.infer<typeof RatingResSchema>

export const RatingListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  allRatingImagesArray: z.array(z.string()),
  data: z.array(RatingSchema)
})

export type RatingListResType = z.infer<typeof RatingListResSchema>

export const RatingParamsSchema = z.object({
  hotelId: z.number(),
  fullname: z.string().optional(),
  filterStart: z.date().optional(),
  filterEnd: z.date().optional()
})

export type RatingParamsType = z.infer<typeof RatingParamsSchema>

export const AdminRatingSchema = z.object({
  ratingId: z.number(),
  userId: z.object({
    userId: z.number(),
    fullname: z.string(),
    image: z.string()
  }),
  hotelId: z.object({
    hotelId: z.number(),
    hotelName: z.string()
  }),
  ratingStar: z.number(),
  ratingDescription: z.string(),
  ratingImages: z.array(z.string()),
  ratingDate: z.date(),
  isHidden: z.boolean()
})

export type AdminRatingType = z.infer<typeof AdminRatingSchema>

export const AdminRatingListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(AdminRatingSchema)
})

export type AdminRatingListResType = z.infer<typeof AdminRatingListResSchema>

export const AdminRatingParamsSchema = z.object({
  hotelName: z.string().optional(),
  fullname: z.string().optional(),
  ratingDescription: z.string().optional(),
  filterStart: z.date().optional(),
  filterEnd: z.date().optional()
})

export type AdminRatingParamsType = z.infer<typeof AdminRatingParamsSchema>
