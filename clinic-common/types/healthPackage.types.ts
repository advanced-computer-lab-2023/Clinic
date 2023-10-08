import { type z } from 'zod'
import {
  type UpdateHealthPackageRequestValidator,
  type CreateHealthPackageRequestValidator,
} from '../validators/healthPackage.validator'
import mongoose from 'mongoose'
export type createHealthPackageRequest = z.infer<
  typeof CreateHealthPackageRequestValidator
>
export type UpdateHealthPackageRequest = z.infer<
  typeof UpdateHealthPackageRequestValidator
>
export class HealthPackageResponseBase {
    constructor(
      public name: string,
      public pricePerYear: mongoose.Types.Decimal128,
      public sessionDiscount: mongoose.Types.Decimal128,
      public medicineDiscount: mongoose.Types.Decimal128,
      public familyMemberSubscribtionDiscount: mongoose.Types.Decimal128,
    ) {}
  }
  export class UpdateHealthPackageResponse extends HealthPackageResponseBase {}