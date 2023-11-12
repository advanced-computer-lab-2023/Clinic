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
import { type RegisterRequest } from 'clinic-common/types/auth.types'
import { UserType } from 'clinic-common/types/user.types'
import { type HydratedDocument } from 'mongoose'
import { PatientModel } from '../models/patient.model'
import {
  DoctorStatus,
  IRegisterDoctorRequest,
} from 'clinic-common/types/doctor.types'
import { type DoctorDocument, DoctorModel } from '../models/doctor.model'
import { hash } from 'bcrypt'
import { type WithUser } from '../utils/typeUtils'
import { AppointmentModel } from '../models/appointment.model'
import FireBase from '../../../../firebase.config'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { getDownloadURL } from 'firebase/storage'

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
  const usernameRegex = new RegExp(`^${username}$`, 'i')

  const count = await UserModel.countDocuments({ username: usernameRegex })

  return count > 0
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
  doctor: IRegisterDoctorRequest
): Promise<WithUser<DoctorDocument>> {
  console.log(doctor)

  if (await isUsernameTaken(doctor.username)) {
    throw new UsernameAlreadyTakenError()
  }

  const existingDoctor = await DoctorModel.findOne({ email: doctor.email })

  if (existingDoctor !== null && existingDoctor !== undefined) {
    throw new EmailAlreadyTakenError()
  }

  const user = await UserModel.create({
    username: doctor.username,
    password: await hash(doctor.password, bcryptSalt),
    type: UserType.Doctor,
  })
  await user.save()
  const documentsPaths: string[] = []
  const storage = getStorage(FireBase)
  const storageRef = ref(storage, 'doctors/')

  for (let i = 0; i < doctor.documents.length; i++) {
    const fileRef = ref(storageRef, doctor.name + [i])
    await uploadBytes(fileRef, doctor.documents[i].buffer, {
      contentType: doctor.documents[i].mimetype,
    })
    const fullPath = await getDownloadURL(fileRef)
    documentsPaths.push(fullPath.toString())
  }

  const newDoctor = await DoctorModel.create({
    user: user.id,
    name: doctor.name,
    email: doctor.email,
    dateOfBirth: doctor.dateOfBirth,
    hourlyRate: parseInt(doctor.hourlyRate),
    affiliation: doctor.affiliation,
    educationalBackground: doctor.educationalBackground,
    speciality: doctor.speciality,
    requestStatus: DoctorStatus.Pending,
    documents: documentsPaths,
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

export async function isPatient(username: string): Promise<boolean> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    return false
  }

  const patient = await PatientModel.findOne({ user: user.id })

  return patient != null
}

export async function isDoctorAndApproved(username: string): Promise<boolean> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    return false
  }

  const doctor = await DoctorModel.findOne({ user: user.id })

  return (
    doctor != null &&
    doctor.requestStatus === 'approved' &&
    doctor.contractStatus === 'accepted'
  )
}

export async function isDoctorPatientAuthorized(
  username: string,
  id: string
): Promise<boolean> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    return false
  }

  const doctor = await DoctorModel.findOne({ user: user.id })

  if (doctor == null) {
    return false
  }

  if (doctor.requestStatus !== 'approved') {
    return false
  }

  const appointment = await AppointmentModel.findOne({
    doctorID: doctor.id,
    patientID: id,
  })

  if (appointment == null) {
    return false
  }

  return true
}
