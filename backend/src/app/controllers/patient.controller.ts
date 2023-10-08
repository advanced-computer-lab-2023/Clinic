import { Router } from 'express'

import { asyncWrapper } from '../utils/asyncWrapper'
import { getPatientByID, getPatientByName } from '../services/patient.service'
import {
  GetPatientResponse,
  PatientResponseBase,
} from 'clinic-common/types/patient.types'

import { allowApprovedDoctors } from '../middlewares/auth.middleware'

export const patientRouter = Router()

patientRouter.get(
  '/:id',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const id = req.params.id

    const patient = await getPatientByID(id)
    res.send(
      new PatientResponseBase(
        patient.id,
        patient.user.username,
        patient.name,
        patient.email,
        patient.mobileNumber,
        patient.dateOfBirth,
        patient.gender,
        {
          name: patient.emergencyContact?.name ?? '',
          mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
        }
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
          gender: patient.gender,
          emergencyContact: {
            name: patient.emergencyContact?.name ?? '',
            mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
          },
        }))
      )
    )
  })
)
