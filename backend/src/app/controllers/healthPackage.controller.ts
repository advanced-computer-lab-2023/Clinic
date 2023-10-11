import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import {
  UpdateHealthPackageResponse,
  type UpdateHealthPackageRequest,
  type createHealthPackageRequest,
  GetAllHealthPackagesResponse,
  AddHealthPackageResponse,
} from 'clinic-common/types/healthPackage.types'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth.middleware'
import {
  addHealthPackages,
  getAllHealthPackages,
  removeHealthPackage,
  updateHealthPackage,
} from '../services/healthPackage.service'
import {
  CreateHealthPackageRequestValidator,
  UpdateHealthPackageRequestValidator,
} from 'clinic-common/validators/healthPackage.validator'

export const healthPackagesRouter = Router()

healthPackagesRouter.post(
  '/',
  asyncWrapper(allowAdmins),
  validate(CreateHealthPackageRequestValidator),
  asyncWrapper<createHealthPackageRequest>(async (req, res) => {
    const HealthPackage= await addHealthPackages(req.body)
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
        }))
      )
    )
  })
)
