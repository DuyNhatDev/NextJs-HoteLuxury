import BreadcrumbNav from '@/app/(customer)/dashboard/components/breadcrumb'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto w-full p-4 sm:max-w-xl md:max-w-6xl">
      <BreadcrumbNav />
      <div className="mx-auto flex w-full flex-col gap-5 py-3 lg:flex-row">
        <div className="w-full bg-amber-200 lg:basis-1/4"></div>
        <div className="w-full bg-green-200 lg:basis-3/4">{children}</div>
      </div>
    </div>
  )
}
