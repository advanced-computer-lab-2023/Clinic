import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import { UserModel, type UserDocument } from '../models/user.model'
import {
  DoctorStatus,
  type UpdateDoctorRequest,
} from 'clinic-common/types/doctor.types'
import { APIError, NotFoundError } from '../errors'
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
    requestStatus: DoctorStatus.Pending,
  }).populate<{ user: UserDocument }>('user')
  return models
}

export async function updateDoctorByUsername(
  username: string,
  request: UpdateDoctorRequest
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOne({ user: user.id })

  // If the doctor tried to change their email with the same email they already have,
  // no errors should be thrown, otherwise, check if the email already exists
  if (
    doctor?.email !== request.email &&
    (await DoctorModel.count({ email: request.email })) > 0
  ) {
    throw new APIError('Email already exists', 400)
  }

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

export async function getApprovedDoctorById(
  doctorId: string
): Promise<DoctorDocumentWithUser> {
  const doctor = await DoctorModel.findById({
    _id: doctorId,
    requestStatus: 'approved',
  }).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) throw new NotFoundError()

  return doctor
}
