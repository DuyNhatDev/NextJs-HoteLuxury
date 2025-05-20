import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

type Notification = {
  id: string
  title: string
  description?: string
  read?: boolean
}

type NotificationBadgeProps = {
  notifications: Notification[]
}

export default function NotificationBadge({ notifications }: NotificationBadgeProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <Button variant='ghost' className='relative rounded-full hover:bg-background'>
          <Bell className='!h-5 !w-5' />
          {unreadCount > 0 && (
            <Badge
              variant='secondary'
              className='flex h-3 w-3 items-center justify-center rounded-full bg-orange-600 p-0 text-[9px] text-white'
            >
              {unreadCount}
            </Badge>
          )}
        </Button> */}
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Button variant='ghost' className='hover:bg-background !h-5 !w-5'>
              <Bell className='!h-5 !w-5' />
            </Button>
            <span className='bg-destructive absolute top-0 right-0 flex h-[14px] min-w-[14px] translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full px-1 text-[9px] leading-none text-white'>
              {/* {unreadCount} */}45
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4'>
        <p className='mb-2 text-sm font-medium'>Thông báo</p>
        <div className='max-h-60 space-y-2 overflow-auto'>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-md border p-2 ${notification.read ? 'bg-muted' : 'bg-background'}`}
              >
                <p className='font-medium'>{notification.title}</p>
                {notification.description && (
                  <p className='text-muted-foreground text-sm'>{notification.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className='text-muted-foreground text-sm'>Không có thông báo</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
