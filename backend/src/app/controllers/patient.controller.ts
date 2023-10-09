import { Router } from 'express'

import { asyncWrapper } from '../utils/asyncWrapper'
import { getPatientByID, getPatientByName } from '../services/patient.service'
import {
  APatientResponseBase,
  GetPatientResponse,
} from 'clinic-common/types/patient.types'

import {
  allowApprovedDoctorOfPatient,
  allowApprovedDoctors,
} from '../middlewares/auth.middleware'
import { type Gender } from 'clinic-common/types/gender.types'

export const patientRouter = Router()

patientRouter.get(
  '/:id',
  asyncWrapper(allowApprovedDoctorOfPatient),
  asyncWrapper(async (req, res) => {
    const id = req.params.id

    const { patient, appointments, prescriptions } = await getPatientByID(id)
    res.send(
      new APatientResponseBase(
        patient.id,
        patient.user.username,
        patient.name,
        patient.email,
        patient.mobileNumber,
        patient.dateOfBirth,
        patient.gender as Gender,
        {
          name: patient.emergencyContact?.name ?? '',
          mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
        },
        patient.documents,
        appointments,
        prescriptions
      )
    )
  })
)

patientRouter.get(
  '/search',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const name = req.query.name as string

    const patients = await getPatientByName(name)
    res.send(
      new GetPatientResponse(
        patients.map((patient) => ({
          id: patient.id,
          username: patient.user.username,
          name: patient.name,
          email: patient.email,
          mobileNumber: patient.mobileNumber,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender as Gender,
          emergencyContact: {
            name: patient.emergencyContact?.name ?? '',
            mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
          },
        }))
      )
    )
  })
)
