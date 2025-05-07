import z from 'zod'

export const CreateBookingBodySchema = z.object({
  userId: z.number(),
  roomTypeId: z.number(),
  dayStart: z.date(),
  dayEnd: z.date(),
  price: z.number(),
  roomQuantity: z.number(),
  title: z.enum(['Anh', 'Chị'], {
    message: 'Vui lòng chọn danh xưng'
  }),
  customerName: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256),
  customerPhone: z
    .string()
    .min(9, 'Số điện thoại phải có ít nhất 9 số')
    .max(15, 'Số điện thoại không quá 15 số')
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
  customerEmail: z.string().email({ message: 'Email không hợp lệ' }),
  note: z.string().optional(),
  paymentMethod: z.enum(['Online', 'Trực tiếp'], {
    message: 'Vui lòng chọn phương thức thanh toán'
  })
})

export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>

export const CreateBookingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: CreateBookingBodySchema
})

export type CreateBookingResType = z.infer<typeof CreateBookingResSchema>

export const BookingSchema = CreateBookingBodySchema.extend({
  bookingId: z.number(),
  hotelId: z.number(),
  hotelName: z.string(),
  locationName: z.string(),
  roomTypeName: z.string(),
  roomTypeImage: z.string(),
  status: z.string(),
  isConfirmed: z.boolean(),
  isRating: z.boolean()
})

export type BookingType = z.infer<typeof BookingSchema>

export const BookingListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(BookingSchema)
})

export type BookingListResType = z.infer<typeof BookingListResSchema>

export const BookingParamsSchema = z.object({
  hotelId: z.number(),
  dayStart: z.date(),
  dayEnd: z.date(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string(),
  paymentMethod: z.enum(['Online', 'Trực tiếp'], {
    message: 'Vui lòng chọn phương thức thanh toán'
  }),
  isConfirmed: z.boolean(),
  status: z.string()
})
export type BookingParamsType = z.infer<typeof BookingParamsSchema>
