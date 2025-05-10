import AdminProfileForm from '@/app/admin/manage/setting/account/profile-form'

export default function AccountPage() {
  return (
    <main className='grid flex-1 items-start gap-4 px-4 py-0 md:gap-8'>
      <div className='mx-auto grid w-full flex-1 auto-rows-max gap-4'>
        <div className='grid w-md gap-4'></div>
        <AdminProfileForm />
      </div>
    </main>
  )
}
