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
export class HealthPackageResponseBase {
  constructor(
    public name: string,
    public id: string,
    public pricePerYear: number,
    public sessionDiscount: number,
    public medicineDiscount: number,
    public familyMemberSubscribtionDiscount: number
  ) {}
}
export class UpdateHealthPackageResponse extends HealthPackageResponseBase {}
export class AddHealthPackageResponse extends HealthPackageResponseBase {}
export class GetAllHealthPackagesResponse {
  constructor(public healthPackages: HealthPackageResponseBase[]) {}
}
export class GetHealthPackageResponse extends HealthPackageResponseBase {}
