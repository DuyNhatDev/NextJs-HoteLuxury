import z from 'zod'

export const NotificationSchema = z.object({
  notificationId: z.number(),
  userId: z.number(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.date()
})

export type NotificationType = z.infer<typeof NotificationSchema>

export const NotificationListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(NotificationSchema)
})

export type NotificationListResType = z.infer<typeof NotificationListResSchema>
