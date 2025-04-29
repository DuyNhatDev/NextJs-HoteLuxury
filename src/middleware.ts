import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const adminPaths = ['/admin']
const partnerPaths = ['/partner']
const customerPath = ['/thong-tin-booking']
const privatePaths = [...adminPaths, ...partnerPaths, ...customerPath]
const unAuthPaths = ['/login', '/register', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  // 1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }
  // 2. Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // 2.2 Access token hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    // 2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).roleId
    const roleAccess = {
      [Role.Customer]: [...adminPaths, ...partnerPaths],
      [Role.Partner]: [...adminPaths],
      [Role.Admin]: [...partnerPaths]
    }
    if (roleAccess[role]?.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/partner/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/thong-tin-booking/:path*'
  ]
}
