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
  console.log(packageName)
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
