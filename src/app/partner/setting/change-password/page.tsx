import ChangePasswordForm from '@/app/partner/setting/change-password/change-password-form'
import { Badge } from '@/components/ui/badge'

export default function ChangePasswordPage() {
  return (
    <main className='grid flex-1 items-start gap-4 !p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='mx-auto grid w-full flex-1 auto-rows-max gap-4'>
        <div className='flex items-center gap-4'>
          <h1 className='flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0'>
            Đổi mật khẩu
          </h1>
          <Badge variant='outline' className='ml-auto sm:ml-0'>
            Partner
          </Badge>
        </div>
        <div className='grid w-md gap-4'></div>
        <ChangePasswordForm />
      </div>
    </main>
  )
}
