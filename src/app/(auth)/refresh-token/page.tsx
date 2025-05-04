import RefreshToken from '@/app/(auth)/refresh-token/refresh-token'
import { Suspense } from 'react'

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  )
}
