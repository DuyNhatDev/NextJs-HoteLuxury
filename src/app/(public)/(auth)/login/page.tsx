import LoginForm from '@/app/(public)/(auth)/login/login-form'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
