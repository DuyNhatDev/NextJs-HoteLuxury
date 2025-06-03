import { toast } from 'sonner'
import { EntityError, HttpError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { jwtDecode } from 'jwt-decode'
import authApiRequest from '@/api/auth'
import { TokenPayload } from '@/types/jwt.types'
import { differenceInCalendarDays, format, isThisYear, isToday, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { slugify } from '@whthduck/slugify-vi'
import queryString from 'query-string'

export const isClient = typeof window !== 'undefined'

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else if (error instanceof HttpError) {
    toast.error('Lỗi', {
      description: error.payload.message || 'Có lỗi xảy ra khi gửi yêu cầu.',
      duration: duration ?? 5000
    })
  } else {
    toast.error('Lỗi', {
      description: error?.payload?.message ?? 'Lỗi không xác định',
      duration: duration ?? 5000
    })
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const getAccessTokenFromLocalStorage = () => {
  return isClient ? localStorage.getItem('accessToken') : null
}

export const getRefreshTokenFromLocalStorage = () => {
  return isClient ? localStorage.getItem('refreshToken') : null
}

export const setAccessTokenToLocalStorage = (value: string) => {
  return isClient && localStorage.setItem('accessToken', value)
}

export const setRefreshTokenToLocalStorage = (value: string) => {
  return isClient && localStorage.setItem('refreshToken', value)
}

export const setUserIdToLocalStorage = (value: string) => {
  return isClient && localStorage.setItem('userId', value)
}

export const setHotelIdToLocalStorage = (value: string) => {
  return isClient && localStorage.setItem('hotelId', value)
}

export const getUserIdFromLocalStorage = () => {
  return isClient ? localStorage.getItem('userId') : null
}

export const getHotelIdFromLocalStorage = () => {
  return isClient ? localStorage.getItem('hotelId') : null
}

export const removeItemsFromLocalStorage = () => {
  if (isClient) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('hotelId')
  }
}

export const removeStoreFromLocalStorage = () => {
  if (isClient) {
    localStorage.removeItem('booking-storage')
    localStorage.removeItem('filter-storage')
    localStorage.removeItem('order-storage')
  }
}

export const decodeToken = (token: string) => {
  return jwtDecode<TokenPayload>(token)
}

export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)
  const now = new Date().getTime() / 1000 - 1
  if (decodedRefreshToken.exp <= now) {
    removeItemsFromLocalStorage()
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
    currency: 'VND'
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
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
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
      if (value.length === 0) {
        continue
      }
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

export const formatDateToString = (date?: Date): string => {
  return date ? format(date, 'yyyy-MM-dd') : ''
}

export const formatProvince = (province: string): string => {
  return province.replace(/^(Tỉnh|Thành phố)\s+/i, '').trim()
}

export const generateSlugUrl = (name?: string) => {
  if (!name) return ''
  return slugify(name)
}

export type ParamsObject = Record<string, string | string[] | undefined>

export const updateURLParams = ({
  currentParams,
  router,
  values
}: {
  currentParams: URLSearchParams
  router: { push: (url: string) => void }
  values: Record<string, string[] | string>
}) => {
  const params = new URLSearchParams(currentParams.toString())

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const slugifiedValues = value.map((v) => slugify(v))
        params.set(key, slugifiedValues.join(','))
      } else {
        params.delete(key)
      }
    } else if (typeof value === 'string' && value.trim() !== '') {
      params.set(key, slugify(value))
    } else {
      params.delete(key)
    }
  })

  const query = params.toString().replace(/%2C/g, ',')
  router.push(`?${query}`)
}

export const getOriginalHotelTypeValueFromSlug = (slug: string): string => {
  const slugMap: Record<string, string> = {
    'khach-san': 'Khách sạn',
    'khu-nghi-duong': 'Khu nghỉ dưỡng',
    'biet-thu': 'Biệt thự',
    'can-ho': 'Căn hộ',
    'nha-nghi': 'Nhà nghỉ'
  }
  return slugMap[slug] || slug
}

export const extractLocationName = (slug?: string): string => {
  if (!slug) return ''
  return slug.replace('khach-san-', '').replace(/-/g, ' ').trim()
}

export const extractHotelName = (slug?: string): string => {
  if (!slug) return ''
  return slug.replace('chi-tiet', '').replace(/-/g, ' ').trim()
}

export const isDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime())
}

export const buildQueryParams = (params: Record<string, any>) => {
  const formattedParams: Record<string, any> = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return
    if (Array.isArray(value)) {
      formattedParams[key] = value.join(',')
    } else if (isDate(value)) {
      formattedParams[key] = formatDateToString(value)
    } else {
      formattedParams[key] = value
    }
  })
  return queryString.stringify(formattedParams, {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'none'
  })
}

export const generateCode = () => {
  const randomNum = Math.floor(Math.random() * 1000000)
  return String(randomNum).padStart(6, '0')
}

export const getBreadcrumbPageFromPathName = (pathName: string): string => {
  const pathNameMap: Record<string, string> = {
    profile: 'Hồ sơ của tôi',
    trips: 'Đơn của tôi',
    voucher: 'Voucher của tôi',
    points: 'LuxuryPoint'
  }
  return pathNameMap[pathName] || pathName
}

export const formatDayWithDate = (date: Date) => {
  const day = date.getDay()
  const shortDay = day === 0 ? 'CN' : `T${day + 1}`
  return `${shortDay}, ${format(date, 'dd/MM/yyyy')}`
}

export const removePhong = (text: string) => {
  if (text.startsWith('Phòng ')) {
    return text.slice(6)
  }
  return text
}

export const generateRandom9DigitNumber = (): string => {
  const timestampPart = Date.now() % 1_000_000_000
  const randomPart = Math.floor(Math.random() * 1_000_000_000)
  const combined = (timestampPart + randomPart) % 1_000_000_000
  return combined.toString().padStart(9, '0')
}

export const formatNotificationTime = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  if (isToday(date)) {
    return format(date, 'HH:mm')
  }
  const daysDiff = differenceInCalendarDays(new Date(), date)
  if (daysDiff <= 7) {
    const weekdayMap: Record<number, string> = {
      0: 'CN',
      1: 'Th 2',
      2: 'Th 3',
      3: 'Th 4',
      4: 'Th 5',
      5: 'Th 6',
      6: 'Th 7'
    }
    const weekday = weekdayMap[date.getDay()]
    return `${weekday} Lúc ${format(date, 'HH:mm')}`
  }
  if (isThisYear(date)) {
    return format(date, "d 'THG' M 'Lúc' HH:mm", { locale: vi })
  }
  return format(date, "d 'THG' M, yyyy 'Lúc' HH:mm", { locale: vi })
}

export const removePrefixBK = (input: string): string => {
  if (!input) return ''
  return input.replace(/^BK/, '')
}

export const isValidFullUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    const allowedProtocols = ['http:', 'https:', 'ftp:', 'file:', 'mailto:', 'tel:', 'ws:', 'wss:', 'data:', 'blob:']
    return allowedProtocols.includes(parsed.protocol)
  } catch (err) {
    return false
  }
}

export const isValidDate = (value?: string | number | Date): boolean => {
  return !!value && !isNaN(new Date(value).getTime())
}
