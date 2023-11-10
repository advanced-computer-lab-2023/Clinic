import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import {
  UpdateHealthPackageResponse,
  type UpdateHealthPackageRequest,
  type createHealthPackageRequest,
  GetAllHealthPackagesResponse,
  AddHealthPackageResponse,
  GetHealthPackageResponse,
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

export const healthPackagesRouter = Router()

healthPackagesRouter.post(
  '/',
  asyncWrapper(allowAdmins),
  validate(CreateHealthPackageRequestValidator),
  asyncWrapper<createHealthPackageRequest>(async (req, res) => {
    const HealthPackage = await addHealthPackages(req.body)
    res.send(
      new AddHealthPackageResponse(
        HealthPackage.name,
        HealthPackage.id,
        HealthPackage.pricePerYear,
        HealthPackage.sessionDiscount,
        HealthPackage.medicineDiscount,
        HealthPackage.familyMemberSubscribtionDiscount
      )
    )
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
    res.send(
      new UpdateHealthPackageResponse(
        updatedHealthPackage.name,
        updatedHealthPackage.id,
        updatedHealthPackage.pricePerYear,
        updatedHealthPackage.sessionDiscount,
        updatedHealthPackage.medicineDiscount,
        updatedHealthPackage.familyMemberSubscribtionDiscount
      )
    )
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
    const patient = await getPatientByUsername(req.username!)

    res.send(
      new GetAllHealthPackagesResponse(
        healthPackages.map((healthPackage) => ({
          name: healthPackage.name,
          id: healthPackage.id,
          pricePerYear: healthPackage.pricePerYear,
          sessionDiscount: healthPackage.sessionDiscount,
          medicineDiscount: healthPackage.medicineDiscount,
          familyMemberSubscribtionDiscount:
            healthPackage.familyMemberSubscribtionDiscount,
          isSubscribed: patient?.healthPackage?.toString() === healthPackage.id,
        }))
      )
    )
  })
)

healthPackagesRouter.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const healthPackage = await getHealthPackageById(req.params.id)

    res.send(
      new GetHealthPackageResponse(
        healthPackage.name,
        healthPackage.id,
        healthPackage.pricePerYear,
        healthPackage.sessionDiscount,
        healthPackage.medicineDiscount,
        healthPackage.familyMemberSubscribtionDiscount
      )
    )
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
  '/:id/unsubscribe',
  [allowAuthenticated, asyncWrapper(allowPatients)],
  asyncWrapper(async (req, res) => {
    await unSubscribeToHealthPackage({
      patientUsername: req.username!,
      healthPackageId: req.params.id,
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
