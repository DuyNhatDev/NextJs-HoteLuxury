import authApiRequest from '@/apiRequests/auth'
import { VerifyAccountBodyType } from '@/schemaValidations/auth.schema'
import { useMutation } from '@tanstack/react-query'

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register,
  })
}

export const useVerifyAccountMutation = () => {
  return useMutation({
    mutationFn: ({ body, otp_token }: { body: VerifyAccountBodyType; otp_token: string }) =>
      authApiRequest.verifyAccount(body, otp_token),
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
