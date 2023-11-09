import { z } from 'zod'
import {
  GetNotificationsRequestValidator,
  RemoveNotificationRequestValidator,
} from '../validators/notification.validator'

export type GetNotificationsRequest = z.infer<
  typeof GetNotificationsRequestValidator
>

export interface GetNotificationsResponse {
  notifications: Array<{
    _id: string
    title: string
    description?: string
  }>
}

export type RemoveNotificationRequest = z.infer<
  typeof RemoveNotificationRequestValidator
>

export type RemoveNotificationResponse = void
