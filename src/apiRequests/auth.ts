import http from '@/lib/http'
import {
  LoginBodyType,
  LoginByGoogleBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType,
  VerifyAccountBodyType,
  VerifyAccountResType,
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  register: (body: RegisterBodyType) => http.post<RegisterResType>('/auth/sign-up', body),
  verifyAccount: (body: VerifyAccountBodyType, otp_token: string) =>
    http.post<VerifyAccountResType>(`/auth/verify-account/${otp_token}`, body),
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/sign-in', body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: '',
    }),
  sLoginByGoogle: (body: LoginByGoogleBodyType) =>
    http.post<LoginResType>('/auth/google-sign-in', body),
  loginByGoogle: (body: LoginByGoogleBodyType) =>
    http.post<LoginResType>('/api/auth/login-by-google', body, {
      baseUrl: '',
    }),
  sLogout: (
    body: LogoutBodyType & {
      access_token: string
    }
  ) =>
    http.post(
      '/auth/logout',
      {
        refresh_token: body.refresh_token,
      },
      {
        headers: {
          Authorization: `Bearer ${body.access_token}`,
        },
      }
    ),
  logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>('/auth/refresh-token', body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, {
      baseUrl: '',
    })
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
}
export default authApiRequest
