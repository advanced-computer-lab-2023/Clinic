import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import { DoctorStatus } from '../types/doctor.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { APIError } from '../errors'
import { AdminModel } from '../models/admin.model'

/**
 * This is a controller that has some helper endpoints for debugging purposes.
 */

export const debugRouter = Router()

debugRouter.post(
  '/create-doctor',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'doctor2',
      password: 'doctor',
    })

    const doctor = await DoctorModel.create({
      user: user.id,
      name: 'Doctor',
      email: 'doctor@gmail.com',
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
  '/create-pending-doctor',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'pending-doctor2',
      password: 'doctor',
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
