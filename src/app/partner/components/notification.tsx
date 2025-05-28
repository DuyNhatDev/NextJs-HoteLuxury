'use client'
import NotificationBadge from '@/components/customize/notification-badge'
import { handleErrorApi } from '@/lib/utils'
import {
  useDeleteAllNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationList,
  useMarkAsReadNotificationMutation,
  useMarkReadAllNotificationMutation
} from '@/hooks/queries/useNotification'
import { CreateBookingResType } from '@/schemaValidations/booking-schema'
import { useAppStore } from '@/store/app-store'
import { useEffect } from 'react'

export default function Notification() {
  const socket = useAppStore((state) => state.socket)
  const { data, refetch } = useGetNotificationList()
  const listNotification = data?.payload?.data || []
  const markAsReadNotificationMutation = useMarkAsReadNotificationMutation()
  const markReadAllNotificationMutation = useMarkReadAllNotificationMutation()
  const deleteNotificationMutation = useDeleteNotificationMutation()
  const deleteAllNotificationMutation = useDeleteAllNotificationMutation()

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onNewBooking() {
      refetch()
    }
    function onCancelBooking() {
      refetch()
    }
    socket?.on('new-booking', onNewBooking)
    socket?.on('cancel-booking', onCancelBooking)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('new-booking', onNewBooking)
      socket?.off('cancel-booking', onNewBooking)
    }
  }, [refetch, socket])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadNotificationMutation.mutateAsync(id)
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }
  const handleMarkReadAll = async () => {
    try {
      await markReadAllNotificationMutation.mutateAsync()
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }
  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationMutation.mutateAsync(id)
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotificationMutation.mutateAsync()
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <NotificationBadge
      notifications={listNotification}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkReadAll}
      onDelete={handleDelete}
      onDeleteAll={handleDeleteAll}
    />
  )
}
