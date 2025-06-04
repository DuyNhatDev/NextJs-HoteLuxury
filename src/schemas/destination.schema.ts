import z from 'zod'

export const DestinationSchema = z.object({
  locationId: z.number(),
  locationName: z.string().min(1, { message: 'Tên không được để trống' }),
  locationImage: z.union([z.string(), z.instanceof(File)]).optional(),
  totalHotel: z.number()
})

export type DestinationType = z.infer<typeof DestinationSchema>

export const DestinationResType = z.object({
  status: z.string(),
  message: z.string(),
  data: DestinationSchema
})

export type DestinationResType = z.infer<typeof DestinationResType>

export const DestinationListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(DestinationSchema)
})

export type DestinationListResType = z.infer<typeof DestinationListResSchema>

export const CreateDestinationBodySchema = z.object({
  locationName: z.string().min(1, { message: 'Tên địa điểm không được để trống' }),
  locationImage: z.union([z.string(), z.instanceof(File)]).optional()
})

export type CreateDestinationBodyType = z.infer<typeof CreateDestinationBodySchema>

export const UpdateDestinationBodySchema = CreateDestinationBodySchema

export type UpdateDestinationBodyType = z.infer<typeof UpdateDestinationBodySchema>
