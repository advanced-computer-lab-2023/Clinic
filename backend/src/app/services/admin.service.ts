import { UsernameAlreadyTakenError } from '../errors/auth.errors'
import * as bcrypt from 'bcrypt'
import { UserModel } from '../models/user.model'
import { isUsernameTaken } from './auth.service'
import { type AddAnotherAdminRequest } from '../types/admin.types'
import { UserType } from '../types/user.types'
import { AddAnotherAdminResponse } from '../validators/admin.validation'

const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

export async function AddAnotherAdmin(
  request: AddAnotherAdminRequest
): Promise<AddAnotherAdminResponse> {
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
  return new AddAnotherAdminResponse(username, password)
}
