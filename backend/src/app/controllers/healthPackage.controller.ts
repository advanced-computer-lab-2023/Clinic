import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import {
  UpdateHealthPackageResponse,
  type UpdateHealthPackageRequest,
  type createHealthPackageRequest,
  GetAllHealthPackagesResponse,
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
    await addHealthPackages(req.body)
    res.send('HealthPackage is added Successfully')
  })
)
healthPackagesRouter.patch(
  '/:name',
  asyncWrapper(allowAdmins),
  validate(UpdateHealthPackageRequestValidator),
  asyncWrapper<UpdateHealthPackageRequest>(async (req, res) => {
    const updatedHealthPackage = await updateHealthPackage(
      req.params.name,
      req.body
    )
    res.send(
      new UpdateHealthPackageResponse(
        updatedHealthPackage.name,
        updatedHealthPackage.pricePerYear,
        updatedHealthPackage.sessionDiscount,
        updatedHealthPackage.medicineDiscount,
        updatedHealthPackage.familyMemberSubscribtionDiscount
      )
    )
  })
)
healthPackagesRouter.delete(
  '/:name',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    await removeHealthPackage(req.params.name)
    res.send('deletedSuccefuly')
  })
)

healthPackagesRouter.get(
  '/',
  asyncWrapper(async (req, res) => {
    const healthPackages = await getAllHealthPackages()
    res.send(
      new GetAllHealthPackagesResponse(
        healthPackages.map((health) => ({
          name: health.name,
          pricePerYear: health.pricePerYear,
          sessionDiscount: health.sessionDiscount,
          medicineDiscount: health.medicineDiscount,
          familyMemberSubscribtionDiscount:
            health.familyMemberSubscribtionDiscount,
        }))
      )
    )
  })
)
