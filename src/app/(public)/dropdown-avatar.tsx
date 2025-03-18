'use client'
import { CircleUser, FileText, LogOut, ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/queries/useAuth'
import { useGetAccount } from '@/queries/useAccount'
import { useAppStore } from '@/components/app-provider'

export default function DropdownAvatar() {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId!)
  const image = data?.payload?.data?.image ?? ''
  const fullname = data?.payload?.data?.fullname ?? ''
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <Avatar>
              <AvatarImage src={image || '/image/no-avatar.png'} />
            </Avatar>
            <ChevronDown className="text-white" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {role ? (
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
      <span className="text-sm font-medium text-white">{fullname || ''}</span>
    </div>
  )
}
