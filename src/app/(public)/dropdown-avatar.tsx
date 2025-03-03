'use client'
import { CircleUser, FileText, LogOut } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { getAccessTokenFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/queries/useAuth'

export default function DropdownAvatar() {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      console.log('ok')
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
      })
    }
  }
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
    console.log(isAuth)
  }, [])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="/image/no-avatar.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {isAuth ? (
          <>
            <DropdownMenuItem>
              <CircleUser className="mr-2 h-4 w-4" />
              Hồ sơ cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Đơn của tôi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent">
              <div className="flex flex-col items-center">
                <Button
                  className="bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600 mb-2"
                  onClick={() => router.push('/register')}
                >
                  Đăng ký
                </Button>
                <p className="text-sm text-center">Quý khách đã có tài khoản?</p>
                <span
                  className="text-blue-500 cursor-pointer hover:underline block"
                  onClick={() => {
                    router.push('/login')
                  }}
                >
                  Đăng nhập ngay
                </span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
