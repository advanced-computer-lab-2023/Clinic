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
): Promise<void> {
  await HealthPackageModel.create({
    name: request.name,
    pricePerYear: request.pricePerYear,
    sessionDiscount: request.sessionDiscount,
    medicineDiscount: request.medicineDiscount,
    familyMemberSubscribtionDiscount: request.familyMemberSubscribtionDiscount,
  })
}

export async function updateHealthPackage(
  packageName: string,
  request: UpdateHealthPackageRequest
): Promise<HealthPackageDocument> {
  if (packageName == null) throw new NotFoundError()
  const updatedHealthPackage = await HealthPackageModel.findOneAndUpdate(
    { name: packageName },
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
export async function removeHealthPackage(packageName: string): Promise<void> {
  const healthPackage = await HealthPackageModel.findOneAndDelete({
    name: packageName,
  })
  if (healthPackage == null) {
    throw new NotFoundError()
  }
}
export async function getAllHealthPackages(): Promise<HealthPackageDocument[]> {
  const healthPackages = await HealthPackageModel.find({})
  if (healthPackages == null) {
    throw new NotFoundError()
  }
  return healthPackages
}
