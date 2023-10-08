import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import { type createHealthPackageRequest } from 'clinic-common/types/healthPackage.types'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth.middleware'
import { addHealthPackages } from '../services/healthPackage.service'
import { CreateHealthPackageRequestValidator } from 'clinic-common/validators/healthPackage.validator'

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
