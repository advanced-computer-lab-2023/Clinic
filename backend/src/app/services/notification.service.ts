import {
  GetNotificationsRequest,
  RemoveNotificationRequest,
} from 'clinic-common/types/notification.types'
import { NotFoundError } from '../errors'
import { UserDocument, UserModel } from '../models/user.model'

export async function getUserNotifications({
  username,
}: GetNotificationsRequest) {
  const user = await UserModel.findOne({ username })

  if (!user) throw new NotFoundError()

  return user.notifications
}

export async function addUserNotification({
  username,
  notification,
}: {
  username: string
  notification: UserDocument['notifications'][0]
}) {
  const user = await UserModel.findOne({ username })
  console.log('i entered here')
  if (!user) throw new NotFoundError()

  user.notifications.push(notification)
  user.save()
  console.log(user.notifications)
}

export async function removeUserNotification({
  username,
  notificationId,
}: RemoveNotificationRequest) {
  const user = await UserModel.findOneAndUpdate(
    { username },
    {
      $pull: {
        notifications: { _id: notificationId },
      },
    }
  )

  if (!user) throw new NotFoundError()
}
