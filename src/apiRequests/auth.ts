import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RegisterBodyType,
  RegisterResType,
  VerifyAccountBodyType,
  VerifyAccountResType,
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  register: (body: RegisterBodyType) => http.post<RegisterResType>('/user/sign-up', body),
  verifyAccount: (body: VerifyAccountBodyType, otp_token: string) =>
    http.post<VerifyAccountResType>(`/user/verify-account/${otp_token}`, body),
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/user/sign-in', body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: '',
    }),
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post(
      '/auth/logout',
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),
}
export default authApiRequest
