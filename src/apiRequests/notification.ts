import http from '@/lib/http'
import { NotificationListResType } from '@/schemaValidations/notification.schema'

const prefix = '/notification'

const notificationApiRequest = {
  getNotificationList: () => http.get<NotificationListResType>(`${prefix}?`),
  markAsReadNotification: (id: number) => http.put(`${prefix}/${id}`, { isRead: true }),
  markReadAllNotification: () => http.put(`${prefix}`, { isRead: true }),
  deleteNotification: (id: number) => http.delete(`${prefix}/${id}`),
  deleteAllNotification: () => http.delete(`${prefix}`)
}
export default notificationApiRequest
