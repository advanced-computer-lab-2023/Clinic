import type { HydratedDocument } from 'mongoose'
import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import type { UserDocument } from '../models/user.model'
import type { UpdateDoctorRequest } from '../types/doctor.types'
import { NotFoundError } from '../errors'

export type DoctorDocumentWithUser = Omit<
  HydratedDocument<DoctorDocument>,
  'user'
> & {
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

export async function updateDoctor(
  id: string,
  request: UpdateDoctorRequest
): Promise<DoctorDocumentWithUser> {
  const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, request, {
    new: true,
  }).populate<{
    user: UserDocument
  }>('user')

  if (updatedDoctor == null) {
    throw new NotFoundError()
  }

  return updatedDoctor
}

export async function isUsernameLinkedToDoctorWithId(
  username: string,
  id: string
): Promise<boolean> {
  const doctor = await DoctorModel.findById(id).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) {
    throw new NotFoundError()
  }

  return doctor.user.username === username
}
