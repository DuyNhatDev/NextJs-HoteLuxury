import BreadcrumbNav from '@/app/(customer)/dashboard/components/breadcrumb'
import SideBar from '@/app/(customer)/dashboard/components/sidebar'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='mx-auto w-full p-6 sm:max-w-xl md:max-w-6xl'>
      <BreadcrumbNav />
      <div className='mx-auto flex w-full flex-col gap-5 py-4 lg:flex-row'>
        <div className='w-full lg:basis-1/4'>
          <SideBar />
        </div>
        <div className='w-full lg:basis-3/4'>{children}</div>
      </div>
    </div>
  )
}
