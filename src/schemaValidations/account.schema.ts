import { Role } from '@/constants/type'
import { LoginResSchema } from '@/schemaValidations/auth.schema'

import z from 'zod'

export const AccountSchema = z.object({
  userId: z.number(),
  fullname: z.string(),
  email: z.string(),
  roleId: z.enum([Role.Admin, Role.Partner, Role.Client]),
  image: z.string().nullable(),
  birthDate: z.date(),
  address: z.string(),
  phoneNumber: z.string(),
  gender: z.enum(['Nam', 'Nữ']),
  password: z.string().optional(),
  isConfirmed: z.boolean(),
  active: z.boolean(),
})

export type AccountType = z.infer<typeof AccountSchema>

export const AccountListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(AccountSchema),
})

export type AccountListResType = z.infer<typeof AccountListResSchema>

export const AccountResSchema = z
  .object({
    status: z.string(),
    message: z.string(),
    data: AccountSchema,
  })
  .strict()

export type AccountResType = z.infer<typeof AccountResSchema>

export const CreatePartnerAccountBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }).optional(),
    phoneNumber: z
      .string()
      .min(9, 'Số điện thoại phải có ít nhất 9 số')
      .max(15, 'Số điện thoại không quá 15 số')
      .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số')
      .optional(),
    birthDate: z.string().optional(),
    address: z.string().min(1, 'Địa chỉ không được để trống').optional(),
    image: z.string().optional(),
    roleId: z.enum([Role.Partner]),
  })
  .strict()

export type CreatePartnerAccountBodyType = z.infer<typeof CreatePartnerAccountBodySchema>

export const UpdatePartnerAccountBodySchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .min(1, { message: 'Họ và tên không được để trống' })
      .max(256)
      .optional(),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }).optional(),
    phoneNumber: z
      .string()
      .min(9, 'Số điện thoại phải có ít nhất 9 số')
      .max(15, 'Số điện thoại không quá 15 số')
      .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số')
      .optional(),
    birthDate: z.string().optional(),
    address: z.string().min(1, 'Địa chỉ không được để trống').optional(),
    image: z.string().optional(),
    isConfirmed: z.boolean().optional(),
    active: z.boolean().optional(),
  })
  .strict()

export type UpdatePartnerAccountBodyType = z.infer<typeof UpdatePartnerAccountBodySchema>

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>

export const ChangePasswordV2Body = ChangePasswordBody

export type ChangePasswordV2BodyType = z.infer<typeof ChangePasswordV2Body>

export const ChangePasswordV2Res = LoginResSchema

export type ChangePasswordV2ResType = z.infer<typeof ChangePasswordV2Res>
