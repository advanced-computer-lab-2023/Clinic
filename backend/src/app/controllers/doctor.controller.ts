import { Router } from 'express'

import {
  getAllDoctors,
  getDoctorByUsername,
  getMyPatients,
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
} from 'clinic-common/types/doctor.types'
import type { UpdateDoctorRequest } from 'clinic-common/types/doctor.types'
import { isAdmin } from '../services/auth.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { APIError } from '../errors'
import { validate } from '../middlewares/validation.middleware'
import { UpdateDoctorRequestValidator } from 'clinic-common/validators/doctor.validator'
import { GetMyPatientsResponse } from 'clinic-common/types/patient.types'
import { type Gender } from 'clinic-common/types/gender.types'

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
          speciality: doctor.speciality,
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
        updatedDoctor.dateOfBirth,
        updatedDoctor.hourlyRate,
        updatedDoctor.affiliation,
        updatedDoctor.educationalBackground,
        updatedDoctor.speciality
      )
    )
  })
)

// Get all (approved) doctors
doctorsRouter.get(
  '/approved',
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
          speciality: doctor.speciality,
          educationalBackground: doctor.educationalBackground,
          sessionRate: doctor.hourlyRate * 1.1 - Math.random() * 10, // this is a random discount till the pachage part is done
          // TODO: retrieve available times from the Appointments. Since we aren't required to make appointments for this sprint, I will
          // assume available times is a field in the doctors schema for now.
          availableTimes: ((doctor.availableTimes) as  [string]),
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
        doctor.dateOfBirth,
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.speciality,
        doctor.educationalBackground
      )
    )
  })
)

doctorsRouter.get(
  '/myPatients',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const username: string | undefined = req.username
    const usernameString: string = username ?? ''
    const doctor = await getDoctorByUsername(usernameString)
    console.log(doctor)
    const patients = await getMyPatients(doctor.id)
    res.send(
      new GetMyPatientsResponse(
        patients.map((patient) => ({
          id: patient.user.toString(),
          name: patient.name,
          email: patient.email,
          mobileNumber: patient.mobileNumber,
          dateOfBirth: patient.dateOfBirth.toDateString(),
          gender: patient.gender as Gender,
          emergencyContact: {
            name: patient.emergencyContact?.name ?? '',
            mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
          },
          familyMembers: patient.familyMembers,
        }))
      )
    )
  })
)
