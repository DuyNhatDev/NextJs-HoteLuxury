'use client'
import { Bell, Check, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { NotificationType } from '@/schemaValidations/notification.schema'
import { formatNotificationTime } from '@/lib/utils'
import { useState } from 'react'

type NotificationBadgeProps = {
  notifications: NotificationType[]
  onMarkAsRead?: (id: number) => void
  onMarkAllAsRead?: () => void
  onDelete?: (id: number) => void
  onDeleteAll?: () => void
}

export default function NotificationBadge({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll
}: NotificationBadgeProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const [visibleCount, setVisibleCount] = useState(10)
  const visibleNotifications = notifications.slice(0, visibleCount)
  const notificationRemaining = Math.max(notifications.length - visibleCount, 0)
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Button variant='ghost' className='hover:bg-background !h-5 !w-5'>
              <Bell className='!h-5 !w-5' />
            </Button>
            {unreadCount > 0 && (
              <span className='bg-destructive absolute top-0 right-0 flex h-[14px] min-w-[14px] translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full px-1 text-[9px] leading-none text-white'>
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4'>
        <div className='flex items-center justify-between border-b pb-3'>
          <p className='text-lg font-medium'>Thông báo</p>
          {unreadCount > 0 && (
            <button
              className='text-sm text-blue-500 hover:cursor-pointer hover:text-blue-600'
              onClick={onMarkAllAsRead}
            >
              Đánh dấu đọc tất cả
            </button>
          )}
        </div>

        <div className='max-h-[450px] divide-y overflow-auto'>
          {notifications.length > 0 ? (
            visibleNotifications.map((notification) => (
              <div key={notification.notificationId} className='relative py-2 pr-10'>
                <div className='flex items-start gap-1.5'>
                  <span
                    className={`mt-2 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? 'invisible' : 'bg-blue-500'}`}
                  />
                  <div className='flex-1'>
                    <p className='font-medium'>{notification.title}</p>
                    <p className='text-muted-foreground text-sm'>{notification.content}</p>
                    <span className='text-muted-foreground text-xs whitespace-nowrap'>
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                <div className='absolute top-2 right-2 flex items-center gap-1'>
                  {!notification.isRead && (
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-5 w-5'
                      onClick={() => onMarkAsRead?.(notification.notificationId)}
                    >
                      <Check className='h-4 w-4 text-green-600' />
                    </Button>
                  )}
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-5 w-5'
                    onClick={() => onDelete?.(notification.notificationId)}
                  >
                    <Trash className='h-4 w-4 text-red-500' />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground mt-4 text-center text-sm'>Không có thông báo</p>
          )}
          {notificationRemaining > 0 && (
            <div className='mt-4 flex justify-center'>
              <p onClick={handleShowMore} className='border-blue-60 border-blue-700 text-blue-700 hover:text-blue-700'>
                Xem thêm {notificationRemaining} thông báo
              </p>
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className='mt-3 flex items-center justify-end'>
            <button
              className='text-sm font-medium text-red-500 hover:cursor-pointer hover:text-red-600'
              onClick={onDeleteAll}
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
