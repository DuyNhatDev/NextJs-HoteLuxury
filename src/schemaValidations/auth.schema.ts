import { Role } from '@/constants/type'
import z from 'zod'

export const RegisterBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100)
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

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResSchema = z.object({
  status: z.string(),
  message: z.string(),
  otp_token: z.string()
})

export type RegisterResType = z.infer<typeof RegisterResSchema>

export const VerifyAccountBodySchema = z.object({
  otpCode: z
    .string()
    .min(6, {
      message: 'Mã OTP phải có đủ 6 số'
    })
    .regex(/^\d+$/, { message: 'Mã OTP chỉ được chứa số' })
})

export type VerifyAccountBodyType = z.infer<typeof VerifyAccountBodySchema>

export const VerifyAccountResSchema = z.object({
  status: z.string(),
  message: z.string()
})

export type VerifyAccountResType = z.infer<typeof VerifyAccountResSchema>

export const LoginBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    // password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    password: z.string()
  })
  .strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginByGoogleBodySchema = z.object({
  email: z.string(),
  email_verified: z.boolean(),
  family_name: z.string(),
  given_name: z.string(),
  name: z.string(),
  picture: z.string(),
  sub: z.string()
})

export type LoginByGoogleBodyType = z.infer<typeof LoginByGoogleBodySchema>

export const LoginResSchema = z.object({
  status: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  roleId: z.enum([Role.Admin, Role.Partner, Role.Customer]),
  userId: z.number(),
  hotelId: z.number(),
  fullname: z.string(),
  message: z.string()
})

export type LoginResType = z.infer<typeof LoginResSchema>

export const RefreshTokenBodySchema = z
  .object({
    refresh_token: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>

export const CredentialResSchema = z.object({
  access_token: z.string(),
  authuser: z.string(),
  expires_in: z.number(),
  prompt: z.string(),
  scope: z.string(),
  token_type: z.string()
})

export type CredentialResType = z.infer<typeof CredentialResSchema>

export const RefreshTokenRes = z.object({
  status: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  message: z.string()
})

export type RefreshTokenResType = z.infer<typeof RefreshTokenRes>

export const LogoutBodySchema = z
  .object({
    refresh_token: z.string()
  })
  .strict()

export type LogoutBodyType = z.infer<typeof RefreshTokenBodySchema>

export const LoginGoogleQuerySchema = z.object({
  code: z.string()
})

export type LoginGoogleQueryType = z.infer<typeof LoginGoogleQuerySchema>

export const ForgotPasswordBodySchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng' })
})

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>

export const ForgotPasswordResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.string()
})

export type ForgotPasswordResType = z.infer<typeof ForgotPasswordResSchema>

export const ResetPasswordBodySchema = z
  .object({
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100)
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

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBodySchema>

export const VerifyForgotPasswordBodySchema = z.object({
  otpCode: z
    .string()
    .min(6, {
      message: 'Mã OTP phải có đủ 6 số'
    })
    .regex(/^\d+$/, { message: 'Mã OTP chỉ được chứa số' })
})

export type VerifyForgotPasswordBodyType = z.infer<typeof VerifyForgotPasswordBodySchema>

export const VerifyForgotPasswordResSchema = z.object({
  status: z.string(),
  message: z.string()
})

export type VerifyForgotPasswordResType = z.infer<typeof VerifyForgotPasswordResSchema>

export const PartnerRegisterBodySchema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    fullname: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }).max(256),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100),
    gender: z.enum(['Nam', 'Nữ'], { message: 'Vui lòng chọn giới tính' }),
    phoneNumber: z
      .string()
      .min(9, 'Số điện thoại phải có ít nhất 9 số')
      .max(15, 'Số điện thoại không quá 15 số')
      .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
    birthDate: z.string(),
    address: z.string().min(1, 'Địa chỉ không được để trống'),
    roleId: z.enum([Role.Partner])
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

export type PartnerRegisterBodyType = z.infer<typeof PartnerRegisterBodySchema>

export const PartnerRegisterResSchema = RegisterResSchema

export type PartnerRegisterResType = z.infer<typeof PartnerRegisterResSchema>
