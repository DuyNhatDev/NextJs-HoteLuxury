import RefreshToken from '@/app/(public)/(auth)/refresh-token/refresh-token'
import { Suspense } from 'react'

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  )
}
