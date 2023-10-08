import { Router } from 'express'

import { asyncWrapper } from '../utils/asyncWrapper'
import { getPatientByID, getPatientByName } from '../services/patient.service'
import {
  GetPatientResponse,
  PatientResponseBase,
} from 'clinic-common/types/patient.types'
import {
  NotAuthenticatedError,
  NotAuthorizedError,
} from '../errors/auth.errors'
import { isDoctorAndApproved } from '../services/auth.service'

export const patientRouter = Router()

patientRouter.get(
  '/view/:id',
  asyncWrapper(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }
    if (!(await isDoctorAndApproved(req.username))) {
      throw new NotAuthorizedError()
    }
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
  asyncWrapper(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }
    if (!(await isDoctorAndApproved(req.username))) {
      throw new NotAuthorizedError()
    }
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
