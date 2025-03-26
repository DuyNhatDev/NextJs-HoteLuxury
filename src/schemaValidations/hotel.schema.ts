import z from 'zod'

export const HotelSchema = z.object({
  hotelId: z.number(),
  userId: z.number(),
  hotelName: z.string(),
  hotelType: z.string(),
  hotelPhoneNumber: z.string(),
  hotelStar: z.number(),
  hotelDescription: z.string(),
  hotelAddress: z.string(),
  hotelImage: z.string(),
  hotelImages: z.array(z.string()),
  locationId: z.number(),
  locationName: z.string(),
  minPrice: z.number(),
})

export type HotelType = z.infer<typeof HotelSchema>

export const HotelResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: HotelSchema,
})

export type HotelResType = z.infer<typeof HotelResSchema>

export const HotelListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(HotelSchema),
})

export type HotelListResType = z.infer<typeof HotelListResSchema>

export const CreateHotelBodySchema = z.object({
  hotelName: z.string().min(1, { message: 'Tên khách sạn không được để trống' }),
  hotelType: z.string().min(1, { message: 'Vui lòng chọn loại khách sạn' }),
  hotelPhoneNumber: z
    .string()
    .min(9, 'Số điện thoại phải có ít nhất 9 số')
    .max(15, 'Số điện thoại không quá 15 số')
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
  hotelStar: z.number({ message: 'Vui lòng chọn số sao' }),
  hotelDescription: z.string(),
  hotelAddress: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  hotelImage: z.union([z.string(), z.instanceof(File)]).optional(),
  hotelImages: z.array(z.union([z.string(), z.instanceof(File)]).optional()).optional(),
  locationId: z.number().optional(),
  userId: z.number().optional(),
})

export type CreateHotelBodyType = z.infer<typeof CreateHotelBodySchema>

export const UpdateHotelBodySchema = HotelSchema.omit({
  hotelId: true,
  userId: true,
  minPrice: true,
  locationName: true,
})

export type UpdateHotelBodyType = z.infer<typeof UpdateHotelBodySchema>
