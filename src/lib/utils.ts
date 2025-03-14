import { toast } from 'sonner'
import { EntityError, HttpError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import { format } from 'date-fns'
import authApiRequest from '@/apiRequests/auth'

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message,
      })
    })
  } else if (error instanceof HttpError) {
    toast.error('Lỗi HTTP', {
      description: error.payload.message || 'Có lỗi xảy ra khi gửi yêu cầu.',
      duration: duration ?? 5000,
    })
  } else {
    toast.error('Lỗi', {
      description: error?.payload?.message ?? 'Lỗi không xác định',
      duration: duration ?? 5000,
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('accessToken') : null
}

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}

export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem('accessToken', value)
}

export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem('refreshToken', value)
}

export const setUserIdToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem('userId', value)
}

export const getUserIdFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('userId') : null
}

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
  }
}

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number
    iat: number
  }
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number
    iat: number
  }
  const now = new Date().getTime() / 1000 - 1
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return param?.onError && param.onError()
  }

  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi API refresh token
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.access_token)
      setRefreshTokenToLocalStorage(res.payload.refresh_token)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number)
}

// export const decodeToken = (token: string) => {
//   return jwt.decode(token) as TokenPayload
// }
export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}
export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  )
}
export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}
