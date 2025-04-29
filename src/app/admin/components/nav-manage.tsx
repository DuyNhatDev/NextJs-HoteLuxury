'use client'

import { ChevronRight, LayoutDashboard, type LucideIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavManage({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  const activeItems = items.map((item) => {
    const subItemsWithActive =
      item.items?.map((subItem) => ({
        ...subItem,
        isActive: pathname === subItem.url
      })) ?? []

    const isActive = subItemsWithActive.some((subItem) => subItem.isActive)

    return {
      ...item,
      isActive,
      items: subItemsWithActive
    }
  })

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem key='dashboard' className='px-2'>
          <SidebarMenuButton asChild>
            <Link
              href='/admin/dashboard'
              className={pathname === '/admin/dashboard' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroup>
        <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
        <SidebarMenu>
          {activeItems.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={subItem.isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
