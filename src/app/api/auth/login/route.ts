import { LoginBodyType } from '@/schemas/auth.schema'
import { cookies } from 'next/headers'
import { HttpError } from '@/types/error.types'
import authApiRequest from '@/api/auth'
import { decodeToken } from '@/lib/utils'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = await cookies()
  try {
    const { payload } = await authApiRequest.sLogin(body)
    const { access_token, refresh_token } = payload
    const decodedAccessToken = decodeToken(access_token)
    const decodedRefreshToken = decodeToken(refresh_token)
    cookieStore.set('accessToken', access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', refresh_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
