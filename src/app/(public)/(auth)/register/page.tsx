import RegisterForm from '@/app/(public)/(auth)/register/register-form'
import { Suspense } from 'react'

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Suspense>
       <RegisterForm />
      </Suspense>
    </div>
  )
}
