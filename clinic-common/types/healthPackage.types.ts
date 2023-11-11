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

export interface HealthPackageResponseBase {
  name: string
  id: string
  pricePerYear: number
  sessionDiscount: number
  medicineDiscount: number
  familyMemberSubscribtionDiscount: number
}

export interface UpdateHealthPackageResponse
  extends HealthPackageResponseBase {}

export interface AddHealthPackageResponse extends HealthPackageResponseBase {}

export interface GetAllHealthPackagesResponse {
  healthPackages: HealthPackageResponseBase[]
}

export interface GetHealthPackageResponse extends HealthPackageResponseBase {}

export interface GetHealthPackageForPatientRequest {
  username: string
}

export interface GetHealthPackageForPatientResponse {
  healthPackage?: HealthPackageResponseBase & {
    renewalDate: string
    remainingMonths: number
  }
}
