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
import { DoctorDocument } from '../models/doctor.model'
import { PatientDocument, PatientModel } from '../models/patient.model'
import { getDoctorSessionRateWithMarkup } from './doctor.service'
import { FamilyMemberModel } from '../models/familyMember.model'

export async function addHealthPackages(
  request: createHealthPackageRequest
): Promise<HydratedDocument<HealthPackageDocument>> {
  const healthPackage = await HealthPackageModel.create({
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
): Promise<boolean> {
  if (packageId == null) throw new NotFoundError()

  const patient = await PatientModel.findOne({ healthPackage: packageId })

  if (patient) {
    return false
  }

  const familyMember = await FamilyMemberModel.findOne({
    healthPackage: packageId,
  })

  if (familyMember) {
    return false
  }

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

  return true
}

export async function removeHealthPackage(packageId: string): Promise<boolean> {
  const patient = await PatientModel.findOne({ healthPackage: packageId })

  if (patient) {
    return false
  }

  const familyMember = await FamilyMemberModel.findOne({
    healthPackage: packageId,
  })

  if (familyMember) {
    return false
  }

  const healthPackage = await HealthPackageModel.findByIdAndDelete({
    _id: packageId,
  })

  if (healthPackage == null) {
    throw new NotFoundError()
  }

  return true
}

// export async function isPackageHasSubscribers(packageId: string): Promise<boolean> {
//   console.log("Reached")
//   const patient =await PatientModel.findOne({healthPackage:packageId})

//   if(patient){
//     return true
//   }

//   const familyMember=await FamilyMemberModel.findOne({healthPackage:packageId})

//   if(familyMember){
//     return true
//   }

//   return false
// }

export async function getAllHealthPackages(): Promise<
  Array<HydratedDocument<HealthPackageDocument>>
> {
  const healthPackages = await HealthPackageModel.find({})

  if (healthPackages == null) {
    throw new NotFoundError()
  }

  return healthPackages
}

/**
 * Silver package: patient pays 3600 LE per year and gets 40% off any doctor's session price and 20% off any medicin ordered from pharmacy platform and 10% discount on the subscribtion of any of his family members in any package
 * Gold Package: patient pays 6000 LE per year and gets 60% off any doctor's session price and 30% off any medicin ordered from pharmacy platform and 15% discount on the subscribtion of any of his family members in any package
 * Platinum Packag: patient pays 9000 LE per year and gets 80% off any doctor's session price and 40% off any medicin ordered from pharmacy platform and 20% discount on the subscribtion of any of his family members in any package
 */
export async function createDefaultHealthPackages(): Promise<
  Array<HydratedDocument<HealthPackageDocument>>
> {
  const silver = await HealthPackageModel.create({
    name: 'Silver',
    pricePerYear: 3600,
    sessionDiscount: 40,
    medicineDiscount: 20,
    familyMemberSubscribtionDiscount: 10,
  })

  const gold = await HealthPackageModel.create({
    name: 'Gold',
    pricePerYear: 6000,
    sessionDiscount: 60,
    medicineDiscount: 30,
    familyMemberSubscribtionDiscount: 15,
  })

  const platinum = await HealthPackageModel.create({
    name: 'Platinum',
    pricePerYear: 9000,
    sessionDiscount: 80,
    medicineDiscount: 40,
    familyMemberSubscribtionDiscount: 20,
  })

  return [silver, gold, platinum]
}

// Get health package by id
export async function getHealthPackageById(
  id: string
): Promise<HydratedDocument<HealthPackageDocument>> {
  const healthPackage = await HealthPackageModel.findById(id)

  if (healthPackage == null) {
    throw new NotFoundError()
  }

  return healthPackage
}

export async function getHealthPackageNameById(
  healthPackageId: string | undefined
): Promise<string> {
  try {
    if (
      healthPackageId == null ||
      healthPackageId == undefined ||
      healthPackageId == ''
    )
      return 'N/A'
    else {
      const healthPackage = await getHealthPackageById(healthPackageId)

      return healthPackage ? healthPackage.name : 'N/A'
    }
  } catch (err) {
    return 'N/A'
  }
}

export function getDoctorSessionRateForPatient({
  doctor,
  patient,
}: {
  doctor: Pick<DoctorDocument, 'hourlyRate' | 'employmentContract'>
  patient: Pick<PatientDocument, 'healthPackageRenewalDate'> & {
    healthPackage?: HealthPackageDocument
  }
}) {
  let sessionRate = getDoctorSessionRateWithMarkup({ doctor })

  if (!hasDiscountOnDoctorSession({ patient })) return sessionRate

  const healthPackageDiscount =
    (patient?.healthPackage?.sessionDiscount ?? 0) / 100
  sessionRate = sessionRate * (1 - healthPackageDiscount)

  return sessionRate
}

export function hasDiscountOnDoctorSession({
  patient,
}: {
  patient: Pick<PatientDocument, 'healthPackageRenewalDate'> & {
    healthPackage?: HealthPackageDocument
  }
}) {
  if (!patient.healthPackage || !patient.healthPackageRenewalDate) return false

  const healthPackageDiscount = patient.healthPackage.sessionDiscount / 100

  return healthPackageDiscount > 0
}
