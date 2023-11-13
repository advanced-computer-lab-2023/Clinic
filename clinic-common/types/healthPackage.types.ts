import { type z } from 'zod'
import {
  type UpdateHealthPackageRequestValidator,
  type CreateHealthPackageRequestValidator,
  GetAllHealthPackagesForPatientRequestValidator,
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

export type GetAllHealthPackagesForPatientRequest = z.infer<
  typeof GetAllHealthPackagesForPatientRequestValidator
>

export type GetAllHealthPackagesForPatientResponse = Array<
  HealthPackageResponseBase & {
    discountedPricePerYear: number
  }
>

export type GetAllHealthPackagesResponse = HealthPackageResponseBase[]

export interface GetHealthPackageResponse extends HealthPackageResponseBase {}

export interface GetSubscribedHealthPackageForPatientRequest {
  patientId: string // patientId or familyMemberId
  isFamilyMember: boolean
}

export interface GetSubscribedHealthPackageForPatientResponse {
  healthPackage?: HealthPackageResponseBase & {
    renewalDate: string
    remainingMonths: number
  }
}

export type GetCancelledHealthPackagesForPatientResponse = {
  [id: string]: string // Maps ID of cancelled healthPackage to Date of cancellation
}

export interface SubscribeToHealthPackageRequest {
  // patientId or familyMemberId for the person that should be subscribed to the health package
  subscriberId: string

  /**
   * The person that is paying for the subscription
   */
  payerUsername: string

  // Indicates whether the subscribee is a the id for FamilyMember or Patient
  isFamilyMember: boolean
  healthPackageId: string
}

export interface UnsubscribeToHealthPackageRequest {
  subscriberId: string
  payerUsername: string
  isFamilyMember: boolean
}
