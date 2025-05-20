import notificationApiRequest from '@/apiRequests/notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useNotificationList = () => {
  return useQuery({
    queryFn: () => notificationApiRequest.getNotificationList(),
    queryKey: ['notification-list']
  })
}

export const useReadNotificationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApiRequest.readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] })
    }
  })
}
export const useReadAllNotificationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApiRequest.readAllNotification,
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
