import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import {
  UpdateHealthPackageResponse,
  type UpdateHealthPackageRequest,
  type createHealthPackageRequest,
  GetAllHealthPackagesResponse,
  AddHealthPackageResponse,
  GetHealthPackageResponse,
  GetHealthPackageForPatientResponse,
  GetHealthPackageForPatientRequest,
  SubscribeToHealthPackageRequest,
} from 'clinic-common/types/healthPackage.types'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  allowAdmins,
  allowAuthenticated,
  allowPatients,
} from '../middlewares/auth.middleware'
import {
  addHealthPackages,
  getAllHealthPackages,
  getHealthPackageById,
  removeHealthPackage,
  updateHealthPackage,
} from '../services/healthPackage.service'
import {
  CreateHealthPackageRequestValidator,
  UpdateHealthPackageRequestValidator,
} from 'clinic-common/validators/healthPackage.validator'
import {
  getDiscount,
  subscribeToHealthPackage,
  unSubscribeToHealthPackage,
} from '../services/patient.service'
import { getPatientByUsername } from '../services/patient.service'
import { APIError, NotFoundError } from '../errors'
import { GetWalletMoneyResponse } from 'clinic-common/types/patient.types'
import { Types } from 'mongoose'
import { FamilyMemberModel } from '../models/familyMember.model'
import { PatientModel } from '../models/patient.model'

export const healthPackagesRouter = Router()

healthPackagesRouter.post(
  '/',
  asyncWrapper(allowAdmins),
  validate(CreateHealthPackageRequestValidator),
  asyncWrapper<createHealthPackageRequest>(async (req, res) => {
    const healthPackage = await addHealthPackages(req.body)

    res.send({
      name: healthPackage.name,
      id: healthPackage.id,
      pricePerYear: healthPackage.pricePerYear,
      sessionDiscount: healthPackage.sessionDiscount,
      medicineDiscount: healthPackage.medicineDiscount,
      familyMemberSubscribtionDiscount:
        healthPackage.familyMemberSubscribtionDiscount,
    } satisfies AddHealthPackageResponse)
  })
)

healthPackagesRouter.patch(
  '/:id',
  asyncWrapper(allowAdmins),
  validate(UpdateHealthPackageRequestValidator),
  asyncWrapper<UpdateHealthPackageRequest>(async (req, res) => {
    const updatedHealthPackage = await updateHealthPackage(
      req.params.id,
      req.body
    )
    res.send({
      name: updatedHealthPackage.name,
      id: updatedHealthPackage.id,
      pricePerYear: updatedHealthPackage.pricePerYear,
      sessionDiscount: updatedHealthPackage.sessionDiscount,
      medicineDiscount: updatedHealthPackage.medicineDiscount,
      familyMemberSubscribtionDiscount:
        updatedHealthPackage.familyMemberSubscribtionDiscount,
    } satisfies UpdateHealthPackageResponse)
  })
)

healthPackagesRouter.delete(
  '/:id',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    await removeHealthPackage(req.params.id)
    res.send('deletedSuccefuly')
  })
)

healthPackagesRouter.get(
  '/',
  asyncWrapper(async (req, res) => {
    const healthPackages = await getAllHealthPackages()

    res.send({
      healthPackages: healthPackages.map((healthPackage) => ({
        name: healthPackage.name,
        id: healthPackage.id,
        pricePerYear: healthPackage.pricePerYear,
        sessionDiscount: healthPackage.sessionDiscount,
        medicineDiscount: healthPackage.medicineDiscount,
        familyMemberSubscribtionDiscount:
          healthPackage.familyMemberSubscribtionDiscount,
      })),
    } satisfies GetAllHealthPackagesResponse)
  })
)

healthPackagesRouter.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const healthPackage = await getHealthPackageById(req.params.id)

    res.send({
      name: healthPackage.name,
      id: healthPackage.id,
      pricePerYear: healthPackage.pricePerYear,
      sessionDiscount: healthPackage.sessionDiscount,
      medicineDiscount: healthPackage.medicineDiscount,
      familyMemberSubscribtionDiscount:
        healthPackage.familyMemberSubscribtionDiscount,
    } satisfies GetHealthPackageResponse)
  })
)

// healthPackagesRouter.post(
//   '/:id/subscribe',
//   [allowAuthenticated, asyncWrapper(allowPatients)],
//   asyncWrapper(async (req, res) => {
//     const patientId = getPatientIdFromUsername(req.username!)

//     await subscribeToHealthPackage({
//       patientId,
//       healthPackageId: req.params.id,
//     })

//     res.status(200).send()
//   })
// )

healthPackagesRouter.post(
  '/unsubscribe',
  [allowAuthenticated, asyncWrapper(allowPatients)],
  asyncWrapper(async (req, res) => {
    const { subscriberId, isFamilyMember } = req.body

    await unSubscribeToHealthPackage({
      id: subscriberId,
      isFamilyMember,
    })
    res.status(200).send()
  })
)

healthPackagesRouter.patch(
  '/wallet/subscriptions',
  asyncWrapper<SubscribeToHealthPackageRequest>(async (req, res) => {
    const { healthPackageId, subscriberId, isFamilyMember, payerUsername } =
      req.body

    const packageInfo = await getHealthPackageById(healthPackageId)
    const patient = await getPatientByUsername(payerUsername)

    if (!packageInfo || !patient || !patient.walletMoney)
      throw new NotFoundError()

    if (patient.walletMoney - packageInfo.pricePerYear < 0)
      throw new APIError('Not enough money in wallet', 400)

    const discount = await getDiscount({
      subscriberId,
      isFamilyMember,
    })

    patient.walletMoney -=
      packageInfo.pricePerYear - packageInfo.pricePerYear * discount
    await patient.save()

    await subscribeToHealthPackage({
      patientId: subscriberId,
      healthPackageId,
      isFamilyMember,
    })

    res.send(new GetWalletMoneyResponse(patient.walletMoney))
  })
)

healthPackagesRouter.patch(
  '/credit-card/subscriptions',
  asyncWrapper<SubscribeToHealthPackageRequest>(async (req, res) => {
    const { healthPackageId, subscriberId, isFamilyMember } = req.body

    await subscribeToHealthPackage({
      patientId: subscriberId,
      healthPackageId,
      isFamilyMember,
    })

    res.status(200).send()
  })
)

healthPackagesRouter.post(
  '/for-patient',
  asyncWrapper<GetHealthPackageForPatientRequest>(async (req, res) => {
    const { patientId, isFamilyMember } = req.body
    const patient = isFamilyMember
      ? await FamilyMemberModel.findById(patientId)
      : await PatientModel.findById(patientId)

    if (!patient?.healthPackage || !patient.healthPackageRenewalDate) {
      res.status(204).send({} satisfies GetHealthPackageForPatientResponse)
    } else {
      const healthPackage = await getHealthPackageById(
        patient.healthPackage.toString()
      )
      const current = new Date()
      const renewal = patient.healthPackageRenewalDate
      const months =
        (renewal.getFullYear() - current.getFullYear()) * 12 +
        renewal.getMonth() -
        current.getMonth()

      res.send({
        healthPackage: {
          name: healthPackage.name,
          id: healthPackage.id,
          pricePerYear: healthPackage.pricePerYear,
          sessionDiscount: healthPackage.sessionDiscount,
          medicineDiscount: healthPackage.medicineDiscount,
          familyMemberSubscribtionDiscount:
            healthPackage.familyMemberSubscribtionDiscount,
          renewalDate: patient.healthPackageRenewalDate.toDateString(),
          remainingMonths: months,
        },
      } satisfies GetHealthPackageForPatientResponse)
    }
  })
)

healthPackagesRouter.post(
  '/patient-cancelled',
  asyncWrapper(async (req, res) => {
    const { id, isFamilyMember } = req.body
    const model = isFamilyMember
      ? await FamilyMemberModel.findById(id)
      : await PatientModel.findById(id)

    if (!model) {
      throw new NotFoundError()
    }

    const cancelled: Types.ObjectId[] = []
    model.healthPackageHistory.forEach((healthPackage) => {
      cancelled.push(healthPackage.healthPackage)
    })
    res.send(cancelled)
  })
)

healthPackagesRouter.post(
  '/cancellation-date/:healthPackageId',
  asyncWrapper(async (req, res) => {
    const { id, isFamilyMember } = req.body
    const model = isFamilyMember
      ? await FamilyMemberModel.findById(id)
      : await PatientModel.findById(id)
    if (!model) throw new NotFoundError()
    model.healthPackageHistory.forEach((healthPackage) => {
      if (
        healthPackage.healthPackage.toString() === req.params.healthPackageId
      ) {
        res.send(healthPackage.date.toDateString())
      }
    })
  })
)
