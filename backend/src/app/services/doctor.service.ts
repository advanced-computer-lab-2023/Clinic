import type { HydratedDocument } from 'mongoose'
import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import type { UserDocument } from '../models/user.model'
import {
  DoctorStatus,
  type RegisterDoctorRequest,
  RegisterDoctorRequestResponse,
  type UpdateDoctorRequest,
} from '../types/doctor.types'

import { NotFoundError } from '../errors'

import { UserModel } from '../models/user.model'
import { hash } from 'bcrypt'
import {
  EmailAlreadyTakenError,
  UsernameAlreadyTakenError,
} from '../errors/auth.errors'
import { isUsernameTaken } from './auth.service'

type DoctorDocumentWithUser = Omit<HydratedDocument<DoctorDocument>, 'user'> & {
  user: UserDocument
}
const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

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

export async function submitDoctorRequest(
  doctor: RegisterDoctorRequest
): Promise<RegisterDoctorRequestResponse> {
  if (await isUsernameTaken(doctor.username)) {
    throw new UsernameAlreadyTakenError()
  }
  const existingDoctor = await DoctorModel.findOne({ email: doctor.email })

  if (existingDoctor !== null && existingDoctor !== undefined) {
    throw new EmailAlreadyTakenError()
  }
  const user = await UserModel.create({
    username: doctor.username,
    password: await hash('doctor', bcryptSalt),
  })
  await user.save()
  const newDoctor = await DoctorModel.create({
    username: doctor.username,
    user: user.id,
    name: doctor.name,
    email: doctor.email,
    dateOfBirth: doctor.dateOfBirth,
    hourlyRate: doctor.hourlyRate,
    affiliation: doctor.affiliation,
    educationalBackground: doctor.educationalBackground,
    requestStatus: DoctorStatus.Pending,
  })
  await newDoctor.save()
  return new RegisterDoctorRequestResponse(
    doctor.username,
    doctor.name,
    doctor.email,
    doctor.dateOfBirth,
    doctor.hourlyRate,
    doctor.affiliation,
    doctor.educationalBackground
  )
}
