import z from 'zod'

export const VoucherSchema = z.object({
  voucherId: z.number(),
  code: z.string(),
  description: z.string(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number(),
  minOrderValue: z.number(),
  maxPercentageDiscount: z.number(),
  content: z.string(),
  quantity: z.number(),
  startedAt: z.date(),
  expiredAt: z.date(),
  createdAt: z.date()
})

export const Voucher2Schema = z.object({
  voucherId: z.number(),
  code: z.string(),
  description: z.string(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number(),
  minOrderValue: z.number(),
  maxPercentageDiscount: z.number(),
  content: z.string(),
  quantity: z.number(),
  startedAt: z.string(),
  expiredAt: z.string(),
  createdAt: z.date()
})

export type VoucherType = z.infer<typeof VoucherSchema>

export const VoucherResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: VoucherSchema
})

export type VoucherResType = z.infer<typeof VoucherResSchema>

export const Voucher2ResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: Voucher2Schema
})

export type Voucher2ResType = z.infer<typeof Voucher2ResSchema>

export const VoucherListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(VoucherSchema)
})

export type VoucherLisResType = z.infer<typeof VoucherListResSchema>

export const CreateUpdateVoucherBodySchema = z.object({
  code: z.string().trim().min(1, { message: 'Mã voucher không được để trống' }).max(256),
  description: z.string().trim().min(1, { message: 'Mô tả không được để trống' }).max(256),
  discountType: z.enum(['percentage', 'fixed'], { message: 'Vui lòng chọn loại voucher' }).optional(),
  discountValue: z.number({ message: 'Vui lòng nhập giá trị' }),
  minOrderValue: z.number().optional(),
  maxPercentageDiscount: z.number().optional(),
  quantity: z.number({ message: 'Vui lòng nhập số lượng' }).min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' }),
  startedAt: z.string().optional(),
  expiredAt: z.string().min(1, { message: 'Vui lòng chọn ngày hết hạn' })
})

export type CreateUpdateVoucherBodyType = z.infer<typeof CreateUpdateVoucherBodySchema>
