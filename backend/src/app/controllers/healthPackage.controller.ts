import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import {
  UpdateHealthPackageResponse,
  type UpdateHealthPackageRequest,
  type createHealthPackageRequest,
} from 'clinic-common/types/healthPackage.types'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth.middleware'
import {
  addHealthPackages,
  updateHealthPackage,
} from '../services/healthPackage.service'
import {
  CreateHealthPackageRequestValidator,
  UpdateHealthPackageRequestValidator,
} from 'clinic-common/validators/healthPackage.validator'
import type mongoose from 'mongoose'

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
        updatedHealthPackage.pricePerYear as mongoose.Types.Decimal128,
        updatedHealthPackage.sessionDiscount as mongoose.Types.Decimal128,
        updatedHealthPackage.medicineDiscount as mongoose.Types.Decimal128,
        updatedHealthPackage.familyMemberSubscribtionDiscount as mongoose.Types.Decimal128
      )
    )
  })
)
