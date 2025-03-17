import ResetPasswordForm from '@/app/(public)/(auth)/reset-password/reset-password-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'The booking hotel app',
}
export default async function ResetPasswordPage() {

  return (
    <div className="flex flex-1 items-center justify-center">
      <ResetPasswordForm />
    </div>
  )
}
