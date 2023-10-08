import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import { UserModel, type UserDocument } from '../models/user.model'
import type { UpdateDoctorRequest } from '../types/doctor.types'
import { NotFoundError } from '../errors'
import { type WithUser } from '../utils/typeUtils'
/**
 * TODO: Replace DoctorDocumentWithUser with WithUser<DoctorDocument>,
 * leaving it for now not to break other PRs
 */
type DoctorDocumentWithUser = WithUser<DoctorDocument>

export async function getPendingDoctorRequests(): Promise<
  DoctorDocumentWithUser[]
> {
  const models = await DoctorModel.find({
    requestStatus: 'pending',
  }).populate<{ user: UserDocument }>('user')

  return models
}

export async function updateDoctorByUsername(
  username: string,
  request: UpdateDoctorRequest
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const updatedDoctor = await DoctorModel.findOneAndUpdate(
    { user: user.id },
    request,
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')

  if (updatedDoctor == null) {
    throw new NotFoundError()
  }

  return updatedDoctor
}

// fetches approved doctors only
export async function getAllDoctors(): Promise<DoctorDocumentWithUser[]> {
  const models = await DoctorModel.find({
    requestStatus: 'approved',
  }).populate<{ user: UserDocument }>('user')

  return models
}

export async function getDoctorByUsername(
  username: string
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOne({ user: user.id }).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) throw new NotFoundError()

  return doctor
}

// fetches approved doctors only
export async function getAllDoctors(): Promise<DoctorDocumentWithUser[]> {
  const models = await DoctorModel.find({
    requestStatus: 'approved',
  }).populate<{ user: UserDocument }>('user')

  return models
}
