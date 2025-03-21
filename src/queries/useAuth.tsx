import authApiRequest from '@/apiRequests/auth'
import {
  ResetPasswordBodyType,
  VerifyAccountBodyType,
  VerifyForgotPasswordBodyType,
} from '@/schemaValidations/auth.schema'
import { useMutation } from '@tanstack/react-query'

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register,
  })
}

export const usePartnerRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.partnerRegister,
  })
}

export const useVerifyAccountMutation = () => {
  return useMutation({
    mutationFn: ({ body, token }: { body: VerifyAccountBodyType; token: string }) =>
      authApiRequest.verifyAccount(body, token),
  })
}
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  })
}

export const useLoginByGoogleMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.loginByGoogle,
  })
}

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.forgotPassword,
  })
}
export const useVerifyForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ body, token }: { body: VerifyForgotPasswordBodyType; token: string }) =>
      authApiRequest.verifyForgotPassword(body, token),
  })
}
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ body, token }: { body: ResetPasswordBodyType; token: string }) =>
      authApiRequest.resetPassword(body, token),
  })
}
