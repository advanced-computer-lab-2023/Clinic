import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { type UserDocument, UserModel } from '../models/user.model'
import {
  TokenError,
  LoginError,
  UsernameAlreadyTakenError,
  EmailAlreadyTakenError,
} from '../errors/auth.errors'
import { APIError, NotFoundError } from '../errors'
import { type RegisterRequest } from '../types/auth.types'
import { UserType } from '../types/user.types'
import { type HydratedDocument } from 'mongoose'
import { PatientModel } from '../models/patient.model'
import { DoctorStatus, type RegisterDoctorRequest } from '../types/doctor.types'
import { type DoctorDocument, DoctorModel } from '../models/doctor.model'
import { hash } from 'bcrypt'
import { type WithUser } from '../utils/typeUtils'

const jwtSecret = process.env.JWT_TOKEN ?? 'secret'
const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

export class JwtPayload {
  constructor(public username: string) {}
}

export async function login(
  username: string,
  password: string
): Promise<string> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new LoginError()
  }

  const hashedPassword = await bcrypt.hash(password, bcryptSalt)

  if (user.password !== hashedPassword) {
    throw new APIError('Password is incorrect', 400)
  }

  const payload = new JwtPayload(username)

  return await generateJWTToken(payload)
}

export async function registerPatient(
  request: RegisterRequest
): Promise<string> {
  const {
    name,
    email,
    dateOfBirth,
    gender,
    mobileNumber,
    emergencyContact: {
      name: emergencyContactName,
      mobileNumber: emergencyMobileNumber,
    },
  } = request
  if (await isUsernameTaken(request.username)) {
    throw new UsernameAlreadyTakenError()
  }
  const hashedPassword = await bcrypt.hash(request.password, bcryptSalt)

  const newUser = await UserModel.create({
    username: request.username,
    password: hashedPassword,
    type: UserType.Patient,
  })
  await newUser.save()
  const newPatient = await PatientModel.create({
    user: newUser.id,
    name,
    email,
    dateOfBirth,
    gender,
    mobileNumber,
    emergencyContact: {
      name: emergencyContactName,
      mobileNumber: emergencyMobileNumber,
    },
  })
  await newPatient.save()
  return await generateJWTToken(new JwtPayload(newUser.username))
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  return (await UserModel.count({ username })) > 0
}

export async function verifyJWTToken(token: string): Promise<JwtPayload> {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err != null || decoded == null) {
        reject(new TokenError())
      } else {
        resolve(decoded as JwtPayload)
      }
    })
  })
}

export async function generateJWTToken(payload: JwtPayload): Promise<string> {
  return await new Promise((resolve, reject) => {
    jwt.sign({ ...payload }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err != null || token == null) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export async function isAdmin(username: string): Promise<boolean> {
  const user = await UserModel.findOne({ username })
  if (user == null) {
    return false
  }
  return user.type === UserType.Admin
}

export async function getUserByUsername(
  username: string
): Promise<HydratedDocument<UserDocument>> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new NotFoundError()
  }

  return user
}

export async function submitDoctorRequest(
  doctor: RegisterDoctorRequest
): Promise<WithUser<DoctorDocument>> {
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
    type: UserType.Doctor,
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
  return (await newDoctor.populate<{ user: UserDocument }>(
    'user'
  )) as WithUser<DoctorDocument>
}
export async function isDoctor(username: string): Promise<boolean> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    return false
  }

  const doctor = await DoctorModel.findOne({ user: user.id })

  return doctor != null
}
