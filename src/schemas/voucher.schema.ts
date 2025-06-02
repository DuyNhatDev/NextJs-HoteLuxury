import z from 'zod'

export const VoucherSchema = z.object({
  voucherId: z.number(),
  code: z.string(),
  description: z.string(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number(),
  minOrderValue: z.number(),
  quantity: z.number(),
  expiredAt: z.date(),
  createdAt: z.date()
})

export type VoucherType = z.infer<typeof VoucherSchema>

export const VoucherListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(VoucherSchema)
})

export type VoucherLisResType = z.infer<typeof VoucherListResSchema>
