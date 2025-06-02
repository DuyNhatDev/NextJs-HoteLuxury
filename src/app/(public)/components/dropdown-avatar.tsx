'use client'
import { CircleUser, FileText, Ticket, ChevronDown, Gift } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLastTwoInitials, getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/hooks/queries/useAuth'
import { useGetAccount } from '@/hooks/queries/useAccount'
import { useAppStore } from '@/store/app-store'
import Link from 'next/link'

export default function DropdownAvatar() {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId ?? undefined, Boolean(userId))
  const avatar = data?.payload?.data?.image ?? ''
  const name = data?.payload?.data?.fullname ?? ''

  const dropdownItems = [
    {
      href: '/dashboard/profile',
      icon: CircleUser,
      label: 'Hồ sơ của tôi'
    },
    {
      href: '/dashboard/trips',
      icon: FileText,
      label: 'Đơn của tôi'
    },
    {
      href: '/dashboard/voucher',
      icon: Ticket,
      label: 'Voucher của tôi'
    },
    {
      href: '/dashboard/points',
      icon: Gift,
      label: 'LuxuryPoint'
    }
  ]

  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      disconnectSocket()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <div className='relative flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex cursor-pointer items-center gap-1.5'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src={avatar || '/image/no-avatar.png'} />
              <AvatarFallback>{getLastTwoInitials(name)}</AvatarFallback>
            </Avatar>
            <div className='group flex cursor-pointer items-center'>
              <span className='text-lg font-medium text-white group-hover:text-blue-600'>{name || 'Tài khoản'}</span>
              <ChevronDown className='text-white group-hover:text-blue-600' />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center' className='rounded'>
          {role ? (
            <>
              {dropdownItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href}>
                  <DropdownMenuItem className='gap-0 rounded focus:bg-transparent focus:text-blue-500'>
                    <Icon className='mr-2 h-4 w-4' />
                    {label}
                  </DropdownMenuItem>
                </Link>
              ))}
              <DropdownMenuItem className='focus:bg-transparent'>
                <Button
                  variant='outline'
                  className='w-full hover:border-blue-300 hover:bg-transparent'
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem className='focus:bg-transparent'>
                <div className='flex flex-col items-center'>
                  <Button
                    className='mb-2 w-full rounded bg-sky-400 px-4 py-2 text-white hover:bg-sky-500'
                    onClick={() => router.push('/register')}
                  >
                    Đăng ký
                  </Button>
                  <p className='text-center text-sm'>Quý khách đã có tài khoản?</p>
                  <span
                    className='block cursor-pointer text-blue-500 hover:underline'
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
    </div>
  )
}
