import { Role } from '@/constants/type'
import z from 'zod'

export const RegisterBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const LoginBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
  })
  .strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginResSchema = z.object({
  status: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  // account: z.object({
  //   id: z.number(),
  //   name: z.string(),
  //   email: z.string(),
  //   roleId: z.enum([Role.Admin, Role.Manager, Role.Client]),
  //   avatar: z.string().nullable(),
  // }),
  roleId: z.enum([Role.Admin, Role.Manager, Role.Client]),
  userId: z.number(),
  message: z.string(),
})

export type LoginResType = z.infer<typeof LoginResSchema>

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
})

export type RefreshTokenResType = z.infer<typeof RefreshTokenRes>

export const LogoutBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export type LogoutBodyType = z.infer<typeof RefreshTokenBodySchema>

export const LoginGoogleQuerySchema = z.object({
  code: z.string(),
})

export type LoginGoogleQueryType = z.infer<typeof LoginGoogleQuerySchema>
