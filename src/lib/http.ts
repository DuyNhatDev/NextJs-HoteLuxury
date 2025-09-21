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
import { HttpStatus } from 'http-status-ts'
import { EntityError, EntityErrorPayload, HttpError } from '@/types/error.types'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
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
    if (res.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      throw new EntityError(data.payload as EntityErrorPayload)
    } else if (res.status === HttpStatus.UNAUTHORIZED) {
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
      throw new HttpError(data.status, data.payload as any)
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
