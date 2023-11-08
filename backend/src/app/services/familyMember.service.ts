 
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

export async function getFamilyMembers(
  username: string
): Promise<Array<HydratedDocument<FamilyMemberDocument>>> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new NotFoundError()
  }

  const patient = await PatientModel.findOne({ user: user.id }).populate<{
    familyMembers: Array<HydratedDocument<FamilyMemberDocument>>
  }>({
    path: 'familyMembers',
  })

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient.familyMembers
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

export async function getFamilyMemberById(
  id: string
): Promise<HydratedDocument<FamilyMemberDocument>> {
  const familyMember = await FamilyMemberModel.findById(id)

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

export async function findFamilyMemberByEmail(familyMemberEmail: string) {
  const patient = await PatientModel.findOne({
    email: familyMemberEmail,
  }).populate('user')

  return patient
}

export async function findFamilyMemberByMobileNumber(
  familyMemberMobileNumber: string
) {
  const patient = await PatientModel.findOne({
    mobileNumber: familyMemberMobileNumber,
  }).populate('user')

  return patient
}
