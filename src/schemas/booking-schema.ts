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
  }),
  point: z.number().optional(),
  voucherCode: z.string().optional(),
  finalPrice: z.number()
})

export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>

export const CreateBookingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: CreateBookingBodySchema
})

export type CreateBookingResType = z.infer<typeof CreateBookingResSchema>

export const BookingSchema = CreateBookingBodySchema.extend({
  bookingCode: z.string(),
  bookingId: z.number(),
  hotelId: z.number(),
  hotelName: z.string(),
  locationName: z.string(),
  roomTypeName: z.string(),
  roomTypeImage: z.string(),
  status: z.string(),
  isConfirmed: z.boolean(),
  createdAt: z.date(),
  isRating: z.boolean(),
  voucherDiscount: z.number().optional(),
  pointDiscount: z.number().optional()
})

export type BookingType = z.infer<typeof BookingSchema>

export const BookingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: BookingSchema
})

export type BookingResType = z.infer<typeof BookingResSchema>

export const BookingListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(BookingSchema)
})

export type BookingListResType = z.infer<typeof BookingListResSchema>

export const BookingParamsSchema = z.object({
  hotelId: z.number().optional(),
  dayStart: z.date().optional(),
  dayEnd: z.date().optional(),
  filterStart: z.date().optional(),
  filterEnd: z.date().optional(),
  checkInStart: z.date().optional(),
  checkInEnd: z.date().optional(),
  checkOutStart: z.date().optional(),
  checkOutEnd: z.date().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().optional(),
  paymentMethod: z
    .enum(['Online', 'Trực tiếp'], {
      message: 'Vui lòng chọn phương thức thanh toán'
    })
    .optional(),
  isConfirmed: z.boolean().optional(),
  status: z.string().optional()
})
export type BookingParamsType = z.infer<typeof BookingParamsSchema>

export const UpdateBookingResSchema = z.object({
  status: z.string(),
  message: z.string()
})

export type UpdateBookingResType = z.infer<typeof UpdateBookingResSchema>

export const CalculateFinalPriceBookingSchema = z.object({
  userId: z.number(),
  price: z.string(),
  voucherCode: z.string().optional(),
  point: z.string().optional()
})

export type CalculateFinalPriceBookingType = z.infer<typeof CalculateFinalPriceBookingSchema>

export const CalculateFinalPriceBookingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    price: z.number(),
    voucherDiscount: z.number(),
    pointDiscount: z.number(),
    finalPrice: z.number()
  })
})

export type CalculateFinalPriceBookingResType = z.infer<typeof CalculateFinalPriceBookingResSchema>
