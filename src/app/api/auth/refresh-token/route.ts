import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      {
        message: 'Không tìm thấy refreshToken',
      },
      {
        status: 401,
      }
    )
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refresh_token: refreshToken,
    })
    const decodedAccessToken = jwt.decode(payload.data.access_token) as {
      exp: number
    }
    const decodedRefreshToken = jwt.decode(payload.data.refresh_token) as {
      exp: number
    }
    cookieStore.set('accessToken', payload.data.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', payload.data.refresh_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(payload)
  } catch (error: any) {
    console.log('2')
    return Response.json(
      {
        message: error.message ?? 'Có lỗi xảy ra',
      },
      {
        status: 401,
      }
    )
  }
}
