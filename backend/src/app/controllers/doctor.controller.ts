import { Router } from 'express'

import {
  getAllDoctors,
  getDoctorWithRate,
  getPendingDoctorRequests,
  isUsernameLinkedToDoctorWithId,
  updateDoctor,
} from '../services/doctor.service'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth.middleware'
import {
  GetApprovedDoctorsResponse,
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
          dateOfBirth: doctor.dateOfBirth,
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
        }))
      )
    )
  })
)

doctorsRouter.patch(
  '/:id',
  validate(UpdateDoctorRequestValidator),
  asyncWrapper<UpdateDoctorRequest>(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }

    const admin = await isAdmin(req.username)
    const sameUser = await isUsernameLinkedToDoctorWithId(
      req.username,
      req.params.id
    )

    if (!admin && !sameUser) {
      throw new APIError(
        'Only admins and the doctor can update their profile',
        403
      )
    }

    const updatedDoctor = await updateDoctor(req.params.id, req.body)

    res.send(
      new UpdateDoctorResponse(
        updatedDoctor.id,
        updatedDoctor.user.username,
        updatedDoctor.name,
        updatedDoctor.email,
        updatedDoctor.dateOfBirth,
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
          dateOfBirth: doctor.dateOfBirth,
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
        }))
      )
    )
  })
)

doctorsRouter.get(
  /doctors-with-rate/,
  asyncWrapper(async (req, res) => {
    const doctors = await getDoctorWithRate()
    res.send(
      new GetApprovedDoctorsResponse(
        doctors.map((doctor) => ({
          id: doctor.id,
          username: doctor.user.username,
          name: doctor.name,
          email: doctor.email,
          dateOfBirth: doctor.dateOfBirth,
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
          sessionRate: doctor.hourlyRate * 1.1 - 5, // dummy discount percentage until packages done
          speciality: 'Dentist', // dummy data untill i know whether speciality is the same as edu-background
        }))
      )
    )
  })
)
