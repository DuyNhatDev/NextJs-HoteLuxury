import LoginForm from '@/app/(auth)/login/login-form'
import Logout from '@/components/logout'
import { Metadata } from 'next'
import { Suspense } from 'react'
export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'The booking hotel app'
}
export default function LoginPage() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <Suspense>
        <LoginForm />
        <Logout />
      </Suspense>
    </div>
  )
}
