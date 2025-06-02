import { Role } from '@/constants/type'
import z from 'zod'

export const AccountSchema = z.object({
  userId: z.number(),
  fullname: z.string(),
  email: z.string(),
  roleId: z.enum([Role.Admin, Role.Partner, Role.Customer]),
  image: z.string().nullable(),
  birthDate: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  gender: z.enum(['Nam', 'Nữ']),
  password: z.string().optional(),
  isConfirmed: z.boolean(),
  active: z.boolean(),
  point: z.number()
})

export type AccountType = z.infer<typeof AccountSchema>

export const AccountListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(AccountSchema)
})

export type AccountListResType = z.infer<typeof AccountListResSchema>

export const AccountResSchema = z
  .object({
    status: z.string(),
    message: z.string(),
    data: AccountSchema
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
      .union([
        z
          .string()
          .min(9, 'Số điện thoại phải có ít nhất 9 số')
          .max(15, 'Số điện thoại không quá 15 số')
          .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
        z.literal(''),
        z.undefined()
      ])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    birthDate: z
      .union([z.string(), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    address: z
      .union([z.string().min(1, 'Địa chỉ không được để trống'), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
    roleId: z.enum([Role.Partner])
  })
  .strict()

export type CreatePartnerAccountBodyType = z.infer<typeof CreatePartnerAccountBodySchema>

export const CreateCustomerAccountBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }).optional(),
    phoneNumber: z
      .union([
        z
          .string()
          .min(9, 'Số điện thoại phải có ít nhất 9 số')
          .max(15, 'Số điện thoại không quá 15 số')
          .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
        z.literal(''),
        z.undefined()
      ])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    birthDate: z
      .union([z.string(), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    address: z
      .union([z.string().min(1, 'Địa chỉ không được để trống'), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
    roleId: z.enum([Role.Customer])
  })
  .strict()

export type CreateCustomerAccountBodyType = z.infer<typeof CreateCustomerAccountBodySchema>

export const UpdatePartnerAccountBodySchema = z
  .object({
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256).optional(),
    email: z.string().optional(),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }).optional(),
    phoneNumber: z
      .union([
        z
          .string()
          .min(9, 'Số điện thoại phải có ít nhất 9 số')
          .max(15, 'Số điện thoại không quá 15 số')
          .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
        z.literal(''),
        z.undefined()
      ])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    birthDate: z
      .union([z.string(), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    address: z
      .union([z.string().min(1, 'Địa chỉ không được để trống'), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
    isConfirmed: z.boolean().optional(),
    active: z.boolean().optional(),
    roleId: z.enum([Role.Partner, Role.Admin, Role.Customer]).optional()
  })
  .strict()

export type UpdatePartnerAccountBodyType = z.infer<typeof UpdatePartnerAccountBodySchema>

export const UpdateCustomerAccountBodySchema = z
  .object({
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256).optional(),
    email: z.string().optional(),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }).optional(),
    phoneNumber: z
      .union([
        z
          .string()
          .min(9, 'Số điện thoại phải có ít nhất 9 số')
          .max(15, 'Số điện thoại không quá 15 số')
          .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
        z.literal(''),
        z.undefined()
      ])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    birthDate: z
      .union([z.string(), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    address: z
      .union([z.string().min(1, 'Địa chỉ không được để trống'), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
    isConfirmed: z.boolean().optional(),
    active: z.boolean().optional(),
    roleId: z.enum([Role.Partner, Role.Admin, Role.Customer]).optional()
  })
  .strict()

export type UpdateCustomerAccountBodyType = z.infer<typeof UpdateCustomerAccountBodySchema>

export const UpdateProfileBodySchema = z
  .object({
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256).optional(),
    email: z.string().optional(),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }).optional(),
    phoneNumber: z
      .union([
        z
          .string()
          .min(9, 'Số điện thoại phải có ít nhất 9 số')
          .max(15, 'Số điện thoại không quá 15 số')
          .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
        z.literal(''),
        z.undefined()
      ])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    birthDate: z
      .union([z.string(), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    address: z
      .union([z.string().min(1, 'Địa chỉ không được để trống'), z.literal(''), z.undefined()])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional()
  })
  .strict()

export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>

export const ChangePasswordBody = z
  .object({
    userId: z.string(),
    oldPassword: z.string().min(6, { message: 'Vui lòng nhập mật khẩu cũ' }).max(100),
    newPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>
