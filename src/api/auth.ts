import http from '@/lib/http'
import {
  ForgotPasswordBodyType,
  ForgotPasswordResType,
  GoogleAccountBodyType,
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  PartnerRegisterBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType,
  ResetPasswordBodyType,
  VerifyAccountBodyType,
  VerifyAccountResType,
  VerifyForgotPasswordBodyType,
  VerifyForgotPasswordResType
} from '@/schemas/auth.schema'

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  register: (body: RegisterBodyType) => http.post<RegisterResType>('/auth/sign-up', body),
  partnerRegister: (body: PartnerRegisterBodyType) => http.post<RegisterResType>('/auth/sign-up', body),
  verifyAccount: (body: VerifyAccountBodyType, token: string) =>
    http.post<VerifyAccountResType>(`/auth/verify-account/${token}`, body),
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/sign-in', body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    }),
  sLoginByGoogle: (body: GoogleAccountBodyType) => http.post<LoginResType>('/auth/google-sign-in', body),
  loginByGoogle: (body: GoogleAccountBodyType) =>
    http.post<LoginResType>('/api/auth/login-by-google', body, {
      baseUrl: ''
    }),
  getUserInfoFromGoogle: (accessToken: string) =>
    http.get<GoogleAccountBodyType>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }),
  sLogout: (
    body: LogoutBodyType & {
      access_token: string
    }
  ) =>
    http.post(
      '/auth/logout',
      {
        refresh_token: body.refresh_token
      },
      {
        headers: {
          Authorization: `Bearer ${body.access_token}`
        }
      }
    ),
  logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),
  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, {
      baseUrl: ''
    })
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
  forgotPassword: (body: ForgotPasswordBodyType) => http.post<ForgotPasswordResType>('/auth/forgot-password', body),
  verifyForgotPassword: (body: VerifyForgotPasswordBodyType, token: string) =>
    http.post<VerifyForgotPasswordResType>(`/auth/forgot-password/${token}`, body),
  resetPassword: (body: ResetPasswordBodyType, token: string) => http.post(`/auth/reset-password/${token}`, body)
}
export default authApiRequest
