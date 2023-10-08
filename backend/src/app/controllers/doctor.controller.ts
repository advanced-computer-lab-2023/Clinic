import { Router } from 'express'

import {
  getAllDoctors,
  getDoctorByUsername,
  getPendingDoctorRequests,
  updateDoctorByUsername,
} from '../services/doctor.service'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins, allowAuthenticated } from '../middlewares/auth.middleware'
import {
  GetApprovedDoctorsResponse,
  GetDoctorResponse,
  GetPendingDoctorsResponse,
  UpdateDoctorResponse,
} from '../types/doctor.types'
import type { UpdateDoctorRequest } from '../types/doctor.types'
import { isAdmin } from '../services/auth.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { APIError } from '../errors'
import { validate } from '../middlewares/validation.middleware'
import { UpdateDoctorRequestValidator } from '../validators/doctor.validator'

export const doctorsRouter = Router()

doctorsRouter.get(
  '/pending',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const pendingDoctorRequests = await getPendingDoctorRequests()
    res.send(
      new GetPendingDoctorsResponse(
        pendingDoctorRequests.map((doctor) => ({
          id: doctor.id,
          username: doctor.user.username,
          name: doctor.name,
          email: doctor.email,
          dateOfBirth: doctor.dateOfBirth.toDateString(),
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
        }))
      )
    )
  })
)

doctorsRouter.patch(
  '/:username',
  validate(UpdateDoctorRequestValidator),
  asyncWrapper<UpdateDoctorRequest>(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }

    const admin = await isAdmin(req.username)
    const sameUser = req.username === req.params.username

    if (!admin && !sameUser) {
      throw new APIError(
        'Only admins and the doctor can update their profile',
        403
      )
    }

    const updatedDoctor = await updateDoctorByUsername(
      req.params.username,
      req.body
    )

    res.send(
      new UpdateDoctorResponse(
        updatedDoctor.id,
        updatedDoctor.user.username,
        updatedDoctor.name,
        updatedDoctor.email,
        updatedDoctor.dateOfBirth.toDateString(),
        updatedDoctor.hourlyRate,
        updatedDoctor.affiliation,
        updatedDoctor.educationalBackground
      )
    )
  })
)

// Get all (approved) doctors
doctorsRouter.get(
  '/all',
  asyncWrapper(async (req, res) => {
    const doctors = await getAllDoctors()

    res.send(
      new GetApprovedDoctorsResponse(
        doctors.map((doctor) => ({
          id: doctor.id,
          username: doctor.user.username,
          name: doctor.name,
          email: doctor.email,
          dateOfBirth: doctor.dateOfBirth.toDateString(),
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
        }))
      )
    )
  })
)

doctorsRouter.get(
  '/:username',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const doctor = await getDoctorByUsername(req.params.username)

    res.send(
      new GetDoctorResponse(
        doctor.id,
        doctor.user.username,
        doctor.name,
        doctor.email,
        doctor.dateOfBirth.toDateString(),
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.educationalBackground
      )
    )
  })
)
