import { Role } from '@/constants/type'
import { LoginResSchema } from '@/schemaValidations/auth.schema'

import z from 'zod'

export const AccountSchema = z.object({
  userId: z.number(),
  fullname: z.string(),
  email: z.string(),
  roleId: z.enum([Role.Admin, Role.Manager, Role.Client]),
  image: z.string().nullable(),
})

export type AccountType = z.infer<typeof AccountSchema>

export const AccountListResSchema = z.object({
  data: z.array(AccountSchema),
  message: z.string()
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

export const CreateManagerAccountBodySchema = z
  .object({
    name: z.string().trim().max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type CreateManagerAccountBodyType = z.infer<typeof CreateManagerAccountBodySchema>

export const UpdateManagerAccountBodySchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    role: z.enum([Role.Admin, Role.Manager, Role.Client]).optional().default(Role.Manager)
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Hãy nhập mật khẩu mới và xác nhận mật khẩu mới',
          path: ['changePassword']
        })
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu không khớp',
          path: ['confirmPassword']
        })
      }
    }
  })

export type UpdateManagerAccountBodyType = z.infer<typeof UpdateManagerAccountBodySchema>

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional()
  })
  .strict()

export type UpdateMeBodyType = z.infer<typeof UpdateMeBody>

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>

export const ChangePasswordV2Body = ChangePasswordBody

export type ChangePasswordV2BodyType = z.infer<typeof ChangePasswordV2Body>

export const ChangePasswordV2Res = LoginResSchema

export type ChangePasswordV2ResType = z.infer<typeof ChangePasswordV2Res>
