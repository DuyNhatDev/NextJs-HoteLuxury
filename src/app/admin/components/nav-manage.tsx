'use client'

import { ChevronRight, LayoutDashboard, type LucideIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
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

  const normalizePath = (path: string) => path.replace(/\/$/, '')

  const activeItems = items.map((item) => {
    const subItemsWithActive =
      item.items?.map((subItem) => {
        const normalizedSubUrl = normalizePath(subItem.url)
        const normalizedPathname = normalizePath(pathname)

        return {
          ...subItem,
          isActive: normalizedPathname === normalizedSubUrl || normalizedPathname.startsWith(normalizedSubUrl + '/')
        }
      }) ?? []

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

      {activeItems.map((item) => {
        const hasOnlyOneSubItem = item.items?.length === 1
        if (hasOnlyOneSubItem) {
          const subItem = item.items[0]
          return (
            <SidebarMenuItem key={item.title} className='px-2'>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={subItem.url} className={subItem.isActive ? 'bg-accent' : ''}>
                  {item.icon && <item.icon />}
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }
        return (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
            <SidebarMenuItem className='px-2'>
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
        )
      })}
    </>
  )
}
