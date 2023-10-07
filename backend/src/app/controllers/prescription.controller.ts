import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { validate } from '../middlewares/validation.middleware'
import {
  type CreatePrescriptionRequest,
  GetPrescriptionResponse,
} from '../types/prescription.types'
import { CreatePrescriptionRequestValidator } from '../validators/prescription.validator'
import {
  createPrescription,
  getPrescriptions,
} from '../services/prescription.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { isDoctorAndApproved } from '../services/auth.service'
import { isUsernameLinkedToDoctorWithId } from '../services/doctor.service'
import { APIError } from '../errors'
export const prescriptionsRouter = Router()

prescriptionsRouter.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const id = req.params.id
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
  '/:id',
  validate(CreatePrescriptionRequestValidator),
  asyncWrapper<CreatePrescriptionRequest>(async (req, res) => {
    const id = req.params.id
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }

    const doctor = await isDoctorAndApproved(req.username)
    const sameUser = await isUsernameLinkedToDoctorWithId(
      req.username,
      req.params.id
    )

    if (!doctor && !sameUser) {
      throw new APIError('Only Doctors can add a prescription', 403)
    }

    await createPrescription(req.body, id)
    res.status(200).json('Prescription added Successfully')
  })
)
