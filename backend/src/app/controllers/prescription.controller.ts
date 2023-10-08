import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { validate } from '../middlewares/validation.middleware'

import {
  createPrescription,
  getPrescriptions,
} from '../services/prescription.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { isDoctorAndApproved } from '../services/auth.service'
import {
  type CreatePrescriptionRequest,
  GetPrescriptionResponse,
} from 'clinic-common/types/prescription.types'

import { APIError } from '../errors'
import { CreatePrescriptionRequestValidator } from 'clinic-common/validators/prescription.validator'

export const prescriptionsRouter = Router()

prescriptionsRouter.get(
  '/',
  asyncWrapper(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }
    const prescriptionRequests = await getPrescriptions(req.username)
    res.send(
      new GetPrescriptionResponse(
        prescriptionRequests.map((prescription) => ({
          doctor: prescription.doctor.name,
          patient: prescription.patient.name,
          date: prescription.date.toDateString(),
          status: prescription.status ? 'Filled' : 'UnFilled',
          medicine: prescription.medicine,
        }))
      )
    )
  })
)

prescriptionsRouter.post(
  '/',
  validate(CreatePrescriptionRequestValidator),
  asyncWrapper<CreatePrescriptionRequest>(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }

    const doctor = await isDoctorAndApproved(req.username)

    if (!doctor) {
      throw new APIError('Only Doctors can add a prescription', 403)
    }

    await createPrescription(req.body, req.username)
    res.status(200).json('Prescription added Successfully')
  })
)
