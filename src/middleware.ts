import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminPaths = ['/admin']
const partnerPaths = ['/partner']
const customerPath = ['/thong-tin-booking', '/dashboard']
const privatePaths = [...adminPaths, ...partnerPaths, ...customerPath]
const unAuthPaths = ['/login', '/register', '/forgot-password', '/reset-password']
const loginPath = ['/login']

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
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
      if (loginPath.some((path) => pathname.startsWith(path)) && searchParams.get('accessToken')) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
    // 2.2 Access token hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // 2.3 Vào không đúng role
    const role = decodeToken(refreshToken).roleId
    if (pathname === '/' && refreshToken) {
      if (role === Role.Partner) {
        return NextResponse.redirect(new URL('/partner/dashboard', request.url))
      } else if (role === Role.Admin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }
    const roleAccess = {
      [Role.Customer]: [...adminPaths, ...partnerPaths],
      [Role.Partner]: [...adminPaths, ...customerPath],
      [Role.Admin]: [...partnerPaths, ...customerPath]
    }
    if (roleAccess[role]?.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/forbidden', request.url))
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
    '/thong-tin-booking/:path*',
    '/dashboard/:path*'
  ]
}
