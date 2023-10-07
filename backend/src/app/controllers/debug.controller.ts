import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import { DoctorStatus } from '../types/doctor.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { APIError } from '../errors'
import { AdminModel } from '../models/admin.model'
import { hash } from 'bcrypt'
import { UserType } from '../types/user.types'
import { PatientModel } from '../models/patient.model'

const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

/**
 * This is a controller that has some helper endpoints for debugging purposes.
 */

export const debugRouter = Router()

debugRouter.post(
  '/create-doctor',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'Yadoctor' + Math.random(),
      password: await hash('Yadoctor', bcryptSalt),
      type: UserType.Doctor,
    })

    const doctor = await DoctorModel.create({
      user: user.id,
      name: 'Doctor',
      email: user.username + '@gmail.com',
      dateOfBirth: new Date(),
      hourlyRate: 100,
      affiliation: 'Hospital',
      educationalBackground: 'University',
      requestStatus: DoctorStatus.Approved,
    })

    res.send(doctor)
  })
)

debugRouter.post(
  '/create-patient',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'patient' + Math.random(),
      password: await hash('patient', bcryptSalt),
      type: UserType.Patient,
    })

    const patient = await PatientModel.create({
      user: user.id,
      name: 'Patient',
      email: user.username + '@gmail.com',
      mobileNumber: '01001111111',
      dateOfBirth: new Date(),
      gender: 'female',
      emergencyContact: {
        name: 'Emergency1',
        mobileNumber: '0100111111',
      },
    })

    res.send(patient)
  })
)
debugRouter.post(
  '/create-patient-onlyonce',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'patientP',
      password: await hash('patient', bcryptSalt),
      type: UserType.Patient,
    })

    const patient = await PatientModel.create({
      user: user.id,
      name: 'Patient',
      email: user.username + '@gmail.com',
      mobileNumber: '01001111111',
      dateOfBirth: new Date(),
      gender: 'female',
      emergencyContact: {
        name: 'Emergency1',
        mobileNumber: '0100111111',
      },
    })

    res.send(patient)
  })
)
debugRouter.post(
  '/create-pending-doctor',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'pending-doctor2',
      password: await hash('doctor', bcryptSalt),
    })

    const doctor = await DoctorModel.create({
      user: user.id,
      name: 'Doctor',
      email: 'pending-doctor@gmail.com',
      dateOfBirth: new Date(),
      hourlyRate: 100,
      affiliation: 'Hospital',
      educationalBackground: 'University',
      requestStatus: DoctorStatus.Pending,
    })

    res.send(doctor)
  })
)

debugRouter.get(
  '/doctors',
  asyncWrapper(async (req, res) => {
    res.send(await DoctorModel.find().populate('user'))
  })
)

/**
 * This endpoint makes the current user an admin.
 */
debugRouter.get(
  '/make-me-admin',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const user = await UserModel.findOne({ username: req.username })

    if (user == null) {
      throw new APIError('User not found', 404)
    }

    if ((await AdminModel.count({ user: user.id })) > 0) {
      throw new APIError('User is already an admin', 400)
    }

    const admin = await AdminModel.create({ user: user.id })

    user.type = UserType.Admin
    await user.save()

    res.send(admin)
  })
)
