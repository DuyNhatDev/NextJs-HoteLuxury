import z from 'zod'

export const BookingSchema = z.object({
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

export type BookingType = z.infer<typeof BookingSchema>

export const BookingResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: BookingSchema
})

export type BookingResType = z.infer<typeof BookingResSchema>
