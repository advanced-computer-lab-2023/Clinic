import { type HydratedDocument } from 'mongoose'
import { NotFoundError } from '../errors'
import {
  type HealthPackageDocument,
  HealthPackageModel,
} from '../models/healthPackage.model'
import {
  type UpdateHealthPackageRequest,
  type createHealthPackageRequest,
} from 'clinic-common/types/healthPackage.types'

export async function addHealthPackages(
  request: createHealthPackageRequest
): Promise<HydratedDocument<HealthPackageDocument>> {
  const healthPackage=await HealthPackageModel.create({
    name: request.name,
    pricePerYear: request.pricePerYear,
    sessionDiscount: request.sessionDiscount,
    medicineDiscount: request.medicineDiscount,
    familyMemberSubscribtionDiscount: request.familyMemberSubscribtionDiscount,
  })
  return healthPackage
}

export async function updateHealthPackage(
  packageId: string,
  request: UpdateHealthPackageRequest
): Promise<HydratedDocument<HealthPackageDocument>> {
  if (packageId == null) throw new NotFoundError()
  const updatedHealthPackage = await HealthPackageModel.findByIdAndUpdate(
    { _id: packageId },
    request,
    {
      new: true,
    }
  )
  if (updatedHealthPackage == null) {
    throw new NotFoundError()
  }

  return updatedHealthPackage
}
export async function removeHealthPackage(packageId: string): Promise<void> {
  const healthPackage = await HealthPackageModel.findByIdAndDelete({
    _id: packageId,
  })
  if (healthPackage == null) {
    throw new NotFoundError()
  }
}
export async function getAllHealthPackages(): Promise<
  Array<HydratedDocument<HealthPackageDocument>>
> {
  const healthPackages = await HealthPackageModel.find({})
  if (healthPackages == null) {
    throw new NotFoundError()
  }
  return healthPackages
}
