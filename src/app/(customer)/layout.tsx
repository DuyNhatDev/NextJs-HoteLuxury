import Header from '@/app/(public)/components/layout/header'

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='relative flex min-h-screen w-full flex-col'>
      <Header />
      <main className='flex flex-1 flex-col gap-4 md:gap-8'>{children}</main>
    </div>
  )
}
