'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useAppStore } from '@/store/app-store'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
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
        setRole()
        disconnectSocket()
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, accessTokenFromUrl, refreshTokenFromUrl, setRole, disconnectSocket])
  return null
}
