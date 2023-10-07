import { type HydratedDocument } from 'mongoose'
import { type UserDocument } from '../models/user.model'

/**
 * When populating a document, the user field should be replaced from an ID to a UserDocument,
 * this helper type is used to do that.
 *
 * For example: WithUser<DoctorDocument> gives you a doctor but with user field populated
 */
export type WithUser<T> = Omit<HydratedDocument<T>, 'user'> & {
  user: UserDocument
}
