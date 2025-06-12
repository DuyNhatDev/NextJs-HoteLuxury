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
  ratingAverage: z.number(),
  ratingQuantity: z.number(),
  locationId: z.number(),
  locationName: z.string(),
  minPrice: z.number()
})

export type HotelType = z.infer<typeof HotelSchema>

export const HotelResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: HotelSchema
})

export type HotelResType = z.infer<typeof HotelResSchema>

export const HotelListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(HotelSchema)
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
  hotelDescription: z.string().optional(),
  hotelAddress: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  hotelImage: z.union([z.string(), z.instanceof(File)]),
  hotelImages: z.array(z.union([z.string(), z.instanceof(File)]).optional()),
  locationId: z.number({ message: 'Vui lòng chọn địa điểm' }),
  userId: z.number().optional()
})

export type CreateHotelBodyType = z.infer<typeof CreateHotelBodySchema>

export const UpdateHotelBodySchema = z.object({
  hotelName: z.string().min(1, { message: 'Tên khách sạn không được để trống' }),
  hotelType: z.string().min(1, { message: 'Vui lòng chọn loại khách sạn' }),
  hotelPhoneNumber: z
    .string()
    .min(9, 'Số điện thoại phải có ít nhất 9 số')
    .max(15, 'Số điện thoại không quá 15 số')
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
  hotelStar: z.number({ message: 'Vui lòng chọn số sao' }),
  hotelAddress: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  hotelDescription: z.string(),
  locationId: z.number().optional(),
  hotelImage: z.union([z.string(), z.instanceof(File)]),
  hotelImages: z.array(z.union([z.string(), z.instanceof(File)]).optional()),
  isDeleted: z.boolean().optional()
})

export type UpdateHotelBodyType = z.infer<typeof UpdateHotelBodySchema>

export const FeaturedHotelSchema = z.object({
  hotelId: z.number(),
  hotelName: z.string(),
  hotelImage: z.string(),
  locationName: z.string()
})

export type FeaturedHotelType = z.infer<typeof FeaturedHotelSchema>

export const FeaturedHotelListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(FeaturedHotelSchema)
})

export type FeaturedHotelListResType = z.infer<typeof FeaturedHotelListResSchema>

export const AdminHotelSchema = HotelSchema.extend({
  totalBooking: z.number(),
  totalPrice: z.number(),
  totalFinalPrice: z.number(),
  commission: z.number(),
  totalMoney: z.number(),
  isDeleted: z.boolean()
})

export type AdminHotelType = z.infer<typeof AdminHotelSchema>

export const AdminHotelListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(AdminHotelSchema)
})

export type AdminHotelListResType = z.infer<typeof AdminHotelListResSchema>

export const AdminHotelParamsSchema = z.object({
  filterStart: z.date().optional(),
  filterEnd: z.date().optional()
})

export type AdminHotelParamsType = z.infer<typeof AdminHotelParamsSchema>
