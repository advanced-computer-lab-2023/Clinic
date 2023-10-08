import { HealthPackageModel } from '../models/healthPackage.model'
import { type createHealthPackageRequest } from 'clinic-common/types/healthPackage.types'

export async function addHealthPackages(
  request: createHealthPackageRequest
): Promise<void> {
  await HealthPackageModel.create({
    name: request.name,
    pricePerYear: request.pricePerYear,
    sessionDiscount: request.sessionDiscount,
    medicineDiscount: request.medicineDiscount,
    familyMemberSubscribtionDiscount: request.familyMemberSubscribtionDiscount,
  })
}
