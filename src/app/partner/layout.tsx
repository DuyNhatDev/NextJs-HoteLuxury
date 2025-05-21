import Notification from '@/app/partner/components/notification'
import { AppSidebar } from '@/app/partner/components/sidebar'
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
      <SidebarInset className='flex h-screen flex-col overflow-hidden'>
        <header className='bg-background sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1 h-8 w-8' />
            <Separator orientation='vertical' className='mr-2 h-4' />
          </div>
          <DarkModeToggle className='h-7 w-7' />
        </header>

        <div className='flex-1 overflow-y-auto px-4 py-0'>
          <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min'>{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
