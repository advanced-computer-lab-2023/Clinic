import { Router } from 'express'

import { asyncWrapper } from '../utils/asyncWrapper'
import { getPatientByName } from '../services/patient.service'
import { GetPatientResponse } from '../types/patient.types'
import { NotAuthenticatedError } from '../errors/auth.errors'

export const patientRouter = Router()

patientRouter.get(
  '/search',
  asyncWrapper(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }
    const name = req.query.name as string

    const patients = await getPatientByName(name)
    res.send(
      new GetPatientResponse(
        patients.map((patient) => ({
          username: patient.username,
          password: patient.password,
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
