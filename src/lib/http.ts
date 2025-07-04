import envConfig from '@/config'
import {
  getAccessTokenFromLocalStorage,
  isClient,
  isValidFullUrl,
  normalizePath,
  removeItemsFromLocalStorage,
  setAccessTokenToLocalStorage,
  setHotelIdToLocalStorage,
  setRefreshTokenToLocalStorage,
  setUserIdToLocalStorage
} from '@/lib/utils'
import { LoginResType } from '@/schemas/auth.schema'
import { redirect } from 'next/navigation'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload, message = 'Lỗi HTTP' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Lỗi thực thể' })
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any> = null

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined

  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }

  const baseHeaders: {
    [key: string]: string
  } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }
  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
  const fullUrl = isValidFullUrl(url) ? url : `${baseUrl}/${normalizePath(url)}`
  const res = await fetch(fullUrl, {
    ...options,
    headers: { ...baseHeaders, ...options?.headers } as any,
    body,
    method
  })
  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: null,
            headers: {
              ...baseHeaders
            } as any
          })
          try {
            await clientLogoutRequest
          } catch (error) {
          } finally {
            removeItemsFromLocalStorage()
            clientLogoutRequest = null
            location.href = '/login'
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1]
        redirect(`/login?accessToken=${accessToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  if (isClient) {
    const normalizeUrl = normalizePath(url)
    if (normalizeUrl === 'api/auth/login' || normalizeUrl === 'api/auth/login-by-google') {
      const { access_token, refresh_token, userId, hotelId } = payload as LoginResType
      setAccessTokenToLocalStorage(access_token)
      setRefreshTokenToLocalStorage(refresh_token)
      setUserIdToLocalStorage(String(userId))
      if (hotelId) {
        setHotelIdToLocalStorage(String(hotelId))
      }
    } else if (normalizeUrl === 'api/auth/logout') {
      removeItemsFromLocalStorage()
    }
  }
  return data
}

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options })
  }
}

export default http
