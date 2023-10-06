import type { HydratedDocument } from 'mongoose'
import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import type { UserDocument } from '../models/user.model'

type DoctorDocumentWithUser = Omit<HydratedDocument<DoctorDocument>, 'user'> & {
  user: UserDocument
}

export async function getPendingDoctorRequests(): Promise<
  DoctorDocumentWithUser[]
> {
  const models = await DoctorModel.find({
    requestStatus: 'pending',
  }).populate<{ user: UserDocument }>('user')

  return models
}
