import {
  GetNotificationsRequest,
  GetNotificationsResponse,
  RemoveNotificationRequest,
  RemoveNotificationResponse,
} from 'clinic-common/types/notification.types'
import { api } from '.'

export async function getNotifications(params: GetNotificationsRequest) {
  return await api
    .post<GetNotificationsResponse>('/notifications/all', params)
    .then((res) => res.data)
}

export async function removeNotification(params: RemoveNotificationRequest) {
  return await api.delete<RemoveNotificationResponse>('/notifications', {
    data: params,
  })
}
