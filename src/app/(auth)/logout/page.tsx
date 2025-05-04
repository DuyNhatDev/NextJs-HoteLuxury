import Logout from '@/app/(auth)/logout/logout'
import { Suspense } from 'react'
export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
