import ForgetPasswordForm from '@/app/(auth)/forgot-password/forgot-password-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description: 'The booking hotel app'
}
export default function ForgetPasswordPage() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <ForgetPasswordForm />
    </div>
  )
}
