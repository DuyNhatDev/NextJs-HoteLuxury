import RegisterForm from '@/app/(public)/(auth)/register/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'The booking hotel app',
}
export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <RegisterForm />
    </div>
  )
}
