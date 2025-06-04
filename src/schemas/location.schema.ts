import z from 'zod'

export const LocationSchema = z.object({
  locationId: z.number(),
  locationName: z.string().min(1, { message: 'Tên không được để trống' }),
  locationImage: z.union([z.string(), z.instanceof(File)]).optional(),
  totalHotel: z.number()
})

export type LocationType = z.infer<typeof LocationSchema>

export const LocationResType = z.object({
  status: z.string(),
  message: z.string(),
  data: LocationSchema
})

export type LocationResType = z.infer<typeof LocationResType>

export const LocationListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(LocationSchema)
})

export type LocationListResType = z.infer<typeof LocationListResSchema>

export const CreateLocationBodySchema = z.object({
  locationName: z.string().min(1, { message: 'Tên địa điểm không được để trống' }),
  locationImage: z.union([z.string(), z.instanceof(File)]).optional()
})

export type CreateLocationBodyType = z.infer<typeof CreateLocationBodySchema>

export const UpdateLocationBodySchema = CreateLocationBodySchema

export type UpdateLocationBodyType = z.infer<typeof UpdateLocationBodySchema>
