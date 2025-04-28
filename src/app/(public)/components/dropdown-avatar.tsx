'use client'
import { CircleUser, FileText, Ticket, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLastTwoInitials, getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/queries/useAuth'
import { useGetAccount } from '@/queries/useAccount'
import { useAppStore } from '@/store/app-store'
import Link from 'next/link'

export default function DropdownAvatar() {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId!, true)
  const avatar = data?.payload?.data?.image ?? ''
  const name = data?.payload?.data?.fullname ?? ''

  const handleLogout = async () => {
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
    <div className="relative flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center">
            <Avatar>
              <AvatarImage src={avatar || '/image/no-avatar.png'} />
              <AvatarFallback>{getLastTwoInitials(name)}</AvatarFallback>
            </Avatar>
            <ChevronDown className="text-white" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="rounded">
          {role ? (
            <>
              <DropdownMenuItem className="rounded focus:bg-transparent focus:text-blue-500">
                <Link href="/dashboard/profile" className="flex items-center">
                  <CircleUser className="mr-2 h-4 w-4" />
                  Hồ sơ của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded focus:bg-transparent focus:text-blue-500">
                <Link href="/dashboard/trips" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Đơn của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded focus:bg-transparent focus:text-blue-500">
                <Link href="/dashboard/voucher" className="flex items-center">
                  <Ticket className="mr-2 h-4 w-4" />
                  Voucher của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-transparent">
                <Button
                  variant="outline"
                  className="w-full hover:border-blue-300 hover:bg-transparent"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem className="focus:bg-transparent">
                <div className="flex flex-col items-center">
                  <Button
                    className="mb-2 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => router.push('/register')}
                  >
                    Đăng ký
                  </Button>
                  <p className="text-center text-sm">Quý khách đã có tài khoản?</p>
                  <span
                    className="block cursor-pointer text-blue-500 hover:underline"
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
      <span className="text-sm font-medium text-white">{name || ''}</span>
    </div>
  )
}
