import notificationApiRequest from '@/api/notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetNotificationList = () => {
  return useQuery({
    queryFn: () => notificationApiRequest.getNotificationList(),
    queryKey: ['notification-list']
  })
}

export const useMarkAsReadNotificationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApiRequest.markAsReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] })
    }
  })
}
export const useMarkReadAllNotificationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApiRequest.markReadAllNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] })
    }
  })
}
export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApiRequest.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] })
    }
  })
}
export const useDeleteAllNotificationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApiRequest.deleteAllNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] })
    }
  })
}
