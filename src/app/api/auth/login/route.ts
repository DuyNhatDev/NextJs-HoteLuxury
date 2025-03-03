import { LoginBodyType } from '@/schemaValidations/auth.schema'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import authApiRequest from '@/apiRequests/auth'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = await cookies()
  try {
    const { payload } = await authApiRequest.sLogin(body)
    console.log(payload)
    const { access_token } = payload
    const decodedAccessToken = jwt.decode(access_token) as { exp: number }
    // const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
    cookieStore.set('accessToken', access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    // cookieStore.set('refreshToken', refreshToken, {
    //   path: '/',
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: true,
    //   expires: decodedRefreshToken.exp * 1000,
    // })
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra',
        },
        {
          status: 500,
        }
      )
    }
  }
}
