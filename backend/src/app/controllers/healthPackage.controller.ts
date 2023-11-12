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
  subscribeToHealthPackage,
  unSubscribeToHealthPackage,
} from '../services/patient.service'
import { getPatientByUsername } from '../services/patient.service'
import { APIError, NotFoundError } from '../errors'
import { GetWalletMoneyResponse } from 'clinic-common/types/patient.types'
import { Types } from 'mongoose'

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

healthPackagesRouter.post(
  '/:id/subscribe',
  [allowAuthenticated, asyncWrapper(allowPatients)],
  asyncWrapper(async (req, res) => {
    await subscribeToHealthPackage({
      patientUsername: req.username!,
      healthPackageId: req.params.id,
    })

    res.status(200).send()
  })
)

healthPackagesRouter.post(
  '/unsubscribe',
  [allowAuthenticated, asyncWrapper(allowPatients)],
  asyncWrapper(async (req, res) => {
    const patient = await getPatientByUsername(req.username!)
    if (!patient) throw new NotFoundError()
    await unSubscribeToHealthPackage({
      id: patient.id,
    })
    console.log(patient.healthPackageHistory)
    res.status(200).send()
  })
)

healthPackagesRouter.post(
  '/:id/unsubscribe',
  [allowAuthenticated, asyncWrapper(allowPatients)],
  asyncWrapper(async (req, res) => {
    await unSubscribeToHealthPackage({
      id: req.params.id,
    })
    res.status(200).send()
  })
)

healthPackagesRouter.patch(
  '/wallet/subscriptions/:packageId',
  asyncWrapper(async (req, res) => {
    const packageId = req.params.packageId
    const userName = req.username
    const packageInfo = await getHealthPackageById(packageId)
    const patient = await getPatientByUsername(userName!)
    if (!patient || !patient.walletMoney) throw new NotFoundError()
    if (patient.walletMoney - packageInfo.pricePerYear < 0)
      throw new APIError('Not enough money in wallet', 400)
    patient.walletMoney -= packageInfo.pricePerYear
    await patient.save()
    await subscribeToHealthPackage({
      patientUsername: req.username!,
      healthPackageId: packageId,
    })
    res.send(new GetWalletMoneyResponse(patient.walletMoney))
  })
)

healthPackagesRouter.patch(
  '/credit-card/subscriptions/:packageId',
  asyncWrapper(async (req, res) => {
    const packageId = req.params.packageId
    const patient = await getPatientByUsername(req.username!)
    if (!patient) throw new NotFoundError()
    await subscribeToHealthPackage({
      patientUsername: req.username!,
      healthPackageId: packageId,
    })
    res.send(new GetWalletMoneyResponse(patient.walletMoney))
  })
)

healthPackagesRouter.post(
  '/for-patient',
  asyncWrapper<GetHealthPackageForPatientRequest>(async (req, res) => {
    const patient = await getPatientByUsername(req.body.username)

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
    const patient = await getPatientByUsername(req.username!)
    const cancelled: Types.ObjectId[] = []
    if (!patient) throw new NotFoundError()
    patient.healthPackageHistory.forEach((healthPackage) => {
      cancelled.push(healthPackage.healthPackage)
    })
    res.send(cancelled)
  })
)

healthPackagesRouter.post(
  '/cancellation-date/:healthPackageId',
  asyncWrapper(async (req, res) => {
    if (!req.username) throw new NotFoundError()
    const patient = await getPatientByUsername(req.username)
    if (!patient) throw new NotFoundError()
    console.log('looking for' + req.params.healthPackageId)
    patient.healthPackageHistory.forEach((healthPackage) => {
      console.log('history' + healthPackage.healthPackage.toString())

      if (
        healthPackage.healthPackage.toString() === req.params.healthPackageId
      ) {
        console.log(healthPackage.date.toDateString())
        res.send(healthPackage.date.toDateString())
      }
    })
  })
)
