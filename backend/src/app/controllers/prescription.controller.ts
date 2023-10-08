import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { validate } from '../middlewares/validation.middleware'

import {
  createPrescription,
  getPrescriptions,
} from '../services/prescription.service'
import { NotAuthorizedError } from '../errors/auth.errors'
import { isDoctorAndApproved, isPatient } from '../services/auth.service'
import {
  type CreatePrescriptionRequest,
  GetPrescriptionResponse,
} from 'clinic-common/types/prescription.types'

import { CreatePrescriptionRequestValidator } from 'clinic-common/validators/prescription.validator'
import {
  allowApprovedDoctors,
  allowAuthenticated,
  allowPatients,
} from '../middlewares/auth.middleware'

export const prescriptionsRouter = Router()

prescriptionsRouter.get(
  // Renamed from '/' to '/mine', because I added another one `/:patientUsername` to get all prescriptions for a patient by username
  '/mine',
  asyncWrapper(allowPatients),
  asyncWrapper(async (req, res) => {
    // `!` that is after `req.username` is used to tell TS that we are sure that req.username is not null
    const prescriptionRequests = await getPrescriptions(req.username!)

    res.send(
      new GetPrescriptionResponse(
        prescriptionRequests.map((prescription) => ({
          doctor: prescription.doctor.name,
          patient: prescription.patient.name,
          date: prescription.date,
          isFilled: prescription.isFilled,
          medicine: prescription.medicine,
        }))
      )
    )
  })
)

prescriptionsRouter.post(
  '/',
  [
    asyncWrapper(allowApprovedDoctors),
    validate(CreatePrescriptionRequestValidator),
  ],
  asyncWrapper<CreatePrescriptionRequest>(async (req, res) => {
    await createPrescription(req.body, req.username!)
    res.status(200).json('Prescription added Successfully')
  })
)

prescriptionsRouter.get(
  // Renamed from '/' to '/mine', because I added another one `/:patientUsername` to get all prescriptions for a patient by username
  '/:patientUsername',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    // Allow only doctors and the patient to get the prescriptions
    if (
      !(
        (await isDoctorAndApproved(req.username!)) ||
        ((await isPatient(req.username!)) &&
          req.params.patientUsername === req.username!)
      )
    ) {
      throw new NotAuthorizedError()
    }

    const prescriptions = await getPrescriptions(req.params.patientUsername)

    res.send(
      new GetPrescriptionResponse(
        prescriptions.map((prescription) => ({
          doctor: prescription.doctor.name,
          patient: prescription.patient.name,
          date: prescription.date,
          isFilled: prescription.isFilled,
          medicine: prescription.medicine,
        }))
      )
    )
  })
)
