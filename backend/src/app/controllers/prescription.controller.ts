import { PrescriptionModel } from '../models/prescription.model'
import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { validate } from '../middlewares/validation.middleware'
import {
  type CreatePrescriptionRequest,
  CreatePrescriptionResponse,
} from '../types/prescription.types'
import { CreatePrescriptionRequestValidator } from '../validators/prescription.validator'
import { getPrescriptions } from '../services/prescription.service'

export const prescriptionsRouter = Router()

prescriptionsRouter.get(
  '/',
  asyncWrapper(async (req, res) => {
    const prescriptionRequests = await getPrescriptions()
    res.send(prescriptionRequests)
  })
)

prescriptionsRouter.post(
  '/',
  validate(CreatePrescriptionRequestValidator),
  asyncWrapper<CreatePrescriptionRequest>(async (req, res) => {
    const { patient, date } = req.body

    const prescription = await PrescriptionModel.create({
      patient,
      date,
    })

    res
      .status(200)
      .json(
        new CreatePrescriptionResponse(
          prescription.date,
          prescription.doctor.toString(),
          prescription.patient.toString()
        )
      )
  })
)
