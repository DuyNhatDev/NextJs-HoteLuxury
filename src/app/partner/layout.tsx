import { AppSidebar } from '@/app/partner/components/sidebar'
import DarkModeToggle from '@/components/dark-mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
export default function PartnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center justify-between px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 w-8 h-8" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <DarkModeToggle className="w-8 h-8" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
