import { PrescriptionModel } from '../models/prescription.model'
import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { validate } from '../middlewares/validation.middleware'
import {
  type CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  GetPrescriptionResponse,
} from '../types/prescription.types'
import { CreatePrescriptionRequestValidator } from '../validators/prescription.validator'
import { getPrescriptions } from '../services/prescription.service'

export const prescriptionsRouter = Router()

prescriptionsRouter.get(
  '/',
  asyncWrapper(async (req, res) => {
    const id = req.query.id as string
    const prescriptionRequests = await getPrescriptions(id)
    res.send(
      new GetPrescriptionResponse(
        prescriptionRequests.map((prescription) => ({
          doctor: prescription.doctor.name,
          patient: prescription.patient.name,
          date: prescription.date,
          status: prescription.status === true ? 'Filled' : 'UnFilled',
        }))
      )
    )
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
