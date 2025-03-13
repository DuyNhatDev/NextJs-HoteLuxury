'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

export  function LogoutComponent() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const { setIsAuth } = useAppContext()
  const searchParams = useSearchParams()
  const accessTokenFromUrl = searchParams.get('accessToken')
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const ref = useRef<any>(null)
  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        setIsAuth(false)
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, accessTokenFromUrl, refreshTokenFromUrl, setIsAuth])
  return null
}

export default function Logout() {
  return (
    <Suspense>
      <LogoutComponent />
    </Suspense>
  )
}