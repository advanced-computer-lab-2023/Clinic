import { Router } from 'express'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getPatientByName } from '../services/patient.service'
import { GetPatientResponse } from '../types/patient.types'

export const patientRouter = Router()

patientRouter.get(
  '/:name',
  asyncWrapper(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }
    const patient = await getPatientByName(req.params.name)
    res.send(
      new GetPatientResponse(
        patient.username,
        patient.password,
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
