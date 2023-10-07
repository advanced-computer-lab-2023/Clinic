import {
  UsernameAlreadyTakenError,
} from '../errors/auth.errors'
import * as bcrypt from 'bcrypt'
import { UserModel } from '../models/user.model'
import { isUsernameTaken } from './auth.service'

import {
  type AddAdminRequest,
} from '../types/admin.types'
import { UserType } from '../types/user.types'
import { AddAdminResponse } from '../validators/admin.validation'
import { AdminModel } from '../models/admin.model'
import { DoctorModel } from '../models/doctor.model'
import { PatientModel } from '../models/patient.model'
import {NotFoundError} from "../errors";

const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

export async function addAdmin(
  request: AddAdminRequest
): Promise<AddAdminResponse> {
  const { username, password } = request
  if (await isUsernameTaken(request.username)) {
    throw new UsernameAlreadyTakenError()
  }
  const hashedPassword = await bcrypt.hash(password, bcryptSalt)

  const newUser = await UserModel.create({
    username,
    password: hashedPassword,
    type: UserType.Admin,
  })
  await newUser.save()

  const newAdmin = await AdminModel.create({
    user: newUser.id,
  })
  await newAdmin.save()
  return new AddAdminResponse(username, password)
}

export async function removeUser(username: string): Promise<void> {
  const user = await UserModel.findOneAndDelete({ username })
  if (user == null) {
    throw new NotFoundError()
  }
  await DoctorModel.findOneAndDelete({ user: user.id })
  await PatientModel.deleteOne({ user: user.id })
  await AdminModel.deleteOne({ user: user.id })
}