import { z } from 'zod'

export const GetNotificationsRequestValidator = z.object({
  username: z.string(),
})

export const RemoveNotificationRequestValidator = z.object({
  username: z.string(),
  notificationId: z.string(),
})
