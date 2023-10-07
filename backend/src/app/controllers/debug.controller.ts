import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import { DoctorStatus } from '../types/doctor.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { APIError } from '../errors'
import { AdminModel } from '../models/admin.model'
import { hash } from 'bcrypt'
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
      username: 'doctor' + Math.random(),
      password: await hash('doctor', bcryptSalt),
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
  '/create-patient1',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'patient1' + Math.random(),
      password: await hash('patient1', bcryptSalt),
    })

    const patient = await PatientModel.create({
      user: user.id,
      name: 'Patient1',
      email: user.username + '@gmail.com',
      mobileNumber: '0100',
      dateOfBirth: new Date(),
      gender: 'female',
      emergencyContact: {
        name: 'Emergency1',
        mobileNumber: '0100',
      },
    })

    res.send(patient)
  })
)
debugRouter.post(
  '/create-patient2',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'patient2' + Math.random(),
      password: await hash('patient2', bcryptSalt),
    })

    const patient = await PatientModel.create({
      user: user.id,
      name: 'Patient2',
      email: user.username + '@gmail.com',
      mobileNumber: '0100',
      dateOfBirth: new Date(),
      gender: 'female',
      emergencyContact: {
        name: 'Emergency2',
        mobileNumber: '0100',
      },
    })

    res.send(patient)
  })
)
debugRouter.get(
  '/patients',
  asyncWrapper(async (req, res) => {
    res.send(await PatientModel.find({ name: 'Patient1' }).populate('user'))
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

    res.send(await AdminModel.create({ user: user.id }))
  })
)
