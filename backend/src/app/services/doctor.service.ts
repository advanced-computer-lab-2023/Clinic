import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import type { UserDocument } from '../models/user.model'
import { type UpdateDoctorRequest } from '../types/doctor.types'

import { NotFoundError } from '../errors'
import { type WithUser } from '../utils/typeUtils'
/**
 * TODO: Replace DoctorDocumentWithUser with WithUser<DoctorDocument>,
 * leaving it for now not to break other PRs
 */
export type DoctorDocumentWithUser = WithUser<DoctorDocument>



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

// fetches approved doctors only
export async function getAllDoctors(): Promise<DoctorDocumentWithUser[]> {
  const models = await DoctorModel.find({
    requestStatus: 'approved',
  }).populate<{ user: UserDocument }>('user')

  return models
}
