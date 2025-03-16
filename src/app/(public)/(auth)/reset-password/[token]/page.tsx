import ResetPasswordForm from '@/app/(public)/(auth)/reset-password/[token]/reset-password-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'The booking hotel app',
}
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return (
    <div className="flex flex-1 items-center justify-center">
      <ResetPasswordForm token={token} />
    </div>
  )
}
