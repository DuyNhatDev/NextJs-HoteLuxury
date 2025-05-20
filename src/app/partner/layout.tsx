import { AppSidebar } from '@/app/partner/components/sidebar'
import NotificationBadge from '@/components/customize/notification-badge'
import DarkModeToggle from '@/components/dark-mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
export default function PartnerLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-10 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1 h-8 w-8' />
            <Separator orientation='vertical' className='mr-2 h-4' />
          </div>
          {/* <NotificationBadge
            notifications={[
              { id: '1', title: 'Đơn hàng mới', description: 'Bạn có 1 đơn hàng mới', read: false },
              { id: '2', title: 'Tin nhắn từ Admin', description: 'Vui lòng xác nhận thông tin', read: false }
              // ...
            ]}
          /> */}
          <DarkModeToggle className='h-7 w-7' />
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min'>{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
