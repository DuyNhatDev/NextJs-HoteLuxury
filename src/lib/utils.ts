import { toast } from 'sonner'
import { EntityError, HttpError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { jwtDecode } from 'jwt-decode'
import authApiRequest from '@/apiRequests/auth'
import { TokenPayload } from '@/types/jwt.types'
import { format, parseISO } from 'date-fns'

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
    toast.error('Lỗi', {
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
export const decodeToken = (token: string) => {
  return jwtDecode<TokenPayload>(token)
}
export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)
  const now = new Date().getTime() / 1000 - 1
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return param?.onError && param.onError()
  }
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
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

export const getLastTwoInitials = (fullName: string) => {
  const words = fullName.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  const lastTwo = words.slice(-2)
  return lastTwo.map((word) => word[0].toUpperCase()).join('')
}

export const objectToFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData()

  for (const key in obj) {
    const value = obj[key]
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(key, item)
        } else if (item instanceof Date) {
          formData.append(key, item.toISOString())
        } else {
          formData.append(key, String(item))
        }
      })
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value)
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString())
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}


export const formatDate = (dateString?: string): string => {
  return dateString ? format(parseISO(dateString), 'dd-MM-yyyy') : ''
}
