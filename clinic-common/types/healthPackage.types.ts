import { type z } from 'zod'
import {
  type UpdateHealthPackageRequestValidator,
  type CreateHealthPackageRequestValidator,
} from '../validators/healthPackage.validator'
export type createHealthPackageRequest = z.infer<
  typeof CreateHealthPackageRequestValidator
>
export type UpdateHealthPackageRequest = z.infer<
  typeof UpdateHealthPackageRequestValidator
>