import PartnerRegisterForm from '@/app/(public)/(auth)/register/partner/partner-register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký đối tác',
  description: 'The booking hotel app',
}
export default function PartnerRegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <PartnerRegisterForm />
    </div>
  )
}
