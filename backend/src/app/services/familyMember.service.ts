import type { HydratedDocument } from 'mongoose'
import {
  FamilyMemberModel,
  type FamilyMemberDocument,
} from '../models/familyMember.model'
import { type UserDocument, UserModel } from '../models/user.model'
import { NotFoundError } from '../errors'
import { type PatientDocument, PatientModel } from '../models/patient.model'
import { type AddFamilyMemberRequest } from 'clinic-common/types/familyMember.types'
import { type WithUser } from '../utils/typeUtils'
import { getPatientByUsername } from './patient.service'
import { HealthPackageDocument } from '../models/healthPackage.model'

export async function getFamilyMembers(username: string) {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new NotFoundError()
  }

  const patient = await PatientModel.findOne({ user: user.id }).populate<{
    familyMembers: Array<
      HydratedDocument<
        FamilyMemberDocument & {
          healthPackage: HydratedDocument<HealthPackageDocument>
        }
      >
    >
  }>({
    path: 'familyMembers',
    populate: 'healthPackage',
  })

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient.familyMembers.filter((familyMember) => !familyMember.patient)
}

export async function getLinkedFamilyMembers(username: string) {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new NotFoundError()
  }

  const patient = await PatientModel.findOne({ user: user.id }).populate<{
    familyMembers: Array<
      HydratedDocument<
        FamilyMemberDocument & {
          patient: PatientDocument & {
            user: UserDocument
            healthPackage: HealthPackageDocument
          }
        }
      >
    >
  }>({
    path: 'familyMembers',
    populate: {
      path: 'patient',
      populate: ['user', 'healthPackage'],
    },
  })

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient.familyMembers.filter((familyMember) => familyMember.patient)
}

export async function createFamilyMember(
  patientUsername: string,
  req: AddFamilyMemberRequest
): Promise<HydratedDocument<FamilyMemberDocument>> {
  const user = await UserModel.findOne({ username: patientUsername })

  if (user == null) {
    throw new NotFoundError()
  }

  const patient = await PatientModel.findOne({ user: user.id })

  if (patient == null) {
    throw new NotFoundError()
  }

  const familyMember = await FamilyMemberModel.create(req)

  patient.familyMembers.push(familyMember.id)

  await patient.save()

  return familyMember
}

export async function getFamilyMemberById(id: string) {
  const familyMember = await FamilyMemberModel.findById(id).populate<{
    healthPackage: HydratedDocument<HealthPackageDocument>
  }>('healthPackage')

  if (familyMember == null) {
    throw new NotFoundError()
  }

  return familyMember
}

export async function getPatientForFamilyMember(
  familyMemberId: string
): Promise<WithUser<PatientDocument>> {
  const patient = await PatientModel.findOne({
    familyMembers: {
      $in: [familyMemberId],
    },
  }).populate<{
    user: UserDocument
  }>('user')

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient
}

export async function findFamilyMemberByEmail(
  familyMemberEmail: string
): Promise<WithUser<PatientDocument>> {
  const patient = await PatientModel.findOne({
    email: familyMemberEmail,
  }).populate<{
    user: UserDocument
  }>('user')

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient
}

export async function findFamilyMemberByMobileNumber(
  familyMemberMobileNumber: string
): Promise<WithUser<PatientDocument>> {
  const patient = await PatientModel.findOne({
    mobileNumber: familyMemberMobileNumber,
  }).populate<{
    user: UserDocument
  }>('user')

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient
}

export async function findLinkingMe(
  username: string
): Promise<Array<PatientDocument>> {
  const patient: HydratedDocument<PatientDocument> | null =
    await getPatientByUsername(username)

  if (!patient) {
    throw new NotFoundError()
  }

  const meAsFamily = await FamilyMemberModel.find({ patient: patient.id })

  const familyMembers = await PatientModel.find({
    familyMembers: {
      $in: meAsFamily.map((family) => family.id),
    },
  })

  return familyMembers
}
