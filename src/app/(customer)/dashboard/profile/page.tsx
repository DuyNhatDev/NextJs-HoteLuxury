import ProfileForm from '@/app/(customer)/dashboard/profile/profile-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hồ sơ của tôi',
  description: 'Hồ sơ của tôi'
}

export default function ProfilePage() {
  return <ProfileForm />
}
