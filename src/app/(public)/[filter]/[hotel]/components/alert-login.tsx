import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Info } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}
export default function AlertDialogLogin({ open, setOpen }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogin = async () => {
    const currentUrl = pathname
    router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setOpen(false)
        }
      }}
    >
      <AlertDialogContent className='p-4'>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='mx-auto mb-3 flex items-center justify-center rounded-full'>
              <Info className='h-7 w-7 text-blue-500' />
            </div>
            Bạn cần phải đăng nhập để có thể đặt phòng
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2 sm:justify-center'>
          <AlertDialogCancel>Đóng</AlertDialogCancel>
          <AlertDialogAction className='bg-orange-500 hover:bg-orange-500' onClick={handleLogin}>
            Đăng nhập
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}