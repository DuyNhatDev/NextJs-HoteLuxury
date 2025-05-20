'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RefreshToken from '@/components/refresh-token'
import { useEffect, useRef } from 'react'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'
import { generateSocketInstance } from '@/lib/socket'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage()
      if (accessToken === 'undefined') {
        removeTokensFromLocalStorage()
      }
      if (accessToken) {
        const role = decodeToken(accessToken).roleId
        setRole(role)
        setSocket(generateSocketInstance(accessToken))
      }
      count.current++
    }
  }, [setRole, setSocket])
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}
