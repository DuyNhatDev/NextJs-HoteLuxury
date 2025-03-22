'use client'
import * as React from 'react'
import { ShieldUser } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavManage } from '@/app/admin/components/nav-manage'
import { NavUser } from '@/app/admin/components/nav-user'
import Link from 'next/link'
import { data } from '@/app/admin/components/nav-items'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <ShieldUser className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Admin</span>
            {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavManage items={data.navManage} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
